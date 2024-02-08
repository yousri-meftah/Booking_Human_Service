/**
 * @description : exports authentication strategy for google using passport.js
 * @params {Object} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const USERS = require('../model/USERS'); 
const dbService = require('../utils/dbService');
const { USER_TYPES } = require('../constants/authConstant');

const googlePassportStrategy = passport => {
  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENTSECRET,
    callbackURL: process.env.GOOGLE_CALLBACKURL
  }, async function (accessToken, refreshToken, profile, done) {
    if (profile){
      let userObj = {
        'username':profile.displayName,
        'ssoAuth': { 'googleId': profile.id },
        'email': profile.emails !== undefined ? profile.emails[0].value : '',
        'password':'',
        'userType':USER_TYPES.User
      };
      let found = await dbService.findOne(USERS,{ 'email': userObj.email });
      if (found) {
        const id = found.id;
        await dbService.updateOne(USERS, { _id :id }, userObj);
      }
      else {
        await dbService.create(USERS, userObj);
      }
      let user = await dbService.findOne(USERS,{ 'ssoAuth.googleId':profile.id });
      return done(null, user);
    }
    return done(null, null);
  }
  ));

};
module.exports = { googlePassportStrategy };