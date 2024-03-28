// process.loadEnvFile()
const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
// secret key for added security for authentication 

// ROUTE1 : create user using POST: http://localhost:5000/api/auth/createuser , no login required
router.post('/createuser',[
    body('name','Enter name with more than or equal to three characters').isLength({ min: 3 }),
    body('email','Enter valid email').isEmail(),
    body('password','Enter password with more than or equal to five characters').isLength({ min: 5 })
],async (req , res)=>{
    let success = false
// checking for validation errors if exists then sending bad request and error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success , errors: errors.array() });
    }
    try {
// checking if email is already present 
        let user = await User.findOne({email : req.body.email})
        if(user){
            return res.status(400).json({success ,error : "Email already exists"})
        }

        const salt = bcrypt.genSaltSync(10);
        const secPass = bcrypt.hashSync( req.body.password, salt);
        // creating new users by sending data to database
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            
        })
        // this gives a token to a authenticated user 
        const authDataTok  = {
            user : {
                id : user.id
            }
        }
        var token = jwt.sign(authDataTok,process.env.NOTETRACK_APP_SECRET_KEY);
        success = true
        res.json({success ,token})
    } catch(err) {
        success = false
        console.log(err.message)
        res.status(500).json({success ,err : err.message})
    }
})

//ROUTE 2 : authenticating a  user using POST: http://localhost:5000/api/auth/login , no login required
router.post('/login',[
    body('email','Enter valid email').isEmail(),
    body('password','Enter password').exists()
],async (req , res)=>{
    let success = false
// checking for validation errors if exists then sending bad request and error 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success , errors: errors.array() });
    }
    try{

        const {email,password} = req.body
        // checking email and password if they are present in database or not 
        let user = await User.findOne({email : email})
        if(!user){
            return res.status(400).json({success ,error : "Login with correct credentials"})
        }
        const isPasswordValid = await bcrypt.compare( password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({success ,error : "Login with correct credentials"})
        }
        // this gives a token to a user with correct credentials
        const authDataTok  = {
            user : {
                id : user.id
            }
        }
        var token = jwt.sign(authDataTok,process.env.NOTETRACK_APP_SECRET_KEY);
        success = true
        res.json({success ,token})
    } catch(err) {
        console.log(err.message)
        success = false
        res.status(500).json({success ,err : err.message})
    }
})

// ROUTE 3 : Giving user data using userid using POST: http://localhost:5000/api/auth/getuser , login required for this
router.post('/getuser', fetchuser, async (req, res) => {
    let success = false
    try {
        // Retrieve the user ID from the request object using req.user
        const userId = req.user.id;
        // const userId = "65e5d09cfa572cc7d4322dbb";
        // Use the user ID to find the user in the database
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({success , error: "User not found" });
        }
        // Send the user data in the response
        success = true // its the way to know if its successfull or not in the frontend
        res.json(success ,user);
    } catch (err) {
        console.log(err.message);
        success = false 
        res.status(500).json({success , error: "Server Error" });
    }
});
module.exports = router