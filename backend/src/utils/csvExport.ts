// src/utils/csvExport.ts
import { ILead } from '../types';

const escapeCSV = (value: string | Date | undefined): string => {
  if (value === undefined || value === null) return '';
  const str = value instanceof Date ? value.toISOString() : String(value);
  // Wrap in quotes if it contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const leadsToCSV = (leads: ILead[]): string => {
  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    escapeCSV(lead._id.toString()),
    escapeCSV(lead.name),
    escapeCSV(lead.email),
    escapeCSV(lead.status),
    escapeCSV(lead.source),
    escapeCSV(lead.createdAt),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};
