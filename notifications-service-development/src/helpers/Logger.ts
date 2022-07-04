import LoggerFactory from '@distinctai/application-logger';

const Logger = LoggerFactory.configure({
  id: 'notifications',
  type: { type: 'file', filename: `logs/notifications_log_${Date.now()}` },
  level: 'info',
});

export { Logger };
