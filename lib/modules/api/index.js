const register = (server, options, next) => {
  const preResponse = (request, reply) => {
    console.log("on prerespinse");
    let response = request.response;
    console.log("Response: " + request.response);
    if (response.isBoom) {
      const reformated = { errors: {} };
      reformated.errors[response.output.statusCode] = [
        response.output.payload.message,
      ];
      return reply(reformated).code(response.output.statusCode);
    }
    console.log("Before actual reply");
    return reply.continue();
  };

  server.register(require("./users"));

  server.ext("onPreResponse", preResponse);

  server.route({
    method: "GET",
    path: "/status",
    config: {
      description: "Status endpoint",
      notes: "Return the current status of the API",
      tags: ["api", "status"],
    },
    handler: (request, reply) => {
      return reply({ status: "UP" });
    },
  });
  return next();
};

register.attributes = {
  pkg: require("./package.json"),
};

module.exports = register;
