const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');  // Import User model

async function approveReceiver(req, res) {
    try {
        const { transaction_id } = req.body;
        
        const transaction = await Transaction.findOne({ transaction_id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        // Fetch sender and receiver
        const sender = await User.findById(transaction.sender_id);
        const receiver = await User.findById(transaction.receiver_id);
        
        // Validate transaction state
        if (transaction.transaction_state !== 'APPROVED') {
            return res.status(400).json({ error: 'Transaction not in approved state' });
        }
        
        // Convert Decimal128 to number
        const receiverAmount = receiver.Amount ? parseFloat(receiver.Amount.toString()) : 0;
        const senderAmount = sender.Amount ? parseFloat(sender.Amount.toString()) : 0;
        const principalAmount = parseFloat(transaction.amount.toString());
        
        // Validate amounts
        if (isNaN(receiverAmount) || isNaN(senderAmount) || isNaN(principalAmount)) {
            return res.status(400).json({ 
                error: 'Invalid amount values',
                receiverAmount,
                senderAmount,
                principalAmount
            });
        }
        
        // Check receiver's balance
        if (receiverAmount < principalAmount) {
            transaction.transaction_state = 'DEFAULTED';
            await transaction.save();
            return res.status(400).json({
                error: 'Insufficient balance',
                status: 'DEFAULTED'
            });
        }
        
        // Update balances with precise rounding
        receiver.Amount = mongoose.Types.Decimal128.fromString((receiverAmount + principalAmount).toFixed(2));
        sender.Amount = mongoose.Types.Decimal128.fromString((senderAmount - principalAmount).toFixed(2));
        
        await receiver.save();
        await sender.save();
        
        // Update transaction
        transaction.receiver_approved = true;
        transaction.transaction_state = 'COMPLETED';
        transaction.amount_returned = false;
        
        await transaction.save();
        
        res.json({
            message: 'Transaction completed',
            total_amount: transaction.amount,
            receiverRemainingBalance: parseFloat(receiver.Amount.toString()),
            senderNewBalance: parseFloat(sender.Amount.toString())
        });
    } catch (error) {
        console.error('Transaction Error:', error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        });
    }
}

async function rejectTransactionbyReceiver(req, res) {
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
        transaction.transaction_state = 'REJECTED_RECEIVER';  // Fixed typo
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
    approveReceiver,
    rejectTransactionbyReceiver  // Fixed typo here as well
}
