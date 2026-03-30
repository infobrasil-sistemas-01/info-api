export type JwtPayload = {
  sub: string; // registry userId
  credentials_id?: string; // dbCredentialsId
};
