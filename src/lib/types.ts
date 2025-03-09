import { Agent as PrismaAgent } from '@prisma/client';

export type Agent = PrismaAgent;

export type { PrismaAgent };

export interface ExcelRowData {
  name: string;
  phoneNumber: string;
  location: string;
  status?: string;
  telegram?: string | null;
  order?: number;
  category?: string;
}

export interface PreviewData extends ExcelRowData {}
