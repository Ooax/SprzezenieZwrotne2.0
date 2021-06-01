const express = require('express');
const router = express.Router();
const surveys = require('../functions/surveys.js');
require("dotenv").config();

const mongoInfo = {
    url: process.env.MONGO_URL,
    dbName: process.env.MONGO_DBNAME,
}

router.get('/getCoursesAvailableToSurvey', function(req, res){
    if(req.session.userData.staff_status == 2 || req.session.userData.student_status == 2){
        surveys.getCoursesAvailableToSurvey(req.session.token, req.session.userData)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/getSurveyTemplates', function(req, res){
    const data = req.body;
    if((req.session.userData.staff_status == 2 || req.session.userData.student_status == 2) && data){
        surveys.getSurveyTemplates(mongoInfo, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/addNewSurvey', function(req, res){
    const data = req.body;
    if((req.session.userData.staff_status == 2 || req.session.userData.student_status == 2) && data){
        surveys.addNewSurvey(mongoInfo, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.get('/getAvailableSurveys', function(req, res){
    if(req.session.userData.student_status == 2 || req.session.userData.staff_status == 2){
        surveys.getAvailableSurveys(mongoInfo, req.session.token, req.session.userData)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/getSurveyData', function(req, res){
    const data = req.body;
    if((req.session.userData.student_status == 2 || req.session.userData.staff_status == 2) && data){
        surveys.getSurveyData(mongoInfo, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/fillOutSurvey', function(req, res){
    const data = req.body;
    if((req.session.userData.student_status == 2 || req.session.userData.staff_status == 2) && data){
        surveys.fillOutSurvey(mongoInfo, req.session.userData, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.get('/getMySurveys', function(req, res){
    if(req.session.userData.staff_status == 2 || req.session.userData.student_status == 2){
        surveys.getMySurveys(mongoInfo, req.session.token, req.session.userData)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/getMySurveyData', function(req, res){
    const data = req.body;
    if((req.session.userData.staff_status == 2 || req.session.userData.student_status == 2) && data){
        surveys.getMySurveyData(mongoInfo, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/updateMySurveyData', function(req, res){
    const data = req.body;
    if((req.session.userData.staff_status == 2 || req.session.userData.student_status == 2) && data){
        surveys.updateMySurveyData(mongoInfo, data)
        .then(function(result){
            res.json(result); 
        }).catch(function(err){
            console.error(err);
        })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/getCourseDetails', function (req, res){
    const courseId = req.body.courseId;
    console.log(courseId);
    if (req.session.userData.student_status == 2 && courseId) {
        if (courseId) {
            surveys.getCourseDetails(req.session.token, courseId)
                .then(function (result) {
                    res.json(result);
                }).catch(function (err) {
                    console.error(err);
                })
        }
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

module.exports = router;