const express = require('express')
const router = express.Router()

const {userSignUp, userSignIn, googleSignIn} = require('../controllers/auth.controller')

router.post('/signup', userSignUp)
router.post('/signin', userSignIn)
router.post('/googlesignin', googleSignIn)


module.exports = router