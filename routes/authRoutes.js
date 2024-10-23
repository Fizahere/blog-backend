import { Router } from "express";
import {
    createUser,
    deleteUser,
    followUser,
    getFollowers,
    getFollowing,
    getUserById,
    getUsers,
    loginUser,
    unfollowUser,
    updateUser
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleWare.js";

const authRoutes = Router()

authRoutes.get('/get-users', getUsers)
authRoutes.post('/login', loginUser)
authRoutes.post('/create-user', createUser)
authRoutes.put('/edit-user/:id', updateUser)
authRoutes.delete('/delete-user/:id', deleteUser)
authRoutes.get('/get-user/:id', getUserById)
authRoutes.post('/follow/:targetUserId', authenticateToken, followUser);
authRoutes.post('/unfollow/:targetUserId', authenticateToken, unfollowUser);
authRoutes.get('/get-followers/:id', getFollowers);
authRoutes.get('/get-following/:id', getFollowing);

export default authRoutes