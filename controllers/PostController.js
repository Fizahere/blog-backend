import Posts from "../models/Posts.js";
import { upload } from "../middlewares/imageMiddleWare.js";

export const getPosts = async (req, res) => {
    try {
        const results = await Posts.find().populate({
            path: 'author',
            select: 'username profileImage'
        }).populate({
                path: 'likes',
                select: 'username profileImage'
            });
        return res.json({ results });
    } catch (error) {
        return res.status(500).json({ msg: 'internl server error.' }, error.message);
    }
}

export const getPostById = async (req, res) => {
    try {
        const results = await Posts.findById(req.params.id);
        if (!results) {
            return res.status(404).json({ msg: 'post not found.' });
        }
        return res.status(200).json({ results });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.' });
    }
}

export const createPost = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ msg: 'no file selected!' });
            }
            const { author, content } = req.body;
            const image = req.file.path;
            const results = new Posts({
                author,
                content,
                image,
            });
            await results.save();
            return res.status(201).json({ msg: 'posted.', results });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.', error: error.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return res.status(404).json({ msg: 'Post ID is missing.' });
        }

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ msg: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ msg: 'No file selected!' });
            }

            const { author, content } = req.body;
            const image = req.file.path;

            const results = await Posts.findByIdAndUpdate(
                postId,
                { author, content, image },
                { new: true, runValidators: true }
            );

            if (!results) {
                return res.status(404).json({ msg: 'Post not found.' });
            }

            return res.status(200).json({ msg: 'Post updated.', results });
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error.' });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'post not found.' });
        }
        return res.status(200).json({ msg: 'post deleted.' });
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.', error: error.message })
    }
}

export const likePost = async (req, res) => {
    try {
        const { postId, user } = req.body;
        if (!postId) {
            return res.json({ msg: 'post Id is missing.' })
        }
        if (!user) {
            return res.json({ msg: 'user Id is missing.' })
        }
        const postToLike = await Posts.findById(postId)
        postToLike.likes.push(user)
        await postToLike.save()
        return res.status(200).json({ msg: 'liked.' })
    } catch (error) {
        return res.status(500).json({ msg: 'internal server error.' })
    }
}

export const disLikePost = async (req, res) => {
    try {
        const { postId, user } = req.body;
        if (!postId) {
            return res.json({ msg: 'post Id is missing.' })
        }
        if (!user) {
            return res.json({ msg: 'user Id is missing.' })
        }
        const postToDisLike = await Posts.findById(postId)
        postToDisLike.likes = postToDisLike.likes.filter(like => like.toString() !== user.toString())
        await postToDisLike.save()
        return res.status(200).json({ msg: 'disliked.' })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' })
    }
}

export const comment = async (req, res) => {
    try {
        const { postId, author, content } = req.body;
        const postToComentOn = await Posts.findById(postId)
        const comment = { author, content };
        postToComentOn.comments.push(comment)
        await postToComentOn.save();
        res.status(201).json({ msg: 'commented.', })
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.', error: error.message })
    }
}