/**
 * facebookLogin.js
 * @description :: routes of facebook authentication
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');

const { socialLogin } = require('../services/auth');

router.get('/auth/facebook/error', (req, res) => {
  res.loginFailed({ message:'Login Failed' });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile'] }));

router.get('/auth/facebook/callback',
  (req,res,next)=>{
    passport.authenticate('facebook', { failureRedirect: '/auth/facebook/error' }, async (error, user , info) => {
      if (error){
        return res.internalServerError({ message:error.message });
      }
      if (user){
        try {
          let result = await socialLogin(user.email, req.session.platform);
          if (result.flag) {
            return res.failure({ message: result.data });
          }
          return res.success({
            data: result.data,
            message:'Login Successful'
          });
        } catch (error) {
          return res.internalServerError({ message: error.message });
        }
      }
    })(req,res,next);
  });

module.exports = router;