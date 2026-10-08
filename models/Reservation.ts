import mongoose, { Document, Model, Schema } from "mongoose";
import { reservationStatuses, zones } from "@/lib/validation";

export type ReservationStatus = (typeof reservationStatuses)[number];

export interface IReservation extends Document {
  userId?: string;
  reservationCode: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingOption: string;
  tableId?: mongoose.Types.ObjectId;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>({
  userId: { type: String, index: true },
  reservationCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  seatingOption: { type: String, enum: [...zones], required: true },
  tableId: { type: Schema.Types.ObjectId, ref: 'Table' },
  specialRequests: { type: String },
  status: { type: String, enum: [...reservationStatuses], default: "pending" },
}, { timestamps: true });

export const Reservation: Model<IReservation> =
  mongoose.models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema);
