import React from 'react';
import { Typography, Box, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import {HorizontalBar} from 'react-chartjs-2';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { SurveyCommentsTable } from './tables.js';


//Komponent statystyk ankiety
export default class SurveyStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            surveyData: null,
            loaded: false
        }
        
        

        this.organizeDataToView = this.organizeDataToView.bind(this);
        this.returnButton = this.returnButton.bind(this);
        this.renderHorizontalBars = this.renderHorizontalBars.bind(this);
        this.renderCommentsTable = this.renderCommentsTable.bind(this);
        this.renderLongLabels = this.renderLongLabels.bind(this);
        this.getMySurveyData = this.getMySurveyData.bind(this);
    }

    organizeDataToView(){
        this.questions = [];
        this.comments = [];
        this.state.surveyData.questions.forEach((question, questionIndex) => {
            var questionData = {
                questionText: question.text,
                questionType: question.questionType,
                questionStats: {
                    labels: [],
                    datasets: [{
                        label: "",
                        backgroundColor: lightBlue[200],
                        borderColor: lightBlue[400],
                        borderWidth: 1,
                        hoverBackgroundColor: lightBlue[800],
                        hoverBorderColor: lightBlue[900],
                        data: []
                      }]
                },
                longAnswerLabels: false
            }
            if(questionData.questionType === "Radio"){
                questionData.questionStats.datasets[0].label = "Odpowiedzi jednokrotnego wyboru";
                // questionData.questionStats.datasets[0].label = question.text;
                question.answers.forEach((questionAnswer, answerIndex) => {
                    questionData.questionStats.labels.push(questionAnswer.text);
                    if(questionAnswer.text.length > 30)
                        questionData.longAnswerLabels = true;
                    questionData.questionStats.datasets[0].data.push(this.state.surveyData.surveyAnswers.filter((surveyAnswer) => surveyAnswer.answers[questionIndex] === questionAnswer.id).length);
                })
            }
            else if(questionData.questionType === "Checkbox"){
                questionData.questionStats.datasets[0].label = "Odpowiedzi wielokrotnego wyboru";
                // questionData.questionStats.datasets[0].label = question.text;
                question.answers.forEach((questionAnswer, answerIndex) => {
                    questionData.questionStats.labels.push(questionAnswer.text);
                    if(questionAnswer.text.length > 30)
                        questionData.longAnswerLabels = true;
                    questionData.questionStats.datasets[0].data.push(this.state.surveyData.surveyAnswers.filter((surveyAnswer) => surveyAnswer.answers[questionIndex][answerIndex] === true).length);
                })
            }
            this.questions.push(questionData);
        })
        this.state.surveyData.surveyAnswers.forEach((answer) => {
            if(answer.surveyComment && answer.surveyComment !== "")
                this.comments.push(answer.surveyComment);
        })
    }

    componentDidMount(){
        this.getMySurveyData();
    }

    returnButton(){
        this.props.parentCallback("Return");
    }

    renderHorizontalBars(){
        if((this.state.surveyData.surveyAnswers)?(this.state.surveyData.surveyAnswers.length > 0):false)
        {
            return this.questions.map((question, index) => {
                var answerLabels = [];
                if(question.longAnswerLabels){
                    answerLabels = question.questionStats.labels.slice();
                    for(var i = 0; i < question.questionStats.labels.length; i++){
                        question.questionStats.labels[i] = i + 1;
                    };
                }
                return(
                    <Box key={"hb-box-"+index} maxWidth="88%" m={4} p={2} border={1} borderRadius="borderRadius">
                        <Typography variant="h5">
                            {question.questionText}
                        </Typography>
                        <HorizontalBar data={question.questionStats} height={300} options={{ maintainAspectRatio: false, scales: {xAxes:[{ticks:{stepSize: 1}}]} }} />
                        {question.longAnswerLabels?
                        (
                            <Box>
                                <Typography variant="h5">
                                Odpowiedzi:
                                </Typography>
                                {
                                    this.renderLongLabels(answerLabels)
                                }
                            </Box>
                        )
                        :false}
                    </Box>
                )
            })
        }
        else{
            return (
                <Box mt={5} color={lightBlue[600]}>
                    <Typography variant="h5" >
                        Ta ankieta nie ma jeszcze żadnych odpowiedzi
                    </Typography>
                </Box>
            )
        }
    }

    renderLongLabels(labels){
        return labels.map((label, index) => {
            return (
            <Typography>
                {index +': ' + label}
            </Typography>
            );
        })
    }

    renderCommentsTable(){
        if((this.state.surveyData.surveyAnswers)?(this.state.surveyData.surveyAnswers.length > 0 && this.comments.length > 0):false){
            return(
                <Box>
                    <SurveyCommentsTable data={this.comments} />
                </Box>
            )
        } 
        else if((this.state.surveyData.surveyAnswers)?(this.state.surveyData.surveyAnswers.length > 0 && this.comments.length === 0):false){
            return(
                <Box mt={5} color={lightBlue[600]}>
                    <Typography variant="h5" >
                        Brak komentarzy do ankiety
                    </Typography>
                </Box>
            )
        }
        else{
            return(
                <Box mt={5} color={lightBlue[600]}>
                </Box>
            )
        }
    }

    getMySurveyData = async function(){
        const response = await fetch('/surveys/getMySurveyData', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({_id: this.props.data})
        });
        const surveyData = await response.json();
        if(!surveyData)
            return;
        this.state.surveyData = surveyData;
        this.organizeDataToView();
        this.setState({isOpen: surveyData.isOpen, loaded: true});
    }


    render() {
        return (
            (!this.state.loaded)?
            <div>Loading...</div>:
            <Box>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box>
                        <IconButton aria-label="return" onClick={this.returnButton} display="inline">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Box>
                    <Box mr={2}>
                        <Typography variant="h5" display="inline">
                            Statystyki ankiety:
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" display="inline">
                                {this.state.surveyData.courseInfo.courseId + " - " + this.state.surveyData.courseInfo.courseName["pl"] + " [" + this.state.surveyData.courseInfo.classType + "] " +
                                this.state.surveyData.courseInfo.termId}
                        </Typography>
                    </Box>
                </Box>
                {
                    this.renderHorizontalBars()
                }
                {
                    this.renderCommentsTable()
                }
            </Box>
        )
    }
}