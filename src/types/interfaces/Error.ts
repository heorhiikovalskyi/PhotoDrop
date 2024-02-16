export interface dbError {
  table_name: string;
  code: string;
  detail: string;
}

export function isDbError(obj: unknown): obj is dbError {
  if (!obj || typeof obj !== 'object') return false;
  return 'table_name' in obj && 'code' in obj && 'detail' in obj;
}
