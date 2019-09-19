import { Pool } from 'pg'

const getPgTime = (pool: Pool) =>
  async (): Promise<string> => {
    const time = await pool.query('SELECT NOW()')
    const now: string = time.rows[0].now
    return now
  }

export { getPgTime }