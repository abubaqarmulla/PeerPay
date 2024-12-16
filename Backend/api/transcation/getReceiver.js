const express = require('express');

const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');
const Notification = require('../../models/notificationSchema.js');

// Query Pending transactions by receiverId
async function getPendingTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'PENDING' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No pending transactions found' });
        }
        res.status(200).json(transactions);
        
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pending transactions' });
    }
}

// Query Approved transactions by receiverId
async function getApprovedTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'APPROVED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching approved transactions' });
    }
}

// Query Rejected Sender transactions by receiverId
async function getRejectedSenderTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'REJECTED_SENDER' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rejected sender transactions' });
    }
}

// Query Rejected Receiver transactions by receiverId
async function getRejectedReceiverTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'REJECTED_RECIVIER' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rejected receiver transactions' });
    }
}

// Query Completed transactions by receiverId
async function getCompletedTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'COMPLETED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching completed transactions' });
    }
}

// Query Defaulted transactions by receiverId
async function getDefaultedTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'DEFAULTED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching defaulted transactions' });
    }
}

// Query Returned transactions by receiverId
async function getReturnedTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId, transaction_state: 'RETURNED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching returned transactions' });
    }
}

async function getallTransactions(req, res) {
    const receiverId = req.params.receiverId;
    try {
        const transactions = await Transaction.find({ receiver_id: receiverId });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching returned transactions' });
    }
}
module.exports = {
    getallTransactions,
    getPendingTransactions,
    getApprovedTransactions,
    getRejectedSenderTransactions,
    getRejectedReceiverTransactions,
    getCompletedTransactions,
    getDefaultedTransactions,
    getReturnedTransactions,
};
