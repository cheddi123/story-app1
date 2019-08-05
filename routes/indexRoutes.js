const express = require('express');
const router = express.Router();
const {ensureGuest,ensureAuthenticated}  = require("../validators/auth")
const mongoose = require("mongoose")
const Story = mongoose.model("story")

// GET HOMEPAGE
router.get("/",(req,res)=>{
    Story.find({ status: 'public' })
	     .sort({ storyDate: -1 })
		 .populate('user')
		.then(stories => {
			res.render('story/viewStory', { stories });
		});
})

//GET Dashboard
router.get("/dashboard",ensureAuthenticated,(req,res)=>{
    Story.find({user:req.user.id})
    .then((stories)=>{
        
        res.render("index/dashboard",{stories}) 
    })
   
})

//GET WELCOME PAGE AFTER  LOGIN
 router.get("/welcome",(req,res)=>{
      res.redirect("index/welcome")
 })




module.exports= router