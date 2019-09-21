
import { pgQuery } from './make-query'

export interface IGetPgTime {
  pgQuery: typeof pgQuery
}

export interface IPgTime { now: string }
