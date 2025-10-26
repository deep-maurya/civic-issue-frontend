// types/api.ts
export interface ApiResponse<T = undefined> {
  status: String;
  user:any,
  statusCode: number;
  message: string;
  data?: T; // data is present only on success
  timestamp: string;
}
