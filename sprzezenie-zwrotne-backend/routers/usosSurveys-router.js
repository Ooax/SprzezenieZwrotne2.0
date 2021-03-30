const express = require('express');
const router = express.Router();
const usosSurveys = require('../functions/usos-surveys.js');

router.get('/getUsosSurveysToFill', function (req, res) {
    if (req.session.userData.student_status == 2) {
        usosSurveys.getSurveysToFill(req.session.token)
            .then(function (result) {
                res.json(result);
            }).catch(function (err) {
                console.error(err);
            })
    }
    else{
        res.json({message: "No permission to access resources"})
    }
})

router.post('/getUsosSurvey', function (req, res) {
    const surveyId = req.body.surveyId;
    if (req.session.userData.student_status == 2 && surveyId) {
        if (surveyId) {
            usosSurveys.getSurvey(req.session.token, surveyId)
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

router.post('/fillUsosSurvey', function (req, res) {
    const data = req.body;
    if (req.session.userData.student_status == 2 && data) {
        if (data && data.surveyId) {
            data.answers = JSON.stringify(data.answers);
            usosSurveys.fillSurvey(req.session.token, data)
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