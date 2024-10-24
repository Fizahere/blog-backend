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
    searchUsers,
    unfollowUser,
    updateUser
} from "../controllers/userController.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleWare.js";

const authRoutes = Router()

authRoutes.get('/get-users', getUsers)
authRoutes.get('/search-user/:searchterm', searchUsers)
authRoutes.post('/login', loginUser)
authRoutes.post('/create-user', createUser)
authRoutes.put('/edit-user/:id', authenticateToken,authorizeRoles('Admin'), updateUser)
authRoutes.delete('/delete-user/:id', authenticateToken,authorizeRoles('Admin'), deleteUser)
authRoutes.get('/get-user/:id', getUserById)
authRoutes.post('/follow/:targetUserId', authenticateToken, followUser);
authRoutes.post('/unfollow/:targetUserId', authenticateToken, unfollowUser);
authRoutes.get('/get-followers/:id', getFollowers);
authRoutes.get('/get-following/:id', getFollowing);

export default authRoutes