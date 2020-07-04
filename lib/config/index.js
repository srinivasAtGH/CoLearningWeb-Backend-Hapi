const conf = {};

const SECRET_KEY = process.env.SECRET_KEY || "itsasecret";
const ENCODING = process.env.ENCODING || "utf8";

conf.auth = {
  secret: Buffer.from(SECRET_KEY, ENCODING),
  tokenType: "Token",
  algorithm: "HS256",
  verifyOptions: { algorithms: ["HS256"] },
};

conf.development = {
  dialect: "sqlite",
  storage: "./db.development.sqlite",
};

// conf.database = {
//   uri:
//     process.env.MONGO_DB_URI ||
//     "mongodb://localhost:27017/conduit_" + process.env.NODE_ENV,
//   options: {
//     keepAlive: 300000,
//     connectTimeoutMS: 300000,
//     useMongoClient: true,
//   },
// };

conf.swagger = {
  info: {
    title: "Learning Web API Documentation",
    version: "1.0.0",
  },
  cors: true,
  documentationPath: "/docs",
  grouping: "tags",
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  sortEndpoints: "path",
  jsonEditor: true,
  tags: [
    {
      name: "users",
      description: "Users endpoint",
    },
  ],
};

module.exports = conf;
