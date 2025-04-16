import express from 'express';
import { createPost, getPost, updatePost, deletePost, getPosts, deletePostAdmin } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken , createPost);
router.post('/update/:id',verifyToken , updatePost);
router.delete('/delete/:id',verifyToken , deletePost);
router.delete('/admin/delete/:id',verifyToken , deletePostAdmin);
router.get('/get/:id', getPost);
router.get('/get', getPosts);

export default router;