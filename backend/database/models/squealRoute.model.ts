import { Schema, model, Document } from "mongoose";

interface SquealRoute {
  name: string;
  timeBetween: number;
  reference: string;
}

interface SquealRouteDocument extends SquealRoute, Document {}

const squealRouteSchema = new Schema<SquealRouteDocument>({
  name: { type: String, required: true, unique: true },
  timeBetween: { type: Number, required: true },
  reference: { type: String },
});

const squealRouteModel = model<SquealRouteDocument>(
  "squealRouteData",
  squealRouteSchema,
);

export default squealRouteModel;
