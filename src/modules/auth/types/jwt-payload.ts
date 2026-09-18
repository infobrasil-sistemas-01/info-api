export type JwtPayload = {
  sub: string; // registry userId (M2M) ou código do operador (H2M)
  username?: string;
  credentials_id?: string;
  credentialsId?: string;
  store_id?: number;
  storeId?: number;
  usu_codigo?: number;
  fun_codigo?: number;
  type?: 'M2M' | 'H2M';
  iss?: string;
};
