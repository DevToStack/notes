// lib/db.js
import mysql from 'mysql2/promise'

let pool = null

export function getConnectionPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'notes_app',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        })
    }
    return pool
}

export async function query(sql, params) {
    const pool = getConnectionPool()
    const [results] = await pool.execute(sql, params)
    return results
}