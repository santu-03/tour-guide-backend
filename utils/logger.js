import pino from 'pino';

// Strip non-ASCII (like emojis) on Windows so logs don't show as garbage
const formatMessage = (msg) => {
  if (typeof msg !== 'string') return msg;
  return process.platform === 'win32'
    ? msg.replace(/[^\x20-\x7E]/g, '') // keep only printable ASCII
    : msg;
};

const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

// Wrap common log levels
const wrap = (fn) => (msg, ...args) => fn(formatMessage(msg), ...args);

logger.info = wrap(logger.info.bind(logger));
logger.error = wrap(logger.error.bind(logger));
logger.debug = wrap(logger.debug.bind(logger));
logger.warn  = wrap(logger.warn.bind(logger));

export default logger;
