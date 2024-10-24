import { createLogger, transports, format } from 'winston';

const customFormat = format.combine(
  format.timestamp(),
  format.printf(({ level, message, timestamp, body }) => {
    return `${timestamp} ${level}: ${message} ${body ? JSON.stringify(body) : ''}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),
  ],
});

logger.exceptions.handle(
  new transports.File({ filename: './logs/exceptions.log' })
);

export default logger;