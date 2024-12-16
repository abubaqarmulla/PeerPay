const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');
const Notification = require('../../models/notificationSchema.js');

// Query Pending transactions by senderId
async function getPendingTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'PENDING' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No pending transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching pending transactions:', error);
        res.status(500).json({ error: 'Error fetching pending transactions' });
    }
}

// Query Approved transactions by senderId
async function getApprovedTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'APPROVED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No approved transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching approved transactions:', error);
        res.status(500).json({ error: 'Error fetching approved transactions' });
    }
}

// Query Rejected Sender transactions by senderId
async function getRejectedSenderTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'REJECTED_SENDER' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No rejected sender transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching rejected sender transactions:', error);
        res.status(500).json({ error: 'Error fetching rejected sender transactions' });
    }
}

// Query Rejected Receiver transactions by senderId
async function getRejectedReceiverTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'REJECTED_RECEIVER' }); // Fixed typo here
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No rejected receiver transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching rejected receiver transactions:', error);
        res.status(500).json({ error: 'Error fetching rejected receiver transactions' });
    }
}

// Query Completed transactions by senderId
async function getCompletedTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'COMPLETED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No completed transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching completed transactions:', error);
        res.status(500).json({ error: 'Error fetching completed transactions' });
    }
}

// Query Defaulted transactions by senderId
async function getDefaultedTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'DEFAULTED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No defaulted transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching defaulted transactions:', error);
        res.status(500).json({ error: 'Error fetching defaulted transactions' });
    }
}

// Query Returned transactions by senderId
async function getReturnedTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId, transaction_state: 'RETURNED' });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No returned transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching returned transactions:', error);
        res.status(500).json({ error: 'Error fetching returned transactions' });
    }
}

// Query All transactions by senderId
async function getallTransactions(req, res) {
    const senderId = req.params.senderId;
    try {
        const transactions = await Transaction.find({ sender_id: senderId });
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching all transactions:', error);
        res.status(500).json({ error: 'Error fetching all transactions' });
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
