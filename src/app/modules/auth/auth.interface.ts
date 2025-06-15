
export interface IJwtPayload {
  userId: string;
  email: string;
  userName: string;
  role: string;
  iat?: number;
  exp?: number;
}
