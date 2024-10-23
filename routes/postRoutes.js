import { Router } from "express";
import { comment, createPost,deletePost,disLikePost,getPostById,getPosts, likePost, updatePost } from "../controllers/PostController.js";

const postRoutes=Router()

postRoutes.get('/get-posts',getPosts);
postRoutes.get('/get-post/:id',getPostById);
postRoutes.post('/create-post',createPost);
postRoutes.post('/like-post',likePost);
postRoutes.post('/dislike-post',disLikePost);
postRoutes.post('/comment',comment);
postRoutes.put('/edit-post/:id',updatePost);
postRoutes.delete('/delete-post/:id',deletePost);

export default postRoutes