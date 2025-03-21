import express from 'express';
import { createPost, getPost } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken , createPost);
router.get('/get/:id', getPost);

export default router;