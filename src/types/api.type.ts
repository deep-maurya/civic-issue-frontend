// types/api.ts
export interface ApiResponse<T = undefined> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T; // data is present only on success
  timestamp: string;
}
