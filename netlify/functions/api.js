const serverless = require("serverless-http");
const app = require("../../server.js");
const inner = serverless(app);

module.exports.handler = async (event, context) => {
  if (event.path) {
    event.path = event.path.replace(/^\/\.netlify\/functions\/api/, "") || "/";
  }
  return inner(event, context);
};
