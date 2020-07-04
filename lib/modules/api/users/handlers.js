const replyHelper = require("../helpers");

module.exports = (server) => {
  function constructUserResponse(user) {
    console.log("inside constructUserResponse1");
    let authUser = { user: user.toAuthJSON() };
    console.log("inside constructUserResponse2");
    authUser.user.bio = user.bio || null;
    console.log("inside constructUserResponse3");
    authUser.user.image = user.image || null;
    console.log("inside constructUserResponse4");
    console.log(JSON.stringify(authUser));
    return authUser;
  }

  return {
    /**
     * GET /api/user
     * @param {*} request
     * @param {*} reply
     */
    getCurrentUser(request, reply) {
      return reply(constructUserResponse(request.auth.credentials.user));
    },

    updateUser(request, reply) {
      let payload = request.payload;
      let user = request.auth.credentials.user;
      console.log("updatedUuser - " + user);
      server.methods.services.users.update(
        user,
        payload,
        (err, updatedUser) => {
          console.log("updated user - " + JSON.stringify(updatedUser));
          if (err)
            return reply(replyHelper.constructErrorResponse(err)).code(422);
          console.log("Hhandler: updateuser- Before reply");
          return reply(constructUserResponse(updatedUser));
        }
      );
    },
    /**
     * POST /api/users
     * @param {*} request
     * @param {*} reply
     */
    registerUser(request, reply) {
      let payload = request.payload;

      server.methods.services.users.create(payload, (err, user) => {
        // TODO: Better error response
        if (err)
          return reply(replyHelper.constructErrorResponse(err)).code(422);
        if (!user) return reply().code(422);
        //return reply(user);
        return reply(constructUserResponse(user));
      });
    },
    /**
     * POST /api/users/login
     * @param {*} request
     * @param {*} reply
     */
    loginUser(request, reply) {
      let payload = request.payload;
      debugger;
      server.methods.services.users.getByEmail(
        payload.user.email,
        (err, user) => {
          if (err)
            return reply(replyHelper.constructErrorResponse(err)).code(422);

          if (!user) {
            return reply({
              errors: {
                404: ["email/password is invalid !"],
              },
            }).code(404);
          }

          if (!user.validPassword(payload.user.password)) {
            return reply({
              errors: {
                "email or password": ["email or password missmatch !"],
              },
            }).code(401);
          }

          return reply(constructUserResponse(user));
        }
      );
    },
  };
};
