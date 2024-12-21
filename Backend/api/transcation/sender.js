const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');

async function approveSender(req, res){
    try {
        const { transaction_id } = req.body;

        const transaction = await Transaction.findOne({ transaction_id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update sender approval
        transaction.sender_approved = true;
        
        // If both parties have approved, move to approved state
       
        transaction.transaction_state = 'APPROVED';
        

        await transaction.save();

        res.json({ 
            message: 'Transaction approved by sender', 
            transaction 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function rejectTransactionbySender(req, res) {
    try {
        const { transaction_id } = req.body;

        // Find the transaction using the provided transaction_id
        const transaction = await Transaction.findOne({ transaction_id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check if the transaction is already in a 'REJECTED' state
        if (transaction.transaction_state === 'REJECTED_SENDER' || transaction.transaction_state === 'REJECTED_RECEIVER') {
            return res.status(400).json({ error: 'Transaction has already been rejected' });
        }

        // Reject the transaction by the sender directly
        if (transaction.transaction_state === 'APPROVED' || transaction.transaction_state === 'PENDING') {
            transaction.transaction_state = 'REJECTED_SENDER';  // Reject transaction from sender's side
            await transaction.save();

            return res.json({ 
                message: 'Transaction rejected successfully by sender', 
                status: 'REJECTED' 
            });
        } else {
            // If the transaction is not in an 'APPROVED' or 'PENDING' state, we cannot reject it
            return res.status(400).json({ error: 'Only pending or approved transactions can be rejected' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {


    approveSender,
    rejectTransactionbySender
}