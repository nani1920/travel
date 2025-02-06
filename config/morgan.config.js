const morgan = require('morgan');

morgan.token('body', req => {
    return JSON.stringify(req.body || req.query)
});
morgan.token('splitter', (_req) => {
    return "\x1b[36m--------------------------------------------\x1b[0m";
});
morgan.token('statusColor', (_req, res, args) => {
    // get the status code if response written
    var status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
        ? res.statusCode
        : undefined

    // get status color
    var color = status >= 500 ? 31 // red
        : status >= 400 ? 33 // yellow
            : status >= 300 ? 36 // cyan
                : status >= 200 ? 32 // green
                    : 0; // no color

    return '\x1b[' + color + 'm' + status + '\x1b[0m';
});
morgan.token('responseBody', (_req, res) =>
  JSON.stringify(res.__custombody__),
)
module.exports = morgan;