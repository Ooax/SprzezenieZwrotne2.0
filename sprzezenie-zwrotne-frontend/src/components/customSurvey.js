import React from 'react';
import { Typography, Box, IconButton, InputLabel, MenuItem, FormControl, Select, TextField, InputAdornment } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import {lightBlue, grey } from '@material-ui/core/colors';

//Komponent w ktorym ustawiane sa pytania i odpowiedzi nowej ankiety
export default class CustomSurveyModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newSurveyData: {
                isTemplate: false,
                templateFor: {
                    type: 'course',
                    for: false
                },
                questions: []
            }
        }
        this.onIsTemplateChange = this.onIsTemplateChange.bind(this);
        this.onQuestionTextChange = this.onQuestionTextChange.bind(this);
        this.onQuestionTypeChange = this.onQuestionTypeChange.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderAnswers = this.renderAnswers.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.deleteAnswer = this.deleteAnswer.bind(this);
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            if(this.props.data === true){
                this.props.parentCallback(this.state.newSurveyData);
            }
        }
    }

    componentDidMount(){
    }

    onIsTemplateChange(value){
        var surveyData = this.state.newSurveyData;
        surveyData.isTemplate = value;
        this.setState({newSurveyData: surveyData});
    }

    onIsTemplateForCurrentCourseChange(value){
        var surveyData = this.state.newSurveyData;
        surveyData.templateFor.for = value;
        this.setState({newSurveyData: surveyData});
    }

    onQuestionTextChange(value, index){
        var surveyData = this.state.newSurveyData;
        surveyData.questions[index].text = value;
        this.setState({newSurveyData: surveyData});
    }

    onQuestionTypeChange(value, index){
        var surveyData = this.state.newSurveyData;
        surveyData.questions[index].questionType = value;
        this.setState({newSurveyData: surveyData});
    }

    onAnswerTextChange(value, questionIndex, index){
        var surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers[index].text = value;
        this.setState({newSurveyData: surveyData});
    }

    addQuestion(){
        var surveyData = this.state.newSurveyData;
        surveyData.questions.push(
            {
                questionType: null,
                text: null,
                answers: []
            }
        )
        this.setState({newSurveyData: surveyData});
    }

    addAnswer(questionIndex){
        var surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers.push(
            {
                id: surveyData.questions[questionIndex].answers.length.toString(),
                text: null
            }
        )
        this.setState({newSurveyData: surveyData});
    }

    deleteQuestion(questionIndex){
        var surveyData = this.state.newSurveyData;
        surveyData.questions.splice(questionIndex, 1);
        this.setState({newSurveyData: surveyData});
    }

    deleteAnswer(questionIndex, answerIndex){
        var surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers.splice(answerIndex, 1);
        this.setState({newSurveyData: surveyData});
    }

    renderQuestions(){
        return this.state.newSurveyData.questions.map(function(question,questionIndex){
            return(
                <Box mb={2} border={1} borderRadius="borderRadius" >
                    <Box>
                        <IconButton  aria-label="delete-questionBlock" onClick={() => {this.deleteQuestion(questionIndex)}} style={{color: lightBlue[600], float: 'right'}}>
                                <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box m={2} mt={0}>
                        <TextField id="survey-question-text" value={this.state.newSurveyData.questions[questionIndex].text} label={"Pytanie " + (questionIndex + 1)}
                            onChange={(event) => this.onQuestionTextChange(event.target.value, questionIndex)} fullWidth />
                    </Box>
                    <Box m={2}>
                        <FormControl variant="outlined" >
                            <InputLabel id="select-question-type-label">Rodzaj odpowiedzi</InputLabel>
                            <Select labelId="select-question-type-label" id="select-question-type" value={this.state.newSurveyData.questions[questionIndex].questionType} label="Rodzaj odpowiedzi"
                                onChange={(event) => this.onQuestionTypeChange(event.target.value, questionIndex)}
                                style={{width: '200px'}}>
                                <MenuItem value={"Radio"}>Jednokrotny wybór</MenuItem>
                                <MenuItem value={"Checkbox"}>Wielokrotny wybór</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box m={2}>
                        <Typography variant="h6">
                            Odpowiedzi:
                        </Typography>
                    </Box>
                    <Box m={2} >
                        {this.renderAnswers(questionIndex)}
                    </Box>
                    <Box m={2} >
                        <IconButton aria-label="add-answer" onClick={() => {this.addAnswer(questionIndex)}} style={{color: lightBlue[600], background: grey[200]}}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                </Box>
            )
        },this)
    }

    renderAnswers(questionIndex) {
        return this.state.newSurveyData.questions[questionIndex].answers.map(function (answers, answerIndex) {
            return (
                <Box>
                    <Box display="inline">
                    <TextField id="survey-answer-text" value={this.state.newSurveyData.questions[questionIndex].answers[answerIndex].text} label={"Odpowiedź " + (answerIndex + 1)}
                            onChange={(event) => this.onAnswerTextChange(event.target.value, questionIndex, answerIndex)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton  aria-label="delete-answer" onClick={() => {this.deleteAnswer(questionIndex, answerIndex)}} style={{color: lightBlue[600], float: 'right'}}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            }}
                            fullWidth/>
                    </Box>
                </Box>
            )
        }, this)
    }

    render() {
        return(
            <Box>
                <Box mb={2}>
                    <Box mr={2} display="inline">
                        <FormControl variant="outlined" display="inline">
                            <InputLabel id="select-is-template-label">Czy zapisać szablon?</InputLabel>
                            <Select labelId="select-is-template-label" id="select-is-template"
                                value={this.state.newSurveyData.isTemplate} label="Czy zapisać szablon?"
                                onChange={(event) => this.onIsTemplateChange(event.target.value)}
                                style={{width: '200px'}}>
                                <MenuItem value={false}>Nie</MenuItem>
                                <MenuItem value={true}>Tak</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {
                        (this.state.newSurveyData.isTemplate)?
                            (
                                <Box mr={2} display="inline">
                                    <FormControl variant="outlined" display="inline">
                                        <InputLabel id="select-is-template-label">Dla obecnego przedmiotu?</InputLabel>
                                        <Select labelId="select-is-template-label" id="select-is-template"
                                            value={this.state.newSurveyData.templateFor.for} label="Dla obecnego przedmiotu?"
                                            onChange={(event) => this.onIsTemplateForCurrentCourseChange(event.target.value)}
                                            style={{ width: '200px' }}>
                                            <MenuItem value={false}>Nie</MenuItem>
                                            <MenuItem value={true}>Tak</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            ):
                            false
                    }
                    <Box mt={2}>
                        <Typography variant="h5">
                            Pytania:
                        </Typography>
                    </Box>
                </Box>
                {this.renderQuestions()}
                <IconButton aria-label="add-question" onClick={this.addQuestion} style={{color: lightBlue[600], background: grey[200]}}>
                        <AddIcon />
                </IconButton>
            </Box>
        )
    }
}