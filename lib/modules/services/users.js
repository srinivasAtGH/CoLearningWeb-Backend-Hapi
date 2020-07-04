"user strict";

const User = require("../models/User");
var crypto = require("crypto");
const Boom = require("boom");
const { boomify } = require("boom");

function getUserByEmail(email, callback) {
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return callback("User not found with given email", null);
      } else {
        return callback(null, user);
      }
    })
    .catch((err) => {
      return callback(err, null);
    });
}

function getUserById(id, callback) {
  User.findOne({ where: { id: id } })
    .then((user) => {
      if (!user) {
        console.log("getUserById: User not found with given id: " + id);

        return callback(new Error("User not found with given id" + id), null);
      } else {
        return callback(null, user);
      }
    })
    .catch((err) => {
      console.log("Exception: " + err.message);
      return callback(err, null);
    });
}

function getUserByUsername(username, callback) {
  User.findOne({ where: { username: username } }).then((user) => {
    if (!user) {
      return callback("User not found with given user name: " + username, null);
    } else {
      return callback(null, user);
    }
  });
}

function createUser(payload, callback) {
  let user = new User();

  user.email = payload.user.email;
  user.username = payload.user.username;
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(payload.user.password, salt, 10000, 512, "sha512")
    .toString("hex");

  user.salt = salt;
  user.hash = hash;
  user.isguide = payload.user.isguide;
  user.iscolearner = payload.user.iscolearner;
  user.islearner = payload.user.islearner;

  user
    .save()
    .then((user) => {
      return callback(null, user);
    })
    .catch((err) => callback(err, null));
}

function updateUser(user, payload, callback) {
  User.findOne({ where: { id: user.id } })
    .then((userToUpdate) => {
      if (!userToUpdate) {
        console.log("updateUser: User not found with given id: " + user.id);
        return callback("User not found with given id" + id, null);
      } else {
        if (payload.user.bio !== null) {
          userToUpdate.bio = payload.user.bio;
        }
        console.log("User to be updated - " + userToUpdate);
        userToUpdate
          .save()
          .then((updatedUser) => {
            return callback(null, updatedUser);
          })
          .catch((err) => {
            return callback(err, null);
          });
      }
    })
    .catch((err) => {
      return callback(err, null);
    });

  if (user.username !== payload.user.username) {
    user.username = payload.user.username;
  }

  if (user.email !== payload.user.email) {
    user.email = payload.user.email;
  }

  user.bio = payload.user.bio;
  user.image = payload.user.image;

  if (payload.user.password !== "") {
    user.setPassword(payload.user.password);
  }

  user.save((err, user) => {
    if (err) return callback(err, null);
    return callback(null, user);
  });
}

module.exports = [
  {
    name: "services.users.getByEmail",
    method: getUserByEmail,
  },
  {
    name: "services.users.getById",
    method: getUserById,
  },
  {
    name: "services.users.getByUsername",
    method: getUserByUsername,
  },
  {
    name: "services.users.create",
    method: createUser,
  },
  {
    name: "services.users.update",
    method: updateUser,
  },
];
