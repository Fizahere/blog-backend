import { Router } from "express";
import { createPost,getPosts } from "../controllers/PostController.js";

const postRoutes=Router()

postRoutes.get('/get-posts',getPosts);
postRoutes.post('/create-posts',createPost);

export default postRoutes