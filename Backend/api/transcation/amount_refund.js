const express = require('express');
const mongoose = require('mongoose')
const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');
const Notification = require('../../models/notificationSchema.js');

// Function to calculate accurate interest
function calculateInterest(principal, rate, duration) {
    const principalNum = parseFloat(principal.toString());
    const rateNum = parseFloat(rate.toString());
    const durationNum = parseFloat(duration.toString());

    return principalNum * (rateNum / 100) * (durationNum/365); // Interest rate annualized
}

// API to fetch and process transactions for logged-in user
async function money_overdue(req, res) {
    const { senderId } = req.body;

    if (!senderId) {
        return res.status(400).json({ error: 'Sender ID is required' });
    }

    try {
        const now = new Date();
        const overdueTransactions = await Transaction.find({
            sender_id: senderId,
            transaction_state: 'COMPLETED',
            due_date: { $lte: now },
        });

        let processedTransactions = [];
        let defaultedTransactions = [];

        for (const transaction of overdueTransactions) {
            const receiver = await User.findById(transaction.receiver_id);
            const sender = await User.findById(transaction.sender_id);

            if (!receiver || !sender) {
                console.warn(`User not found for transaction ${transaction.transaction_id}`);
                continue;
            }

            // Robust conversion of Decimal128 to number
            const principal = parseFloat(transaction.amount.toString());
            const receiverAmount = receiver.Amount ? parseFloat(receiver.Amount.toString()) : 0;
            
            const interest = calculateInterest(
                principal, 
                parseFloat(transaction.interest_rate.toString()), 
                parseFloat(transaction.duration.toString())
            );
            const totalAmount = principal + interest;

            console.log(`Receiver Amount: ${receiverAmount}, Total Amount: ${totalAmount}`);
            console.log(`Principal: ${principal}, Interest: ${interest}`);

            // Use precise number comparison
            if (receiverAmount >= totalAmount) {
                // Deduct from receiver and add to sender
                const newReceiverAmount = receiverAmount - totalAmount;
                const newSenderAmount = parseFloat(sender.Amount.toString()) + totalAmount;

                // Convert back to Decimal128
                receiver.Amount = mongoose.Types.Decimal128.fromString(newReceiverAmount.toFixed(2));
                sender.Amount = mongoose.Types.Decimal128.fromString(newSenderAmount.toFixed(2));

                transaction.transaction_state = 'RETURNED';
                transaction.amount_returned = true;

                await receiver.save();
                await sender.save();
                await transaction.save();

                processedTransactions.push(transaction.transaction_id);
                console.log(`Transaction ${transaction.transaction_id} marked as RETURNED.`);
            } else {
                // Set transaction as defaulted
                transaction.transaction_state = 'DEFAULTED';
                await transaction.save();

                // Create a notification
                const notification = new Notification({
                    sender_id: transaction.sender_id,
                    receiver_id: transaction.receiver_id,
                    transaction_id: transaction._id,
                    message: `Transaction ${transaction.transaction_id} has defaulted due to insufficient balance.`,
                });
                await notification.save();

                defaultedTransactions.push({
                    transactionId: transaction.transaction_id,
                    totalAmount,
                    receiverAmount
                });
                console.log(`Transaction ${transaction.transaction_id} defaulted. Notification stored.`);
            }
        }

        // Send response after processing all transactions
        if (processedTransactions.length > 0) {
            return res.status(200).json({ 
                message: 'Overdue transactions processed successfully',
     
            });
        } else if (defaultedTransactions.length > 0) {
            return res.status(505).json({ 
                message: 'Overdue transactions defaulted',
               
            });
        } else {
            return res.status(404).json({ message: 'No overdue transactions found' });
        }

    } catch (error) {
        console.error('Error processing overdue transactions:', error);
        res.status(500).json({ error: 'Internal server error',});
    }
}
module.exports = money_overdue;