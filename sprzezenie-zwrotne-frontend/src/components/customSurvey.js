import React from 'react';
import { Typography, Box, IconButton, InputLabel, MenuItem, FormControl, Select, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import {lightBlue, grey } from '@material-ui/core/colors';
import { withTranslation } from "react-i18next";

//Komponent w ktorym ustawiane sa pytania i odpowiedzi nowej ankiety
class CustomSurveyModule extends React.Component {
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
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderAnswers = this.renderAnswers.bind(this);
        this.gradeQuestion = this.gradeQuestion.bind(this);
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
        let surveyData = this.state.newSurveyData;
        surveyData.isTemplate = value;
        this.setState({newSurveyData: surveyData});
    }

    onIsTemplateForCurrentCourseChange(value){
        let surveyData = this.state.newSurveyData;
        surveyData.templateFor.for = value;
        this.setState({newSurveyData: surveyData});
    }

    onQuestionTextChange(value, index){
        let surveyData = this.state.newSurveyData;
        surveyData.questions[index].text = value;
        this.setState({newSurveyData: surveyData});
    }

    onQuestionTypeChange(value, index){
        let surveyData = this.state.newSurveyData;
        surveyData.questions[index].questionType = value;
        this.setState({newSurveyData: surveyData});
    }

    onAnswerTextChange(value, questionIndex, index){
        let surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers[index].text = value;
        this.setState({newSurveyData: surveyData});
    }

    addQuestion(){
        let surveyData = this.state.newSurveyData;
        surveyData.questions.push(
            {
                questionType: null,
                text: null,
                graded: false,
                maxGrade: 0,
                answers: []
            }
        )
        this.setState({newSurveyData: surveyData});
    }

    deleteQuestion(questionIndex){
        let surveyData = this.state.newSurveyData;
        surveyData.questions.splice(questionIndex, 1);
        this.setState({newSurveyData: surveyData});
    }

    addAnswer(questionIndex){
        let surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers.push(
            {
                id: surveyData.questions[questionIndex].answers.length.toString(),
                text: null,
                grade: 0
            }
        )
        if(surveyData.questions[questionIndex].graded){
            for(let j = 0; j < surveyData.questions[questionIndex].answers.length-1; j++){
                surveyData.questions[questionIndex].answers[j].grade++;
            }
            surveyData.questions[questionIndex].maxGrade++;
        }
        console.log(surveyData.questions);
        this.setState({newSurveyData: surveyData});
    }

    deleteAnswer(questionIndex, answerIndex){
        let surveyData = this.state.newSurveyData;
        surveyData.questions[questionIndex].answers.splice(answerIndex, 1);
        if(surveyData.questions[questionIndex].graded){
            for(let j = 0; j < answerIndex; j++){
                surveyData.questions[questionIndex].answers[j].grade--;
            }
            surveyData.questions[questionIndex].maxGrade--;
        }
        this.setState({newSurveyData: surveyData});
    }

    gradeQuestion(questionIndex){
        let surveyData = this.state.newSurveyData;
        if(!surveyData.questions[questionIndex].graded){
            surveyData.questions[questionIndex].graded = true;
            surveyData.questions[questionIndex].maxGrade = surveyData.questions[questionIndex].answers.length;
            for(let i = surveyData.questions[questionIndex].answers.length - 1, j = 0; i >= 0; i--, j++){
                surveyData.questions[questionIndex].answers[j].grade = i;
            }
        }
        else{
            surveyData.questions[questionIndex].graded = false;
            for(let j = 0; j < surveyData.questions[questionIndex].answers.length; j++){
                surveyData.questions[questionIndex].answers[j].grade = 0;
            }
        }
        this.setState({newSurveyData: surveyData});
    }

    renderQuestions(){
        const { t } = this.props;
        return this.state.newSurveyData.questions.map(function(question,questionIndex){
            return(
                <Box mb={2} border={1} borderRadius="borderRadius" key={"question_" + questionIndex}>
                    <Box style={{float: 'right'}}>
                        <IconButton aria-label="grade-question" onClick={() => {this.gradeQuestion(questionIndex)}} style={{color: lightBlue[600]}}>
                            <EqualizerIcon />
                        </IconButton>
                        <IconButton aria-label="delete-question" onClick={() => {this.deleteQuestion(questionIndex)}} style={{color: lightBlue[600]}}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box mb={2} mx={2}>
                        <TextField id="survey-question-text" value={this.state.newSurveyData.questions[questionIndex].text} label={"Pytanie " + (questionIndex + 1)}
                            onChange={(event) => this.onQuestionTextChange(event.target.value, questionIndex)} fullWidth />
                    </Box>
                    <Box m={2}>
                        <FormControl variant="outlined" >
                            <InputLabel id="select-question-type-label">{t('AnswerType')}</InputLabel>
                            <Select labelId="select-question-type-label" id="select-question-type" value={this.state.newSurveyData.questions[questionIndex].questionType} label="Rodzaj odpowiedzi"
                                onChange={(event) => this.onQuestionTypeChange(event.target.value, questionIndex)}
                                style={{width: '200px'}}>
                                <MenuItem value={"Radio"}>{t('SingleChoice')}</MenuItem>
                                <MenuItem value={"Checkbox"}>{t('MultipleChoice')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box m={2}>
                            <Typography variant="h6" style={{width: '90%', display: 'inline-block', 'margin-right': '10px'}}>
                            {t('Answers')}
                            </Typography>
                        {
                        (this.state.newSurveyData.questions[questionIndex].graded)?
                        (
                                <Typography variant="h6" style={{width: '8%', display: 'inline-block'}}>
                                    {t('Grades')}
                                </Typography>
                        )
                        :
                        false
                    }
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
                    <TextField id="survey-answer-text" value={this.state.newSurveyData.questions[questionIndex].answers[answerIndex].text} label={"Odpowied?? " + (answerIndex + 1)}
                                onChange={(event) => this.onAnswerTextChange(event.target.value, questionIndex, answerIndex)} style={{width: '90%', 'margin-right': '10px'}} 
                                InputProps={{endAdornment:
                                <IconButton aria-label="delete-answer" onClick={() => {this.deleteAnswer(questionIndex, answerIndex)}} style={{color: lightBlue[600]}}>
                                    <CloseIcon />
                                </IconButton>
                            }}>
                    </TextField>
                    {
                        (this.state.newSurveyData.questions[questionIndex].graded)?
                        (
                            <Select labelId="select-answer-grade" id={"select-answer-grade"+answerIndex} value={this.state.newSurveyData.questions[questionIndex].answers[answerIndex].grade} label="Ocena"
                            style={{width: '8%', height: '64px'}} disabled>
                                <MenuItem value={this.state.newSurveyData.questions[questionIndex].answers[answerIndex].grade}>{this.state.newSurveyData.questions[questionIndex].answers[answerIndex].grade}</MenuItem>
                            </Select>
                        )
                        :
                        false
                    }
                </Box>
            )
        }, this)
    }

    render() {
        const { t } = this.props;
        return(
            <Box>
                <Box mb={2}>
                    <Box mr={2} display="inline">
                        <FormControl variant="outlined" display="inline">
                            <InputLabel id="select-is-template-label">{t('SaveTemplate')}</InputLabel>
                            <Select labelId="select-is-template-label" id="select-is-template"
                                value={this.state.newSurveyData.isTemplate} label="Czy zapisa?? szablon?"
                                onChange={(event) => this.onIsTemplateChange(event.target.value)}
                                style={{width: '200px'}}>
                                <MenuItem value={false}>{t('No')}</MenuItem>
                                <MenuItem value={true}>{t('Yes')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    {
                        (this.state.newSurveyData.isTemplate)?
                            (
                                <Box mr={2} display="inline">
                                    <FormControl variant="outlined" display="inline">
                                        <InputLabel id="select-is-template-label">{t('ForSelectedSubject')}</InputLabel>
                                        <Select labelId="select-is-template-label" id="select-is-template"
                                            value={this.state.newSurveyData.templateFor.for} label="Dla obecnego przedmiotu?"
                                            onChange={(event) => this.onIsTemplateForCurrentCourseChange(event.target.value)}
                                            style={{ width: '200px' }}>
                                            <MenuItem value={false}>{t('No')}</MenuItem>
                                            <MenuItem value={true}>{t('Yes')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            ):
                            false
                    }
                    <Box mt={2}>
                        <Typography variant="h5">
                        {t('Questions')+": "}
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
export default withTranslation()(CustomSurveyModule);