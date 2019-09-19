import { getPgTime } from '../resolver-factories/postgres/make-query'
import { Pool } from 'pg'

const rootPgReducer = (pool: Pool) => {
  return {
    getPgTime: getPgTime(pool),
  }
}

export { rootPgReducer }