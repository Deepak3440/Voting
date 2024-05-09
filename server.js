const express = require('express')
const app = express();
 const db = require('./db');
require('dotenv').config();
const {jwtAuthMiddleware,generateToken}=require('./jwt')
const mongoose = require('mongoose');



const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3001;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');

// Use the routers
app.use('/users', userRoutes);
  app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log('listening on port 3001');
})