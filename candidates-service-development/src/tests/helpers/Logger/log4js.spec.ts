import log4js from '@distinctai/application-logger/node_modules/log4js';
import { Log4js } from '@distinctai/application-logger/src/Log4js';

describe('Logger -> Log4js test suite', () => {
  let logger: Log4js;

  beforeEach(() => {
    console.log = jest.fn();

    log4js.configure = jest.fn();
    log4js.getLogger = jest.fn().mockReturnValue({
      info: console.log,
      warn: console.log,
      error: console.log,
    });

    logger = new Log4js({
      id: 'candidate-test',
      type: { type: 'console' },
    });
  });

  it('Info logging', () => {
    const text = 'Information';

    logger.Info(text);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith([text]);
  });

  it('Warn logging', () => {
    const text = 'Warning';

    logger.Warn(text);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith([text]);
  });

  it('Error logging', () => {
    const text = 'Fatal Error';

    logger.Error(text);

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith([text]);
  });
});
