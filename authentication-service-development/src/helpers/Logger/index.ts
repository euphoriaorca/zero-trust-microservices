import { LoggerFactory } from './LoggerFactory';

const Logger = LoggerFactory.configure({
  id: 'authentication',
  level: 'all',
});

export { Logger };
