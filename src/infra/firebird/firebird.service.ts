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
  async getDatabaseConnection(options: IConnectionOptions) {
    const optionsFinal = {
      ...options,
      password: decrypt(ids(options.id)),
    };

    return new Promise<firebird.Database>((resolve, reject) => {
      firebird.attach(optionsFinal, (err, db) => {
        if (err) return reject(err);
        resolve(db);
      });
    });
  }
}
