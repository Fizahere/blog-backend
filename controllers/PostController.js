import Posts from "../models/Posts.js";

export const getPosts = async (req, res) => {
    try {
        const results = await Posts.find();
        res.json({ results });
    } catch (error) {
        res.status(500).json({ msg: 'internl server error.' }, error.message);
    }
}

export const createPost = async (req, res) => {
    try {
        const { author, content, } = req.body;
    } catch (error) {
        res.status(500).json({ msg: 'internal server error.' }, error.message)
    }
}