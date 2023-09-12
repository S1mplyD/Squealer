// squeal.interface.ts
export interface AutomatedSqueal {
  body: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  originalSqueal: string;
}

export interface AutomatedSquealGeo {
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  originalSqueal: string;
}

export interface Squeal {
  body: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
}

export interface SquealMedia {
  body: string;
  type: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual?: number;
}

export interface SquealGeo {
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  author: string;
  channels?: string[];
  criticalMass?: number;
  visual?: number;
}

export interface TimedSqueal {
  body: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  time?: number;
  count?: number;
}

export interface TimedSquealGeo {
  lat: string;
  lng: string;
  recipients: string[];
  date: Date;
  positiveReactions?: number;
  negativeReactions?: number;
  category: string;
  channels?: string[];
  author: string;
  criticalMass?: number;
  visual: number;
  time?: number;
  count?: number;
}


