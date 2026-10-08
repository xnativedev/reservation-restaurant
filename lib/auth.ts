import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getAuthDatabase } from "@/lib/auth-database";
import { profileSchema } from "@/lib/validation";

async function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"));
  if (!secret || secret.length < 32) {
    throw new Error("Set a random BETTER_AUTH_SECRET of at least 32 characters. See .env.example.");
  }
  const trustedOrigins = [
    new URL(baseURL).origin,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    process.env.BETTER_AUTH_URL ? new URL(process.env.BETTER_AUTH_URL).origin : null,
  ].filter(Boolean) as string[];

  const { db } = await getAuthDatabase();
  return betterAuth({
    secret,
    baseURL,
    database: mongodbAdapter(db),
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        phone: { type: "string", required: true, input: true },
        role: { type: "string", required: true, defaultValue: "user", input: false },
      },
      changeEmail: { enabled: false },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 5 },
        "/change-password": { window: 60, max: 5 },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const profile = profileSchema.safeParse({ name: user.name, phone: user.phone });
            if (!profile.success) throw new APIError("BAD_REQUEST", { message: "Invalid name or phone", code: "INVALID_PROFILE" });
            return { data: { ...user, ...profile.data, email: user.email.trim().toLowerCase(), role: "user" } };
          },
        },
        update: {
          before: async (data) => {
            const profile = profileSchema.partial().safeParse({
              ...(data.name !== undefined ? { name: data.name } : {}),
              ...(data.phone !== undefined ? { phone: data.phone } : {}),
            });
            if (!profile.success) throw new APIError("BAD_REQUEST", { message: "Invalid name or phone", code: "INVALID_PROFILE" });
            return { data: { ...data, ...profile.data } };
          },
        },
      },
    },
  });
}

type Auth = Awaited<ReturnType<typeof createAuth>>;
const authGlobal = globalThis as typeof globalThis & { restaurantAuth?: Promise<Auth> };

export function getAuth(): Promise<Auth> {
  if (!authGlobal.restaurantAuth) {
    authGlobal.restaurantAuth = createAuth().catch((error: unknown) => {
      authGlobal.restaurantAuth = undefined;
      throw error;
    });
  }
  return authGlobal.restaurantAuth;
}

export type Session = Auth["$Infer"]["Session"];
