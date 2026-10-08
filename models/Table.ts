import mongoose, { Document, Model, Schema } from "mongoose";
import { zones, tableStatuses } from "@/lib/validation";

export type TableZone = (typeof zones)[number];
export type TableStatus = (typeof tableStatuses)[number];

export interface ITable extends Document {
  tableNumber: string;
  zone: TableZone;
  capacity: number;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>({
  tableNumber: { type: String, required: true, unique: true },
  zone: { type: String, enum: [...zones], required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: [...tableStatuses], default: "available" },
}, { timestamps: true });

export const Table: Model<ITable> =
  mongoose.models.Table || mongoose.model<ITable>("Table", TableSchema);
