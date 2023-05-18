const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const mongoose = require('mongoose');

router.get('/',(req,res,next) => {
    Student.find().then(result => {
        res.status(200).json({
            studentData:result
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    });
    // res.status(200).json({
    //     msg:"this is student get request"
    // });
});

router.get('/:id',(req,res,next) => {
    Student.findById(req.params.id).then(result => {
        res.status(200).json({
            studentData:result
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    });
});
//
router.post('/',(req,res,next) => {

    const student = new Student({
        _id:new mongoose.Types.ObjectId,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender
    });
    
    student.save().then(
        result =>{
        res.status(200).json({
            newStudent:result
        })
        }
    ).catch(err => {
        res.status(500).json({
            error:err
        })
    });
});

router.delete('/:id',(req,res,next) => {
    Student.findByIdAndRemove({_id:req.params.id}).then(
        result =>{
        res.status(200).json({
            message:'data deleted'
        })
        }
    ).catch(err => {
        res.status(500).json({
            error:err
        })
    });
});

router.put('/:id',(req,res,next) => {
    Student.findOneAndUpdate({_id:req.params.id},{
        $set:{
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            gender:req.body.gender
        }
    }).then(
        result =>{
        res.status(200).json({
            message:'data Updated'
        })
        }
    ).catch(err => {
        res.status(500).json({
            error:err
        })
    });
});

module.exports = router;