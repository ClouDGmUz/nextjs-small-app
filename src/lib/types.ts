import { Agent as PrismaAgent } from '@prisma/client';

export type Agent = PrismaAgent;

export type { PrismaAgent };

export interface ExcelRowData {
  name: string;
  phoneNumber?: string;
  'phone number'?: string;
  location: string;
  status?: string;
  telegram?: string | null;
  order?: number;
  category?: string;
}

export interface PreviewData {
  name: string;
  phoneNumber?: string;
  'phone number'?: string;
  location: string;
  status?: string;
  telegram?: string | null;
  order?: number;
  category?: string;
  previewId?: string;
  timestamp?: Date;
}
