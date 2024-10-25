import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notifications' }],
}, { timestamps: true });

const User = mongoose.model('Users', UserSchema);

export default User;
