import { rootPgReducer } from './pg-resolver'
import { createPgPool } from '../resolver-factories/postgres/create-pool'
import { Pool } from 'pg'
import { rootUserReducer } from './user-resolver';

export interface IRootFactory {
  createPool: any
}

const rootFactory = (dependencies: IRootFactory) => () => {
  const { createPool } = dependencies
  const pool: Pool = createPool()

  return {
    ...rootPgReducer(pool),
    ...rootUserReducer()
  }
};

const root = rootFactory({ createPool: createPgPool })

export { root, rootFactory }