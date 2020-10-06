//import modules & create router
import { Router } from 'express'
import passport from 'passport'

//import controllers
import { getProfile, postplaylist, getplaylist 
} from '../controllers/userController'
import { jwtauth } from '../controllers/authController'

//create & expose router to server
const router = Router()
export default router

//routes
.get('/me', jwtauth, getProfile)
//.get('/', getplaylist)
//.post('/postlist', postplaylist)