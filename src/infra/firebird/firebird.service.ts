import { decrypt } from './../../utils/crypto.util';
import { Injectable } from '@nestjs/common';
import * as firebird from 'node-firebird';
import { ids } from 'src/utils/ids.util';

export interface IConnectionOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  id: number;
  pageSize: number;
}

@Injectable()
export class FirebirdService {
  /**
   * Cria um pool de conexões para o banco Firebird.
   * O pool reutiliza conexões de forma segura sem fechar o socket entre requisições,
   * evitando o erro `lazy_count` do node-firebird.
   * @param options Opções de conexão
   * @param poolSize Número máximo de conexões no pool (padrão: 5)
   */
  createPool(options: IConnectionOptions, poolSize = 5): firebird.ConnectionPool {
    const optionsFinal = {
      ...options,
      password: decrypt(ids(options.id)),
    };

    return firebird.pool(poolSize, optionsFinal);
  }
}
