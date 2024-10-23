import { Router } from "express";
import { createPost,deletePost,getPostById,getPosts, updatePost } from "../controllers/PostController.js";

const postRoutes=Router()

postRoutes.get('/get-posts',getPosts);
postRoutes.get('/get-post/:id',getPostById);
postRoutes.post('/create-post',createPost);
postRoutes.put('/edit-post/:id',updatePost);
postRoutes.delete('/delete-post/:id',deletePost);

export default postRoutes