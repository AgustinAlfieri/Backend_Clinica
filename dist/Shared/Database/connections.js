import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Admin1243_',
    database: 'pruebas',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});
//# sourceMappingURL=connections.js.map