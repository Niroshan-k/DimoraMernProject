import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, deleteListingAdmin } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken , createListing);
router.delete('/delete/:id',verifyToken , deleteListing);
router.delete('/admin/delete/:id',verifyToken , deleteListingAdmin);
router.post('/update/:id',verifyToken , updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings)

export default router;