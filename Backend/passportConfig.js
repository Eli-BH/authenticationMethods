const User = require("./user");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    //define local strategy
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false); //no error no user
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result == true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );
  passport.serializeUser((user, cb) => {
    //stores a cookie in browser
    cb(null, user.id); //cookie with user id
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      //find user with that id, if error throw, if user authenticate
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};