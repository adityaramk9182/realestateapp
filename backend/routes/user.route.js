const express = require('express');
const router = express.Router();

const {updateUserProfile, deleteUser} = require('../controllers/user.controller');
const { verifyUser } = require('../utills/VerifyUser');


router.post('/update/:id', verifyUser, updateUserProfile);
router.delete('/delete/:id', verifyUser, deleteUser);

module.exports = router