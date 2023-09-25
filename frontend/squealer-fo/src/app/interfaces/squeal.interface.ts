export interface Squeal {
  _id: string;
  body: string;
  lng?: string;
  lat?: string;
  recipients: string[];
  date: Date;
  positiveReactions?: string[];
  negativeReactions?: string[];
  category: string;
  channels: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
  type: string;
  time?: number;
  count?: number;
  originalSqueal?: string;
}
