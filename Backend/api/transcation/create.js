const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');
const Notification = require('../../models/notificationSchema.js');

async function createTransaction(req, res) {
    try {
        const { sender_id, receiver_id, amount, duration, description } = req.body;

        // Validate sender and receiver
        const sender = await User.findById(sender_id);
        const receiver = await User.findById(receiver_id);

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }

        // Default interest rate if not set for the receiver
        const interest_rate = receiver.interest_rate || 5; // Default rate: 5%

        // Ensure the duration is a valid positive floating-point number (in days)
        if (isNaN(duration) || duration <= 0) {
            return res.status(400).json({ error: 'Invalid or missing duration' });
        }

        // Calculate due date based on the current date and duration (in days)
        const currentDate = new Date();
        const due_date = new Date(currentDate.getTime() + duration * 24 * 60 * 60 * 1000); // Add duration in days (convert to milliseconds)

        // Create transaction request
        const transaction = new Transaction({
            transaction_id: generateTransactionId(),
            sender_id,
            receiver_id,
            amount: mongoose.Types.Decimal128.fromString(amount.toString()),
            duration: mongoose.Types.Decimal128.fromString(duration.toString()), // Store duration as a float
            interest_rate: mongoose.Types.Decimal128.fromString(interest_rate.toString()),
            description,
            due_date, // Set the calculated due date
            transaction_state: 'PENDING', // Initial state is PENDING
        });

        await transaction.save();

        res.status(201).json({ 
            message: 'Transaction request created', 
            transaction_id: transaction.transaction_id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function generateTransactionId() {
    return crypto.randomBytes(16).toString('hex');
}


async function getallNotifications(req, res) {
    const { receiverId } = req.params;
  
    try {
      const notifications = await Notification.find({ receiver_id: receiverId })
        .sort({ created_at: -1 }); // Sort notifications by creation date (most recent first)
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  }
  


module.exports = {
    createTransaction,
    getallNotifications

};
