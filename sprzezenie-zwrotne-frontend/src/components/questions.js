import React from 'react';
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, IconButton, Box, Checkbox, FormGroup, TextField } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import i18n from '../i18n';

//Komponent wyswietlajacy pytania i odpowiedzi ankiet USOS
export class SurveyUSOSComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions : {},
            comment: "",
            submitAvailable: false
        }

        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderAnswers = this.renderAnswers.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postSurveyAnswers = this.postSurveyAnswers.bind(this);
        this.returnButton = this.returnButton.bind(this);
    }

    componentDidMount() {
    }

    onCommentChange(value){
        this.setState({comment: value});
    }

    handleRadioChange(event, questionId){
        var questions = this.state.questions;
        if(questions[questionId]){
            questions[questionId].answers = [event.target.value];
        }
        else{
            var answer = {
                answers: null,
                comment: null
            };
            answer.answers = [event.target.value];
            answer.comment = null;
            questions[questionId] = answer
        }
        this.setState({questions: questions});
        if(Object.keys(this.state.questions).length === this.props.data.questions.length)
            this.setState({submitAvailable: true});
    }

    handleSubmit(event){
        event.preventDefault();
        this.postSurveyAnswers();
        this.props.parentCallback("Reload");
    }

    returnButton(){
        this.props.parentCallback("Return");
    }


    renderQuestions(){

        return this.props.data.questions.map(function (question, index) {
            return (
                <div key = {"question_"+index+"_div"}>
                    <Box mb={2}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                <Typography variant="h6">
                                    {(index + 1) + ". " + question.display_text_html[i18n.language]}
                                </Typography>
                            </FormLabel>
                                <RadioGroup aria-label="question" name={"question_"+index+"_radioGroup"} onChange={(event) => this.handleRadioChange(event, question.id)}>
                                    {this.renderAnswers(question.possible_answers)}
                                </RadioGroup>
                        </FormControl>
                    </Box>
                </div>
            )
        },this)
    }


    renderAnswers(data) {
        data.reverse();
        return data.map(function (answer, index) {
            const { display_text_html, id } = answer;
            return (
                <FormControlLabel key = {"answer_"+index} value={id} control={<Radio color="primary"/>} label={display_text_html[i18n.language]}/>
            )
        })
    }


    postSurveyAnswers = async function(){
        const response = await fetch('/usosSurveys/fillUsosSurvey', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                surveyId: this.props.data.id,
                answers: this.state.questions,
                comment: this.state.comment
            })
        });
        const responseData = await response.json();
        return responseData;
    }


    render() {
        return (
            <div>
                <Box display="flex" alignItems="center" mb={0}>
                    <IconButton aria-label="return" onClick={this.returnButton} display="inline">
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Box ml={3}>
                        <Typography variant="h5" display="inline">
                            {this.props.data.name[i18n.language]}
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">
                            {this.props.data.course_info.course_id + " - " + this.props.data.course_info.course_name[i18n.language] + " [" + this.props.data.course_info.classtype_id + "] " +
                             this.props.data.course_info.term_id + " - " + this.props.data.lecturer.first_name + " " + this.props.data.lecturer.last_name}
                    </Typography>
                </Box>
                <Box mb={2}>
                    {(this.props.data.headline_html) ?
                        (<Typography variant="h6">
                            {this.props.data.headline_html}
                        </Typography>) :
                        false}
                </Box>
                <form onSubmit={this.handleSubmit}>
                    {
                        this.renderQuestions()
                    }
                    {
                    (this.props.data.has_final_comment)?
                        (<Box mb={2}>
                            <TextField id="survey-comment-tf" label="Komentarz" onChange={(event) => this.onCommentChange(event.target.value)} fullWidth />
                        </Box>):
                        false
                    }
                    <Button type="submit" variant="contained" disabled={!this.state.submitAvailable}>
                        <Typography variant="button">
                            Wyślij
                        </Typography>
                    </Button>
                </form>
            </div>
        )
    }
}

//Komponent wyswietlajacy pytania i odpowiedzi ankiet
export class SurveyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers : [],
            submitAvailable: false,
            surveyComment: null
        }
        this.createAnswersState();

        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderRadioAnswers = this.renderRadioAnswers.bind(this);
        this.renderCheckboxAnswers = this.renderCheckboxAnswers.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.postSurveyAnswers = this.postSurveyAnswers.bind(this);
        this.returnButton = this.returnButton.bind(this);
    }

    createAnswersState(){
        this.props.data.questions.forEach((question) => {
            if(question.questionType === "Radio"){
                this.state.answers.push(null)
            }
            else if(question.questionType ==="Checkbox"){
                var ans = [];
                question.answers.forEach(() => {
                    ans.push(false);
                })
                this.state.answers.push(ans);
            }
        });
    }

    componentDidMount() {
    }

    onCommentChange(value){
        this.setState({surveyComment: value});
    }

    handleRadioChange(value, id){
        var answers = this.state.answers;
        answers[id] = value;
        this.setState({answers: answers});
        if((this.state.answers.findIndex((element) => element == null)) === -1)
            this.setState({submitAvailable: true});
    }

    handleCheckboxChange(value, questionId, id){
        var answers = this.state.answers;
        answers[questionId][id] = value;
        this.setState({answers: answers});
        if((this.state.answers.findIndex((element) => element == null)) === -1)
            this.setState({submitAvailable: true});
    }

    handleSubmit(event){
        event.preventDefault();
        this.postSurveyAnswers();
        this.props.parentCallback("Reload");
    }

    returnButton(){
        this.props.parentCallback("Return");
    }


    renderQuestions(){
        return this.props.data.questions.map(function (question, questionIndex) {
            if(question.questionType === "Radio"){
                return (
                    <div key = {"question_"+questionIndex+"_div"}>
                        <Box mb={2}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    <Typography variant="h6">
                                        {(questionIndex + 1) + ". " + question.text}
                                    </Typography>
                                </FormLabel>
                                    <RadioGroup aria-label="question" value={this.state.answers[questionIndex]} name={"question_"+questionIndex+"_radioGroup"} 
                                    onChange={(event) => this.handleRadioChange(event.target.value, questionIndex)}>
                                        {this.renderRadioAnswers(question.answers)}
                                    </RadioGroup>
                            </FormControl>
                        </Box>
                    </div>
                )
            }
            else if(question.questionType === "Checkbox"){
                return (
                    <div key = {"question_"+questionIndex+"_div"}>
                        <Box mb={2}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    <Typography variant="h6">
                                        {(questionIndex + 1) + ". " + question.text}
                                    </Typography>
                                </FormLabel>
                                    <FormGroup aria-label="question" name={"question_"+questionIndex+"_checkboxGroup"} >
                                        {this.renderCheckboxAnswers(question.answers, questionIndex)}
                                    </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                )
            }
            else{
                return (
                    <Box>

                    </Box>
                )
            }
        },this)
    }

    renderRadioAnswers(data) {
        data.reverse();
        return data.map(function (answer, index) {
            return (
                <FormControlLabel key = {"answer_"+index} value={index+""} control={<Radio color="secondary"/>} label={answer.text}/>
            )
        },this)
    }

    renderCheckboxAnswers(data, questionIndex) {
        return data.map(function (answer, index) {
            return (
                <FormControlLabel key = {"answer_"+index}
                 control={<Checkbox checked={this.state.answers[questionIndex].id} onChange={(event) => this.handleCheckboxChange(event.target.checked, questionIndex, index)} />}
                 label={answer.text}/>
            )
        },this)
    }

    postSurveyAnswers = async function(){
        await fetch('/surveys/fillOutSurvey', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refId: this.props.data._id,
                courseInfo: {
                    courseUnitId: this.props.data.courseInfo.courseUnitId,
                    courseId: this.props.data.courseInfo.courseId,
                    termId: this.props.data.courseInfo.termId,
                    lecturer: this.props.data.lecturer
                },
                answers: this.state.answers,
                surveyComment: this.state.surveyComment
            })
        });
    }


    render() {
        return (
            <div>
                <Box display="flex" alignItems="center" mb={0}>
                    <IconButton aria-label="return" onClick={this.returnButton} display="inline">
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Box ml={3}>
                        <Typography variant="h5" display="inline">
                            {this.props.data.surveyName}
                        </Typography>
                    </Box>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">
                            {this.props.data.courseInfo.courseId + " - " + this.props.data.courseInfo.courseName[i18n.language] + " [" + this.props.data.courseInfo.classType + "] " +
                             this.props.data.courseInfo.termId + " - " + this.props.data.lecturer.first_name + " " + this.props.data.lecturer.last_name}
                    </Typography>
                </Box>
                <Box mb={2}>
                    {(this.props.data.surveyDescription) ?
                        (<Typography variant="h6">
                            {this.props.data.surveyDescription}
                        </Typography>) :
                        false}
                </Box>
                <form onSubmit={this.handleSubmit}>
                    {
                        this.renderQuestions()
                    }
                    {
                    (this.props.data.allowComment)?
                        (<Box mb={1}>
                            <TextField id="survey-comment-tf" label="Komentarz" onChange={(event) => this.onCommentChange(event.target.value)} fullWidth />
                        </Box>):
                        false
                    }
                    <Button type="submit" variant="contained" disabled={!this.state.submitAvailable}>
                        <Typography variant="button">
                            Wyślij
                        </Typography>
                    </Button>
                </form>
            </div>
        )
    }
}



//Komponent wyswietlajacy pytania i odpowiedzi szablonow ankiet
export class TemplateSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions : {},
            submitAvailable: false
        }

        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderRadioAnswers = this.renderRadioAnswers.bind(this);
        this.renderCheckboxAnswers = this.renderCheckboxAnswers.bind(this);
    }

    componentDidMount() {
    }

    renderQuestions(){
        return this.props.data.questions.map(function (question, questionIndex) {
            if(question.questionType === "Radio"){
                return (
                    <div key = {"question_"+questionIndex+"_div"}>
                        <Box mb={2}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    <Typography variant="h6">
                                        {(questionIndex + 1) + ". " + question.text}
                                    </Typography>
                                </FormLabel>
                                    <RadioGroup aria-label="question" value={false} name={"question_"+questionIndex+"_radioGroup"} 
                                    onChange={(event) => this.handleRadioChange(event.target.value, questionIndex)}>
                                        {this.renderRadioAnswers(question.answers)}
                                    </RadioGroup>
                            </FormControl>
                        </Box>
                    </div>
                )
            }
            else if(question.questionType === "Checkbox"){
                return (
                    <div key = {"question_"+questionIndex+"_div"}>
                        <Box mb={2}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">
                                    <Typography variant="h6">
                                        {(questionIndex + 1) + ". " + question.text}
                                    </Typography>
                                </FormLabel>
                                    <FormGroup aria-label="question" name={"question_"+questionIndex+"_checkboxGroup"} >
                                        {this.renderCheckboxAnswers(question.answers, questionIndex)}
                                    </FormGroup>
                            </FormControl>
                        </Box>
                    </div>
                )
            }
            else{
                return (
                    <Box>

                    </Box>
                )
            }
        },this)
    }


    renderRadioAnswers(data) {
        data.reverse();
        return data.map(function (answer, index) {
            return (
                <FormControlLabel key = {"answer_"+index} value={0} control={<Radio color="secondary"/>} label={answer.text}/>
            )
        },this)
    }

    renderCheckboxAnswers(data, questionIndex) {
        return data.map(function (answer, index) {
            return (
                <FormControlLabel key = {"answer_"+index}
                 control={<Checkbox checked={false} />}
                 label={answer.text}/>
            )
        },this)
    }




    render() {
        return (
            <div>
                <Box mb={2}>
                    <Typography variant="h5">
                        Pytania:
                    </Typography>
                </Box>
                <form>
                    {
                        this.renderQuestions()
                    }
                </form>
            </div>
        )
    }
}