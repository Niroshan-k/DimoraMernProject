import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }
    
    if (listing.userRef) {
        return next(errorHandler(401, 'You are not authorized to delete this listing'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json("Listing deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const deleteListingAdmin = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }

    if (!req.user || req.user.role !== 'admin') {
        console.log("Role is not admin. Current role:", req.user ? req.user.role : "undefined"); // Log the role
        return next(errorHandler(401, `Not admin`));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json("Listing deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found'));
    }

    if (!req.user || req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You are not authorized to update this listing'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if(!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        let property_type = req.query.property_type;
        if (property_type === undefined || property_type === 'all') {
            property_type = { $in: ['house', 'apartment', 'villa', 'hotel'] };
        }

        const searchTerm = req.query.searchTerm || '';
        const address = req.query.address || '';

        // Ensure sorting is valid
        const validSortFields = ['createdAt', 'price']; // Only allow sorting by these fields
        let sort = req.query.sort || 'createdAt';
        if (!validSortFields.includes(sort)) {
            sort = 'createdAt'; // Default to createdAt if invalid
        }

        // Convert order to MongoDB format (-1 for desc, 1 for asc)
        let order = req.query.order === 'asc' ? 1 : -1;

        const listing = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            furnished,
            parking,
            type,
            property_type,
            address: {$regex: address, $options: 'i'}
        })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};
