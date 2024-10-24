import User from "../models/Users.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { upload } from "../middlewares/imageMiddleWare.js";

export const getUsers = async (req, res) => {
    try {
        const results = await User.find();
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//sipn up & create user
export const createUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            const { username, email, password: plainTextPassword, bio } = req.body;
            const findUserByUsername = await User.findOne({ username })
            const findUserByEmail = await User.findOne({ email })
            if (findUserByUsername) {
                res.json({ msg: 'username already exist.' })
            }
            if (findUserByEmail) {
                res.json({ msg: 'email already exist.' })
            }
            const password = await bcrypt.hash(plainTextPassword, 10);
            const profileImage = req.file.path;
            const results = new User({
                username,
                email,
                password,
                bio,
                profileImage,
            });
            await results.save();
            return res.status(201).json({ msg: 'user created.', results });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};

//sign in
export const loginUser = async (req, res) => {
    try {
        let { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ msg: "invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "invalid credentials" });
        }
        const token = jwt.sign(
            { user: { id: user._id, username: user.username, role: user.role } },
            "aurora",
            // { expiresIn: '1h' }
        );
        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const results = await User.findById(req.params.id).populate('posts notifications');
        if (!results) {
            return res.status(404).json({ msg: 'user not found' });
        }
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            const { username, email, bio } = req.body;
            const profileImage = req.file.path;
            const results = await User.findByIdAndUpdate(
                req.params.id,
                { username, email, bio, profileImage },
                { new: true, runValidators: true }
            );
            if (!results) {
                return res.status(404).json({ msg: 'user not found' });
            }
            return res.status(200).json({ msg: 'user updated.', results });
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const results = await User.findByIdAndDelete(req.params.id);
        if (!results) {
            return res.status(404).json({ msg: 'user not found' });
        }
        return res.status(200).json({ msg: 'user deleted.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const followUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ msg: 'user id is missing.' });
        }

        if (userId === targetUserId) {
            return res.status(400).json({ msg: 'ypu cannot follow yourself.' });
        }

        const userToFollow = await User.findById(targetUserId);
        const user = await User.findById(userId);

        if (!userToFollow) {
            return res.status(404).json({ msg: 'user to follow not found.' });
        }

        if (!user) {
            return res.status(404).json({ msg: 'user not found.' });
        }

        if (userToFollow.followers.includes(userId)) {
            return res.status(400).json({ msg: 'you are already following.' });
        }

        userToFollow.followers.push(userId);
        user.following.push(targetUserId);

        await userToFollow.save();
        await user.save();

        return res.status(200).json({ msg: `you are now following ${userToFollow.username}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const unfollowUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user.id;

        const userToUnfollow = await User.findById(targetUserId);
        const user = await User.findById(userId);

        if (!userToUnfollow || !user) {
            return res.status(404).json({ msg: 'user not found.' });
        }

        if (!userToUnfollow.followers.includes(userId)) {
            return res.status(400).json({ msg: 'you are not following.' });
        }

        userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== userId.toString());
        user.following = user.following.filter(following => following.toString() !== targetUserId.toString());

        await userToUnfollow.save();
        await user.save();

        return res.status(200).json({ msg: `you have unfollowed ${userToUnfollow.username}` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowers = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await User.findById(id).populate('followers', 'username profileImage');

        if (!results) {
            return res.status(404).json({ msg: 'user not found.' });
        }

        return res.status(200).json(results.followers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await User.findById(id).populate('following', 'username profileImage');

        if (!results) {
            return res.status(404).json({ msg: 'user not found.' });
        }

        return res.status(200).json(results.following);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const searchedValue = req.params.searchterm;
        if (!searchedValue) {
            return res.status(400).json({ msg: "search term is required." });
        }
        const result = await User.find({
            "$or": [
                { "content": { $regex: searchedValue, $options: 'i' } }
            ]
        });
        if (result.length === 0) {
            return res.status(404).json({ msg: "user not found." });
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "internal server error.", error: error.message });
    }
};