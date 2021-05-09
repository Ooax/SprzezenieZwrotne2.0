import React from 'react';
import { Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, IconButton, Box, Checkbox, FormGroup, TextField } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

//Komponent wyswietlajacy pytania i odpowiedzi szablonow ankiet
class TemplateSurvey extends React.Component {
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
        const { t } = this.props;
        return (
            <div>
                <Box mb={2}>
                    <Typography variant="h5">
                        {t('Questions')}
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
export default withTranslation()(TemplateSurvey);