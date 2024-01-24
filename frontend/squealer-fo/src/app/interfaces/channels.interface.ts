export interface Channel {
  name: string;
  squeals?: string[];
  type: string;
  allowedRead: string[];
  allowedWrite: string[];
}
