export type JwtPayload = {
  sub: string; // registry userId
  username?: string; // username
  credentials_id: string; // dbCredentialsId,
  store_id: number; // storeId
};
