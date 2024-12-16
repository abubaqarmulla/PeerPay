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

        // Find transaction
        const transaction = await Transaction.findOne({ transaction_id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check if the transaction can be rejected
        if (transaction.transaction_state !== 'APPROVED') {
            return res.status(400).json({ error: 'Only approved transactions can be rejected' });
        }

        // Update transaction state
        transaction.transaction_state = 'REJECTED_SENDER';
        await transaction.save();

        res.json({ 
            message: 'Transaction rejected successfully', 
            status: 'REJECTED' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {


    approveSender,
    rejectTransactionbySender
}