const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const encryptPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
        return false;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(password);
          reject(err);
          return false;
        }
        resolve(hash);
        return true;
      });
    });
  });

const comparePassword = (password, hash) =>
  new Promise(async (resolve, reject) => {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      resolve(isMatch);
      return true;
    } catch (err) {
      reject(err);
      return false;
    }
  });

const getToken = (payload) => {
  delete payload.password;
  const token = jwt.sign({ data: payload }, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

const verifyUser = (token) => {
  try {
    // Verify JWT Token
    const payload = jwt.verify(
      token,
      process.env.AUTH_SECRET,
      function (err, decoded) {
        if (err) {
          console.log(err, "errrrrrrrrr M");

          return null;
        }

        return decoded;
      }
    );

    return { loggedIn: true, payload: payload.data };
  } catch (err) {
    // Failed Login Status
    return { loggedIn: false };
  }
};

const requireAuth = (user) => {
  if (!user) {
    throw new AuthenticationError("Unauthenticated");
  }
};

const authMiddleware = async (next, source, args, context, info) => {
  if (context.user) {
    return next(source, args, context, info);
  }
  throw new AuthenticationError(
    "Unauthorised.  You must be logged in to perform this action"
  );
};

module.exports = {
  getToken,
  verifyUser,
  encryptPassword,
  comparePassword,
  requireAuth,
  authMiddleware,
};
