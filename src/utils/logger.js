import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import chalk from 'chalk';
import * as util from 'util';


// eslint-disable-next-line require-jsdoc
export class Logger {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    const developmentLog = function(tokens, req, res) {
      return [
        chalk.green('[SYSTEM] ' + process.pid + '   '),
        chalk.white(new Date(tokens.date(req, res)).toLocaleString() + ' '),
        chalk.green('-'),
        chalk.yellow('[RequestHandler]'),
        chalk.green('{'),
        chalk.hex('#34ace0')(tokens.method(req, res)),
        chalk.hex('#ffb142').bold(tokens.url(req, res)),
        chalk.green('}'),
        chalk.hex('#ff5252').bold(tokens.status(req, res)),
        chalk.yellow(tokens['response-time'](req, res) + ' ms'),
      ].join(' ');
    };
    this.logger = process.env.NODE_ENV === 'production' ?
    morgan('combined') :
    morgan(developmentLog);
  }

  /**
     * Log message in console
     *
     * @param {string} message
     * @param {string} context
     */
  static log(message, context = 'Application') {
    const time = new Date().toLocaleString();
    console.log(
        chalk.green(`[SYSTEM] ${process.pid}    ${chalk.white(time)}  - ${chalk.yellow('[' + context + ']')} ${util.inspect(message, {colors: true, depth: null})}`),
    );
  }

  /**
     * Log error message in console
     *
     * @param {string} message
     * @param {string} context
     */
  static error(message, context = 'Application') {
    const time = new Date().toLocaleString();
    console.log(
        chalk.red(`[SYSTEM] ${process.pid}    ${chalk.white(time)}  - ${chalk.yellow('[' + context + ']')} ${message}`),
    );
  }

  /**
   * Format string with Chalk options
   * @param {string} value
   * @param {string} format
   * */
  static format(value, format) {
    return chalk[format](value);
  }

  // eslint-disable-next-line require-jsdoc
  writeToFile() {
    const dir = path.join(__BASEDIR, 'logs');
    const target = path.join(dir, 'system.log');
    const options = {flags: 'a'};

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    return fs.createWriteStream(target, options);
  }
}
