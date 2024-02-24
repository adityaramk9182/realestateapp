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

const fetchAllListings = async(req, res, next) => {
  try{
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if(offer === undefined || offer === 'false'){
      offer = {$in:[true, false]}
    }

    let furnished = req.query.furnished;
    if(furnished === undefined || furnished === 'false'){
      furnished = {$in:[true, false]}
    }

    let parking = req.query.parking;
    if(parking === undefined || parking === 'false'){
      parking = {$in:[true, false]}
    }

    let type = req.query.type;
    if(type === undefined || type === 'all'){
      type = {$in:['sale', 'rent']}
    }

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || "desc";

    const Listings = await Listing.find({
      name:{$regex: searchTerm, $options:'i'},
      offer,
      furnished,
      type,
      parking
    }).sort({[sort]:order}).limit(limit).skip(startIndex);

    res.status(200).json({message:"Listings Found", Listings})
  }catch(err){
    next(err)
  }
}

module.exports = { createListing, getAllListings, deleteListing, updateListing, getSingleListing, fetchAllListings};
