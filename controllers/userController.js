import User from "../models/Users.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/imageMiddleWare.js";

//sipn up & create user
export const createUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'Error: No File Selected!' });
            }
            const { username, email, password: plainTextPassword, bio } = req.body;
            const password = await bcrypt.hash(plainTextPassword, 10);
            const profileImage = req.file.path;
            const user = new User({
                username,
                email,
                password,
                bio,
                profileImage,
            });
            await user.save();
            res.status(201).json({ msg: 'User created.', user });
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error.', error: error.message });
    }
};

//sign in
export const loginUser = async (req, res) => {
    try {
        let { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ "message": "invalid credentials" });
        }
        password = await bcrypt.compare(password, user.password)
        if (!password) {
            res.status(401).json({ "message": "invalid credentials" });
        }
        const token = jwt.sign(
            { user: { id: user._id, username: user.username } },
            "aurora",
        );
        res.json({ token: token, user: user.username })
    } catch (error) {
        console.error(error.message)
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers following posts notifications');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, bio },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User ID is missing from request.' });
        }

        if (userId === targetUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself.' });
        }

        const userToFollow = await User.findById(targetUserId);
        const user = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found.' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (userToFollow.followers.includes(userId)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        userToFollow.followers.push(userId);
        user.following.push(targetUserId);

        await userToFollow.save();
        await user.save();

        res.status(200).json({ message: `You are now following ${userToFollow.username}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const unfollowUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user.id;

        const userToUnfollow = await User.findById(targetUserId);
        const user = await User.findById(userId);

        if (!userToUnfollow || !user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!userToUnfollow.followers.includes(userId)) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userId.toString());
        user.following = user.following.filter(following => following.toString() !== targetUserId.toString());

        await userToUnfollow.save();
        await user.save();

        res.status(200).json({ message: `You have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('followers', 'username profileImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user.followers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('following', 'username profileImage');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user.following);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
