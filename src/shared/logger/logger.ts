import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Muestra en consola
    new winston.transports.File({ filename: 'app.log' }) // Guarda en archivo
  ]
});

new winston.transports.File({
  filename: 'app.log',
  level: 'warn',
  maxsize: 1024 * 1024,
  maxFiles: 5,
  tailable: true
})

export { logger };