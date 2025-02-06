/** @format */
require("dotenv").config();
const mongoose = require("mongoose");
const env = process.env;
let connection = `${env.DB_CONNECTION}://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
if (env.DB_SRV && env.DB_SRV != "") {
  connection = env.DB_SRV;
}
// console.log(connection);

mongoose.connect(connection, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  ssl: true,
});

mongoose.connection.on("error", (e) => console.log(e));
mongoose.connection.on("open", () => console.log("Connected to mongo server."));

mongoose.Promise = Promise;

module.exports = {
  mongoose,
  connection,
};
