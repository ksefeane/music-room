//import modules & create router
import { Router } from 'express'
import passport from 'passport'

//import controllers
import { jwtauth, licenseAuth } from '../controllers/authController'
import { getProfile, getFriends, getSettings, makeLicense, removeLicense, getKey, getLicensedPlaylists
} from '../controllers/userController'

//create & expose router to server
const router = Router()
export default router

//routes
/**
 * @swagger
 * /user/me:
 *  get:
 *      description: Fetches a user's profile
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.get('/me', jwtauth, getProfile)
/**
 * @swagger
 * /user/friends:
 *  get:
 *      description: Fetches a user's friends
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.get('/friends', jwtauth, getFriends)
/**
 * @swagger
 * /user/settings:
 *  get:
 *      description: Fetches a user's settings
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.get('/settings', jwtauth, getSettings)

//.post('/postlist', postplaylist)

//licence
/**
 * @swagger
 * /user/give-license:
 *  post:
 *      description: Creates a license to allow other users to edit your playlist
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.post('/give-license', jwtauth, makeLicense)
/**
 * @swagger
 * /user/revoke-license:
 *  post:
 *      description: Deletes a license that allows other users to edit your playlist
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.post('/revoke-license',jwtauth, removeLicense)
/**
 * @swagger
 * /user/get-licensed-playlists:
 *  post:
 *      description: Fetches playlists that a user can edit. Playlists where the user was given license(s) to edit
 *      responses:
 *          200:
 *              description: ran successfully
 *          404:
 *              description: requires authentication
 */
.post('/get-licensed-playlists', getLicensedPlaylists)