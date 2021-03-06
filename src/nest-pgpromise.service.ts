// tslint:disable: variable-name
import { Injectable, Inject, Logger } from '@nestjs/common';
import { NEST_PGPROMISE_OPTIONS } from './constants';
import { NestPgpromiseOptions } from './interfaces';
import * as pg from 'pg-promise';

interface INestPgpromiseService {
  getPg(): Promise<any>;
}

@Injectable()
export class NestPgpromiseService implements INestPgpromiseService {
  private readonly logger: Logger;
  private _pgConnection: any;
  constructor(
    @Inject(NEST_PGPROMISE_OPTIONS)
    private _NestPgpromiseOptions: NestPgpromiseOptions,
  ) {
    this.logger = new Logger('NestPgpromiseService');
   
  }

  async getPg(): Promise<any> {
    if (!this._pgConnection) {
      const self = this;
      const initOptions = {
        ...this._NestPgpromiseOptions.initOptions,
        ...{
          error(error, e) {
            if (e.cn) {
              self.logger.error('EVENT:', error.message || error);
            }
          },
        },
      };

      const pgp = pg(initOptions);
      this._pgConnection = pgp(this._NestPgpromiseOptions.connection);
    }
    return this._pgConnection;
  }
}
