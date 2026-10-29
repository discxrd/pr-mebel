export interface SendOptions {
  fields: any;
  files: any[];
  size: string;
  geo: {
    country?: string;
    regionName?: string;
    city?: string;
    lat?: number;
    lon?: number;
  };
  ip?: string;
  timeOnSite: string;
  req: any;
  utm?: any;
}
