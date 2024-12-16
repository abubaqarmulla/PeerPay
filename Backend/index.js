const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const verifyAadhaar = require('./api/adar.js');
const verifyPAN = require('./api/pan.js');
const {registerUser,getUserById,getUsersByAmount,getUsersByDistance, getallUser}= require('./api/register.js');
const {setPassword,loginUser}= require('./api/password.js');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./models/config');
const {createTransaction} = require('./api/transcation/create.js')
const getSender = require('./api/transcation/getSender.js')
const getReceiver = require('./api/transcation/getReceiver.js')
const { approveReceiver,rejectTransactionbyReceiver} = require('./api/transcation/receiver.js')
const {approveSender,rejectTransactionbySender} = require('./api/transcation/sender.js')
const money_overdue = require('./api/transcation/amount_refund.js');
const {getallNotifications} = require('./api/transcation/create.js');
const cors = require('cors')



const app = express();

// Middleware
app.use(cors())
app.use(bodyParser.json());




// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images (e.g., jpeg, png)
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

// MongoDB Connection
connectDB();

// post Routes Authentication
app.post('/auth/register', registerUser);//Regester
app.post('/auth/verify-aadhaar', upload.single('aadhaarImage'), verifyAadhaar);//verify adarcard
app.post('/auth/verify-pan', upload.single('panImage'), verifyPAN); //verify pancard
app.post('/auth/set-password', setPassword);//setPassword
app.post('/auth/login', loginUser);//login user


// post Routes transaction
app.post('/transaction/create', createTransaction); // Create Transaction route
app.post('/transaction/approve-receiver', approveReceiver); // Approve Receiver route
app.post('/transaction/approve-sender', approveSender); // Approve Sender route
app.post('/transaction/rejected-receiver',rejectTransactionbyReceiver)//reject trascation recivier
app.post('/transaction/rejected-sender',rejectTransactionbySender)//reject trascation sender
app.post('/transaction/overdue',money_overdue);

//get Routes transaction for reaciver
app.get('/transaction/pending/sender/:senderId', getSender.getPendingTransactions);
app.get('/transaction/approved/sender/:senderId', getSender.getApprovedTransactions);
app.get('/transaction/rejected-sender/sender/:senderId', getSender.getRejectedSenderTransactions);
app.get('/transaction/rejected-receiver/sender/:senderId', getSender.getRejectedReceiverTransactions);
app.get('/transaction/completed/sender/:senderId', getSender.getCompletedTransactions);
app.get('/transaction/defaulted/sender/:senderId', getSender.getDefaultedTransactions);
app.get('/transaction/returned/sender/:senderId', getSender.getReturnedTransactions);
app.get('/alltransactions/sender/:senderId', getSender.getallTransactions);


//get Routes transaction for sender 

app.get('/transaction/pending/receiver/:receiverId', getReceiver.getPendingTransactions);
app.get('/transaction/approved/receiver/:receiverId',getReceiver.getApprovedTransactions);
app.get('/transaction/rejected-sender/receiver/:receiverId', getReceiver.getRejectedSenderTransactions);
app.get('/transaction/rejected-receiver/receiver/:receiverId', getReceiver.getRejectedReceiverTransactions);
app.get('/transaction/completed/receiver/:receiverId', getReceiver.getCompletedTransactions);
app.get('/transaction/defaulted/receiver/:receiverId', getReceiver.getDefaultedTransactions);
app.get('/transaction/returned/receiver/:receiverId', getReceiver.getReturnedTransactions);
app.get('/alltransactions/receiver/:receiverId', getReceiver.getallTransactions);




//get route for user
app.get("/users", getallUser);


app.get("/user/:id", getUserById);

// Get users with Amount greater than entered value
app.get("/users/amount", getUsersByAmount);

// Get users within a specified distance
app.get("/users/:id/distance", getUsersByDistance);

app.get('/notifications/:receiverId',getallNotifications);



// Global Error Handling for Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `File upload error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
