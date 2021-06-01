import React from 'react';
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, IconButton, Box, Checkbox, FormGroup, TextField } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Komponent wyswietlajacy pytania i odpowiedzi ankiet USOS
class SurveyUSOSComponent extends React.Component {
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
        const { t } = this.props;
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
                            {t('Send')}
                        </Typography>
                    </Button>
                </form>
            </div>
        )
    }
}
export default withTranslation()(SurveyUSOSComponent);
