const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../../models/transcationSchema.js');
const User = require('../../models/userSchema.js');
const Notification = require('../../models/notificationSchema.js');

// Function to calculate accurate interest
function calculateInterest(principal, rate, duration) {
    const principalNum = parseFloat(principal.toString());
    const rateNum = parseFloat(rate.toString());
    const durationNum = parseFloat(duration.toString());

    return principalNum * (rateNum / 100) * (durationNum / 365); // Annualized interest
}

// API to fetch and process transactions for logged-in user
async function money_overdue(req, res) {
    const { senderId } = req.body;

    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
        return res.status(400).json({ error: 'Invalid or missing Sender ID' });
    }

    try {
        const now = new Date();
        console.log("Processing overdue transactions for sender ID:", senderId);

        const overdueTransactions = await Transaction.find({
            sender_id: senderId,
            transaction_state: 'COMPLETED',
            due_date: { $lte: now },
        });

        if (overdueTransactions.length === 0) {
            return res.status(200).json({ message: 'No overdue transactions found.' });
        }

        console.log(`Found ${overdueTransactions.length} overdue transactions`);

        const results = await Promise.all(
            overdueTransactions.map(async (transaction) => {
                console.log(`Processing transaction ${transaction.transaction_id}`);
                
                const receiver = await User.findById(transaction.receiver_id);
                const sender = await User.findById(transaction.sender_id);

                if (!receiver || !sender) {
                    console.warn(`User not found for transaction ${transaction.transaction_id}`);
                    return { transactionId: transaction.transaction_id, status: 'SKIPPED' };
                }

                const principal = parseFloat(transaction.amount.toString());
                const receiverAmount = receiver.Amount ? parseFloat(receiver.Amount.toString()) : 0;

                const interest = calculateInterest(
                    principal,
                    parseFloat(transaction.interest_rate.toString()),
                    parseFloat(transaction.duration.toString())
                );
                const totalAmount = principal + interest;

                console.log(`Receiver Amount: ${receiverAmount}, Total Amount: ${totalAmount}`);

                if (receiverAmount >= totalAmount) {
                    // Deduct from receiver and add to sender
                    receiver.Amount = mongoose.Types.Decimal128.fromString(
                        (receiverAmount - totalAmount).toFixed(2)
                    );
                    sender.Amount = mongoose.Types.Decimal128.fromString(
                        (parseFloat(sender.Amount.toString()) + totalAmount).toFixed(2)
                    );

                    transaction.transaction_state = 'RETURNED';
                    transaction.amount_returned = true;

                    await receiver.save();
                    await sender.save();
                    await transaction.save();

                    console.log(`Transaction ${transaction.transaction_id} marked as RETURNED`);
                    return { transactionId: transaction.transaction_id, status: 'RETURNED' };
                } else {
                    // Mark transaction as defaulted
                    transaction.transaction_state = 'DEFAULTED';
                    await transaction.save();

                    const notification = new Notification({
                        sender_id: transaction.sender_id,
                        receiver_id: transaction.receiver_id,
                        transaction_id: transaction._id,
                        message: `Transaction ${transaction.transaction_id} defaulted due to insufficient balance.`,
                    });
                    await notification.save();

                    console.log(`Transaction ${transaction.transaction_id} marked as DEFAULTED`);
                    return { transactionId: transaction.transaction_id, status: 'DEFAULTED' };
                }
            })
        );

        const returned = results.filter((result) => result.status === 'RETURNED');
        const defaulted = results.filter((result) => result.status === 'DEFAULTED');

        if (returned.length > 0) {
            return res.status(200).json({
                message: 'Overdue transactions processed successfully.',
                returnedTransactions: returned.map((r) => r.transactionId),
            });
        } else {
            return res.status(422).json({
                message: 'Some overdue transactions defaulted.',
                defaultedTransactions: defaulted.map((d) => d.transactionId),
            });
        }
    } catch (error) {
        console.error('Error processing overdue transactions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = money_overdue;
