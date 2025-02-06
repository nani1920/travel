const {
    createLogger,
    format,
    transports
  } = require('winston');
  require('winston-daily-rotate-file');
  const {
    combine,
    timestamp,
    label,
    printf
  } = format;
  const moment = require('moment');
  var path = require('path')
  
  var PROJECT_ROOT = path.join(__dirname, '..')
  
  const myFormat = printf(({
    level,
    message,
    label,
    timestamp
  }) => {
    return `${timestamp} ${level}: ${message}`;
  });
  
  const serverTransport = new transports.DailyRotateFile({
    filename: './logs/server-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '10d',
  });
  
  // const errorTransport = new transports.DailyRotateFile({
  //   filename: './logs/error-%DATE%.log',
  //   datePattern: 'YYYY-MM-DD',
  //   zippedArchive: true,
  //   maxSize: '20m',
  //   maxFiles: '10d',
  //   level: 'info'
  // });
  
  const logger = createLogger({
    format: combine(
      format.splat(),
      format.simple(),
      label({
        label: null
      }),
      timestamp(),
      myFormat
    ),
    transports: [
      serverTransport
      // new transports.File({
      //   filename: `./logs/${moment().format('YYYY-MM-DD')}.server.log`,
      //   level: 'info'
      // }),
      // new transports.File({
      //   filename: `./logs/${moment().format('YYYY-MM-DD')}.error.log`,
      //   level: 'error'
      // })
    ]
  });
  
  // A custom logger interface that wraps winston, making it easy to instrument
  // code and still possible to replace winston in the future.
  
  module.exports.debug = module.exports.log = function () {
    logger.debug.apply(logger, formatLogArguments(arguments))
  }
  
  module.exports.info = function () {
    logger.info.apply(logger, formatLogArguments(arguments))
  }
  
  module.exports.warn = function () {
    logger.warn.apply(logger, formatLogArguments(arguments))
  }
  
  module.exports.error = function () {
    logger.error.apply(logger, formatLogArguments(arguments))
  }
  
  
  /**
   * Attempts to add file and line number info to the given log arguments.
   */
  function formatLogArguments(args) {
    args = Array.prototype.slice.call(args)
  
    var stackInfo = getStackInfo(1)
  
    if (stackInfo) {
      // get file path relative to project root
      var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'
  
      if (typeof (args[0]) === 'string') {
        args[0] = calleeStr + ' ' + args[0]
      } else {
        args.unshift(calleeStr)
      }
    }
  
    return args
  }
  
  
  /**
   * Parses and returns info about the call stack at the given index.
   */
  function getStackInfo(stackIndex) {
    // get call stack, and analyze it
    // get all file, method, and line numbers
    var stacklist = (new Error()).stack.split('\n').slice(3)
  
    // stack trace format:
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi
  
    var s = stacklist[stackIndex] || stacklist[0]
    var sp = stackReg.exec(s) || stackReg2.exec(s)
  
    if (sp && sp.length === 5) {
      return {
        method: sp[1],
        relativePath: path.relative(PROJECT_ROOT, sp[2]),
        line: sp[3],
        pos: sp[4],
        file: path.basename(sp[2]),
        stack: stacklist.join('\n')
      }
    }
  }
  
  
  module.exports.log = logger;