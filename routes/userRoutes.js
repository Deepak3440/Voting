const express=require('express');
const router=express.Router();
 const User=require('./../models/user');
 const {jwtAuthMiddleware,generateToken}=require('./../jwt');

 //post routes to add data
 router.post('/signup',async(req,res)=>{
    try{
        const data=req.body;
        //create a new User document using the mongoose mode
        const newUser=new User(data);

        //save the user in database

        const response=await newUser.save();
        console.log('data saved');

        const payload={
            id:response.id
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload);
        console.log("token is",token);

        res.status(200).json({response:response,token:token});

    }
    catch(err){
        console.log(err);

    }
 });

 router.post('/login',async(req,res)=>{
    try{
        //extract addharnumber and password
        const {aadharCardNumber,password}=req.body;
        //find the user by aadharcard number
        const user= await User.findOne({aadharCardNumber:aadharCardNumber});
        //if user does not exit or not matched
        if(!user ||!(await user.comparePassword(password))){
            return res.status(401).json({error:'invalid username or password'});
        }

        const payload={
            id:response.id
        }
        console.log(JSON.stringify(payload));
        const token=generateToken(payload);
        console.log("token is",token);

        res.json({token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'internal server Error'});
    }
 });

 // Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;