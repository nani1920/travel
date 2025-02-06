/** @format */

require("dotenv-safe").config({
  allowEmptyValues: true,
});
require("./config/database");
const createError = require("http-errors");
const express = require("express");
const httpContext = require("express-http-context");
const path = require("path");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const expressHandleBar = require("express-handlebars");
const cors = require("cors");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const passportLocalMongoose = require('passport-local-mongoose');
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
// const session = require("express-session");
// const MongoStore = require('connect-mongo')(session);

const Arena = require("bull-arena");
const Bull = require("bull");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const helmet = require("helmet");
const uuid = require("uuid").v4;

// const SQLiteStore = require('connect-sqlite3')(session);

const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");

// const redis = require("redis");
// const redisStore = require("connect-redis")(session);
// const client = redis.createClient();

/* Custom Files*/
const { transaction } = require("./http/middlewares/dbTransaction.middleware");
const constants = require("./helpers/constants");
const logger = require("./config/logger");
const morgan = require("./config/morgan.config");
/* End Custom Files*/

/* Models*/
/* End  Models*/

/**Global Constants */
global.CONSTANTS = constants;
/**End Global Constants */

// i18n translations
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + "/resources/locales/{{lng}}/{{ns}}.json",
    },
    fallbackLng: "en",
    preload: ["en", "hi"],
  });
// i18n

/* Route Imports*/
const apiRouter = require("./routes/api.routes");
const authRouter = require("./routes/auth.routes");
/* End Route Imports*/

const app = express();

app.use(httpContext.middleware);
app.use((req, res, next) => {
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
  const requestId = req.headers["x-request-id"] || uuid();
  httpContext.set("_reqId", requestId);
  console.log("Request Id set is: ", httpContext.get("_reqId"));
  next();
});

const originalSend = app.response.send;
app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body);
  this.__custombody__ = body;
};

app.use(cors());
// var crons = require('./crons/index');
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
// app.use(helmet())
app.use(i18nextMiddleware.handle(i18next));
// Bull Arena
// const arena = Arena({
//   Bull,
//   queues: [
//     ...Object.keys(notificationQueues).map(queue => Object.assign({}, { name: queue, hostId: queue + ' Queue' }))
//   ],
// }, {
//   basePath: "/",
//   disableListen: true,
// });

// app.use('/redbull/arena', arena);
// End Bull Arena

/// Body Parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));

const hbs = expressHandleBar.create({
  extname: ".hbs",
  layoutsDir: __dirname + "/views/layouts",
  defaultLayout: "main.hbs",
  helpers: {
    Section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});

app.engine("hbs", hbs.engine);

app.set("view engine", "hbs");

// Rate Limiter
app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // n minutes
  max: 100, // limit each IP to n requests per windowMs
});
// Rate Limiter

//  apply to all requests
// app.use(limiter);

/// MongoDB Session
// app.use(session({
//   store: new MongoStore({
//     url: connection,
//     ttl: 14 * 24 * 60 * 60, // = 14 days. Default
//     autoRemove: 'native'
//   }),
//   secret: 'your secret',
//   saveUninitialized: false,
//   resave: false
// }));
/// End MongoDB Session

// app.use(validator());
// app.use(morgan('dev'));
const logString = `:splitter\n\x1b[33m:method\x1b[0m \x1b[36m:url\x1b[0m :statusColor :response-time ms - length|:res[content-length] :remote-addr :body  ":referrer" responseBody=:responseBody ":user-agent \n:splitter`;
// if (process.env.NODE_ENV === 'development') {
app.use(morgan(logString));
// } else {
//   app.use(morgan(logString, { stream: { write: message => logger.info(message.trim(), { tags: ['http'] }) } })); // For Production
// }
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, 'angular')));
app.use(transaction);

app.post("/ingress-webhook", (req, res) => {
  console.log(req.body);
  res.send("Ingress Webhook called");
});

app.use("/api", limiter, apiRouter);
app.use("/auth", limiter, authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// running the server

app.listen(process.env.PORT, () => {
  console.log("server is listening at http://localhost:3000");
});

module.exports = app;
