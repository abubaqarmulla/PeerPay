const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sender_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' // Reference to the user who sent the notification
    },
    receiver_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User' // Reference to the user who will receive the notification
    },
    transaction_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Transaction' // Reference to the related transaction
    },
    message: { 
        type: String, 
        required: true 
    },
    read: { 
        type: Boolean, 
        default: false 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
