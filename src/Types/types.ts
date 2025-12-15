/* Error Interface */
export interface IError {
  message: string;
  status?: number;
  cause?: number;
  stack?: string;
}
