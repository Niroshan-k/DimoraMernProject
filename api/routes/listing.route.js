import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, deleteListingAdmin, incrementViews, like, liked, getLikedListings, unlike, getAllListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken , createListing);
router.delete('/delete/:id',verifyToken , deleteListing);
router.delete('/admin/delete/:id',verifyToken , deleteListingAdmin);
router.post('/update/:id',verifyToken , updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.post('/incrementViews/:id', incrementViews);
router.post('/like/:id', verifyToken, like);
router.get('/liked/:listingId/:userId', verifyToken , liked);
router.get('/userLiked/:userId',verifyToken , getLikedListings);
router.post('/unlike/:id',verifyToken ,unlike);
router.get('/all', getAllListings);

export default router;