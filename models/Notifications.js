import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['new_follower', 'new_like', 'new_comment'], required: true },
    relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

const Notifications = mongoose.model('Notifications', NotificationSchema)

export default Notifications;