import express from "express";
import { test, updateUser, deleteUser, getUserListings, getSellerInfo, getUserPosts, getUsers, deleteUserAdmin, getUserInfo, getUserListingsAdmin } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get( '/test',test );
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.delete('/admin/delete/:id',verifyToken, deleteUserAdmin);
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/posts/:id', verifyToken, getUserPosts);
router.get('/get/:id', getSellerInfo);
router.get('/get', verifyToken, getUsers);
router.get('/get/:id', verifyToken, getUserInfo);
router.get('/admin/listings/:id', verifyToken, getUserListingsAdmin);

export default router;