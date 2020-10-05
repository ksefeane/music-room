const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const DeezerStrategy = require('passport-deezer');
const keys = require('./keys');
import { findOrCreate, fetchUser } from "../models/userModel";

passport.use(
    new GoogleStrategy({
        callbackURL: '/users/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, async (accessToken, refreshToken, profile, done) => {
        let email = profile.emails[0].value
        let user_data = {
            'username': email.split('@')[0],
            'name': profile.name.givenName,
            'surname': profile.name.familyName,
            'email': email
        }
        let test = await findOrCreate(user_data);
        done(null, test);
    })
)

passport.use(
    new DeezerStrategy({
        clientID: keys.deezer.clientID,
        clientSecret: keys.deezer.clientSecret,
        callbackURL: '/users/auth/deezer-pass/redirect',
    }, (accessToken, refreshToken, profile, done) => {
        console.log('Access token', accessToken)
        console.log('Refresh token', refreshToken)
        console.log('Profile', profile)
    })
)

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser(async (uid, done) => {
    console.log(uid)
    done(null, await fetchUser(uid));
})