import React from 'react';
import { Typography, Box, IconButton, InputLabel, MenuItem, FormControl, Select, TextField, Button, FormHelperText, Dialog } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { TemplateSurvey } from './questions.js';
import CustomSurveyModule from './customSurvey.js';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

//Koponent w ktorym dodawana jest ankieta
export default class NewSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            dialogText: null,
            fromTemplate: "new",
            surveyTemplatesLoaded: false,
            selectedTemplate: 0,
            showTemplate: false,
            showCustomSurveyModule: true,
            surveyName: null,
            surveyDescription: null,
            allowComment: false,
            isOpen: true,
            openDate: "",
            closeDate: "",
            customSurveyData: null,
            readyToSubmit: false
        }

        
        this.returnButton = this.returnButton.bind(this);
        this.dialogClose = this.dialogClose.bind(this);
        this.getSurveyTemplates = this.getSurveyTemplates.bind(this);
        this.fromTemplateChange = this.fromTemplateChange.bind(this);
        this.renderTemplatesSelect = this.renderTemplatesSelect.bind(this);
        this.handleCustomSurveyData = this.handleCustomSurveyData.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.postNewSurvey = this.postNewSurvey.bind(this);
        this.allowCommentChange = this.allowCommentChange.bind(this);
        this.isOpenChange = this.isOpenChange.bind(this);
        this.openDateChange = this.openDateChange.bind(this);
        this.closeDateChange = this.closeDateChange.bind(this);
    }

    componentDidMount() {
        
    }

    returnButton() {
        this.props.parentCallback("Return");
    }

    dialogClose(){
        this.setState({dialogOpen: false})
    }

    async handleCustomSurveyData(data){
        if(data.questions.length === 0){
            this.setState({dialogText: 'Proszę utworzyć pytania', dialogOpen: true});
            this.setState({readyToSubmit: false});
            return;
        }
        else{
            await data.questions.forEach((question, questionIndex) => {
                if(question.text === null || question.text === ""){
                    this.setState({dialogText: 'Proszę dodać tekst pytania '+(questionIndex+1)+'', dialogOpen: true});
                    this.setState({readyToSubmit: false});
                    return;
                }
                else if(question.answers.length === 0){
                    this.setState({dialogText: 'Proszę utworzyć proponowane odpowiedzi do pytania '+(questionIndex+1)+'', dialogOpen: true});
                    this.setState({readyToSubmit: false});
                    return;
                }
                else if(question.questionType === null){
                    this.setState({dialogText: 'Proszę wybrać rodzaj odpowiedzi w pytaniu '+(questionIndex+1)+'', dialogOpen: true});
                    this.setState({readyToSubmit: false});
                    return;
                }
                else{
                    question.answers.forEach((answer, answerIndex) => {
                        if(answer.text === null || answer.text === ""){
                            this.setState({dialogText: 'Proszę dodać tekst odpowiedzi '+(answerIndex+1)+' pytania '+(questionIndex+1)+'', dialogOpen: true});
                            this.setState({readyToSubmit: false});
                            return;
                        }
                    })
                }
            })


            if(this.state.readyToSubmit){
                if(!data.templateFor.for){
                    data.templateFor.for = null;
                }
                else{
                    data.templateFor.for = this.props.data.course_id;
                }
                this.setState({customSurveyData: data});
                this.postNewSurvey();
                this.returnButton();
            }
        }
    }

    //Jesli dodawana jest "nowa ankieta" to zmienia stan readyToSubmit, ktory wywoluje przekazanie danych z modulu nowych pytan ankiety (customSurvey.js),
    // a nastepnie po otrzymanie danych wywoluje przeslanie ich do api
    //Jesli dodawana jest ankieta z szablonu, to od razu wysyla dane
    handleSubmit = async function(event){
        event.preventDefault();
        if(this.state.fromTemplate === "fromTemplate"){
            this.postNewSurvey();
            this.returnButton();
        }
        else if(this.state.fromTemplate === "new"){
            this.setState({readyToSubmit: true});
        }
        
    }

    onNameChange(value){
        this.setState({surveyName: value})
    }

    onDescriptionChange(value){
        this.setState({surveyDescription: value})
    }

    allowCommentChange(value){
        this.setState({allowComment: value});
    }

    isOpenChange(value){
        this.setState({isOpen: value});
        if(value === false){
            this.setState({openDate: "", closeDate: ""});
        }
    }

    openDateChange(date){
        this.setState({openDate: date});
    }

    closeDateChange(date){
        this.setState({closeDate: date});
    }

    fromTemplateChange(value) {
        this.setState({ fromTemplate: value });
        if (value === "fromTemplate"){
            this.setState({ showCustomSurveyModule: false });
            this.getSurveyTemplates();
        }
        else if (value === "new"){
            this.setState({ surveyTemplatesLoaded: false, showTemplate: false, showCustomSurveyModule: true });
        } 
    }

    templatesChange(value) {
        this.setState({ showTemplate: true, selectedTemplate: value });
    }

    getSurveyTemplates = async function () {
        const response = await fetch('/surveys/getSurveyTemplates', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ course_id: this.props.data.course_id })
        });
        const surveyTemplates = await response.json();
        if (!surveyTemplates)
            return;
        this.surveyTemplates = surveyTemplates;
        this.setState({ surveyTemplatesLoaded: true, showTemplate: true });
        return surveyTemplates;
    }

    postNewSurvey = async function() {
        if(this.state.fromTemplate === "fromTemplate"){
            await fetch('/surveys/addNewSurvey', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    surveyName: this.state.surveyName,
                    surveyDescription: ((this.state.surveyDescription)?this.state.surveyDescription:null),
                    courseSurvey: {
                        courseUnitId: this.props.data.course_unit_id,
                        courseId: this.props.data.course_id,
                        courseName: this.props.data.course_name,
                        classType: this.props.data.class_type_id,
                        termId: this.props.data.term_id
                    },
                    // lecturer: this.props.data.lecturer,
                    surveyId: this.surveyTemplates[this.state.selectedTemplate]._id,
                    isOpen: this.state.isOpen,
                    openDate: this.state.openDate,
                    closeDate: this.state.closeDate,
                    survey: null,
                    allowComment: this.state.allowComment
                })
            });
        }
        else if(this.state.fromTemplate === "new"){
            await fetch('/surveys/addNewSurvey', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    surveyName: this.state.surveyName,
                    surveyDescription: ((this.state.surveyDescription)?this.state.surveyDescription:null),
                    courseSurvey: {
                        courseUnitId: this.props.data.course_unit_id,
                        courseId: this.props.data.course_id,
                        courseName: this.props.data.course_name,
                        classType: this.props.data.class_type_id,
                        termId: this.props.data.term_id
                    },
                    lecturer: this.props.data.lecturer,
                    surveyId: null,
                    isOpen: this.state.isOpen,
                    openDate: this.state.openDate,
                    closeDate: this.state.closeDate,
                    survey: this.state.customSurveyData,
                    allowComment: this.state.allowComment
                })
            });
        }
        

        
    }


    renderTemplatesSelect() {
        return this.surveyTemplates.map(function (template, index) {
            return (
                <MenuItem key={"selectedTemplate" + index} value={index}>{"Szablon " + (index + 1)}</MenuItem>
            )
        })
    }



    render() {

        return (
            <Box>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton aria-label="return" onClick={this.returnButton} display="inline">
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography variant="h5" display="inline">
                        Wybierz ustawienia nowej ankiety
                    </Typography>
                </Box>
                <Box mb={3}>
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <Box mb={2}>
                            <Button type="submit" variant="contained"
                             disabled={!(this.state.surveyName && (this.state.showTemplate || !this.state.showTemplate) &&
                            ((this.state.isOpen && this.state.openDate !== "" && this.state.closeDate !== "") || !this.state.isOpen)
                            )}>
                                <Typography variant="button">
                                    Dodaj ankietę
                                </Typography>
                            </Button>
                        </Box>
                        <Box mb={1}>
                            <TextField id="survey-name-tf" label="Nazwa" onChange={(event) => this.onNameChange(event.target.value)} fullWidth />
                        </Box>
                        <Box>
                            <TextField id="survey-description-tf" label="Opis" onChange={(event) => this.onDescriptionChange(event.target.value)} fullWidth />
                        </Box>
                    </form>
                </Box>
                <Box mb={2}>
                    <Box mr={2} display="inline">
                        <FormControl variant="outlined" >
                            <InputLabel id="select-allow-comment-label">Komentarz</InputLabel>
                            <Select labelId="select-allow-comment-label" id="select-allow-comment" value={this.state.allowComment} label="Komentarz"
                                onChange={(event) => this.allowCommentChange(event.target.value)}
                                style={{width: '200px'}}>
                                <MenuItem value={false}>Nie</MenuItem>
                                <MenuItem value={true}>Tak</MenuItem>
                            </Select>
                            <FormHelperText>Czy pozwolić na komentarz?</FormHelperText>
                        </FormControl>
                    </Box>
                    <Box mr={2} display="inline">
                        <FormControl variant="outlined" >
                            <InputLabel id="select-is-open-label">Otwarta</InputLabel>
                            <Select labelId="select-is-open-label" id="select-is-open" value={this.state.isOpen} label="Otwarta"
                                onChange={(event) => this.isOpenChange(event.target.value)}
                                style={{width: '200px'}}>
                                <MenuItem value={true}>Tak</MenuItem>
                                <MenuItem value={false}>Nie</MenuItem>
                            </Select>
                            <FormHelperText>Czy udostępnić ankietę?</FormHelperText>
                        </FormControl>
                    </Box>
                    <Box mr={2} display="inline">
                        <FormControl variant="outlined" >
                            <InputLabel id="select-is-template-label">Szablon</InputLabel>
                            <Select labelId="select-is-template-label" id="select-is-template" value={this.state.fromTemplate}
                                onChange={(event) => this.fromTemplateChange(event.target.value)} label="Szablon"
                                style={{width: '200px'}}>
                                <MenuItem value={"new"}>Nowa ankieta</MenuItem>
                                <MenuItem value={"fromTemplate"}>Z szablonu</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box display="inline">
                        {(this.state.surveyTemplatesLoaded) ?
                            (
                                <FormControl variant="outlined" >
                                    <InputLabel id="select-templates-label">Wybierz</InputLabel>
                                    <Select labelId="select-templates-label" id="select-templates" value={this.state.selectedTemplate}
                                        onChange={(event) => this.templatesChange(event.target.value)} label="Wybierz szablon"
                                        style={{width: '200px'}}>
                                        {this.renderTemplatesSelect()}
                                    </Select>
                                </FormControl>
                            ) :
                            false}
                    </Box>
                </Box>
                {(this.state.isOpen) ?
                    <Box mb={4}>
                        <TextField variant="outlined" value={this.state.openDate} onChange={(event) => { this.openDateChange(event.target.value) }} id="openDate" label="Data otwarcia" type="date" InputLabelProps={{ shrink: true }} style={{ width: "200px" }} />
                        <TextField variant="outlined" value={this.state.closeDate} onChange={(event) => { this.closeDateChange(event.target.value) }} id="closeDate" label="Data zamknięcia" type="date" InputLabelProps={{ shrink: true }} style={{ width: "200px", marginLeft: "16px" }} />
                    </Box> :
                    false
                }
                <Box>
                    {   (this.state.showTemplate) ?
                        (
                            <TemplateSurvey data={this.surveyTemplates[this.state.selectedTemplate]} />
                        ) :
                        false
                    }
                    {
                        (this.state.showCustomSurveyModule) ?
                        (
                            <CustomSurveyModule data={this.state.readyToSubmit} parentCallback={this.handleCustomSurveyData} />
                        ):
                        false
                        
                    }

                </Box>
                <Dialog open={this.state.dialogOpen} onClose={this.dialogClose} >
                    <MuiDialogTitle onClose={this.dialogClose}>
                        Błąd
                    </MuiDialogTitle>
                    <MuiDialogContent dividers>
                        <Typography gutterBottom>
                            {this.state.dialogText}
                        </Typography>
                    </MuiDialogContent>
                    <MuiDialogActions>
                        <Button autoFocus onClick={this.dialogClose} color="primary">
                            Zamknij
                        </Button>
                    </MuiDialogActions>
                </Dialog>
            </Box>
        )
    }
}