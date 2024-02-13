const express = require('express');
const {verifyUser} = require('../utills/VerifyUser');
const { createListing, getAllListings, deleteListing, updateListing, getSingleListing } = require('../controllers/listing.controller');

const router = express.Router();

router.post('/create', verifyUser, createListing);
router.get('/fetch/:id', verifyUser, getAllListings);
router.delete('/delete/:id', verifyUser, deleteListing);
router.post('/update/:id', verifyUser, updateListing);
router.get('/getlisting/:id', verifyUser, getSingleListing);

module.exports = router;