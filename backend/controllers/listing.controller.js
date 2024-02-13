const Listing = require("../models/listing.model");
const { errorHandler } = require("../utills/error");

const createListing = async (req, res, next) => {
  // console.log(res.body)
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res
      .status(201)
      .json({ message: "Listing created Successfully", listing: newListing });
  } catch (err) {
    next(err);
  }
};

const getAllListings = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      const userListings = await Listing.find({ userRef: req.params.id });
      res
        .status(200)
        .json({ message: "FOUND LISTINGS", listings: userListings });
    } else {
      return next(errorHandler(401, "you can only view your own listings"));
    }
  } catch (err) {
    next(err);
  }
};

const getSingleListing = async(req, res, next) => {
    try{
        const listing = await Listing.findById(req.params.id);
        if(req.user.id !== listing.userRef) next(errorHandler(400, 'You Can Only get Your Listings.'));

        res.status(200).json(listing);
    }catch(err){
        next(err)
    }
}

const deleteListing = async (req, res, next) => {
  const ListingExists = await Listing.findById(req.params.id);
  if (!ListingExists) {
    next(errorHandler(404, "Listing Not Found"));
  }

  if (req.user.id !== ListingExists.userRef) {
    next(errorHandler(404, "You can only delete your listing."));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (err) {
    next(err);
  }
};

const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) next(errorHandler(404, 'Listing Not Found'));

    if(req.user.id !== listing.userRef) next(errorHandler(500, 'you only allowed to update your listings'))
    try{
        const updatedlisting = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.status(200).json(updatedlisting)
    } catch (err) {
        next(err)
    }
};

module.exports = { createListing, getAllListings, deleteListing, updateListing, getSingleListing };
