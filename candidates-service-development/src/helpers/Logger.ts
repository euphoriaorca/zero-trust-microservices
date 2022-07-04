import LoggerFactory from '@distinctai/application-logger';

const Logger = LoggerFactory.configure({
  id: 'candidates',
  type: { type: 'file', filename: `logs/candidates_logs_${Date.now()}` },
  level: 'info',
});

export { Logger };
