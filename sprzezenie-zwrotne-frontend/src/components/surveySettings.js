import React from 'react';
import { Typography, Box, IconButton, Select, InputLabel, MenuItem, FormControl, FormHelperText, TextField, Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { withTranslation } from 'react-i18next';
import i18n from '../i18n';

//Komponent zarzadzania ustawieniami ankiet
function getCorrectDateFormat(inputDate) {
    let date = new Date(inputDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return(year + '-' + month + '-' + day);
}

class SurveySettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            openDate: null,
            closeDate: null,
            loaded: false,
            surveyData: null
        }
        

        this.textFieldDates = this.textFieldDates.bind(this);
        this.returnButton = this.returnButton.bind(this);
        this.isOpenChange = this.isOpenChange.bind(this);
        this.openDateChange = this.openDateChange.bind(this);
        this.closeDateChange = this.closeDateChange.bind(this);
        this.updateButtonClick = this.updateButtonClick.bind(this);
        this.updateMySurveyData = this.updateMySurveyData.bind(this);
        this.getMySurveyData = this.getMySurveyData.bind(this);
    }

    

    textFieldDates(){
        if(this.state.surveyData.openDate)
            this.setState({
                openDate: getCorrectDateFormat(this.state.surveyData.openDate)
            })
        if(this.state.surveyData.closeDate)
            this.setState({
                closeDate: getCorrectDateFormat(this.state.surveyData.closeDate)
            })
    }

    componentDidMount(){
        this.getMySurveyData();
    }

    returnButton(){
        this.props.parentCallback("Return");
    }

    isOpenChange(value){
        this.setState({isOpen: value});
        if(value === false){
            this.textFieldDates();
        }
    }

    openDateChange(date){
        this.setState({openDate: date});
    }

    closeDateChange(date){
        this.setState({closeDate: date});
    }

    updateButtonClick(){
        this.updateMySurveyData();
    }

    updateMySurveyData = async function () {
        await fetch('/surveys/updateMySurveyData', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                _id: this.state.surveyData._id,
                isOpen: this.state.isOpen,
                openDate: this.state.openDate,
                closeDate: this.state.closeDate
             })
        });
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
        this.textFieldDates();
        this.setState({isOpen: surveyData.isOpen, loaded: true});
    }


    render() {
        const { t } = this.props;
        return (
            (!this.state.loaded)?
            <div>{t('Loading')}</div>:
            <Box>
                <Box display="flex" alignItems="center" mb={4}>
                    <Box>
                        <IconButton aria-label="return" onClick={this.returnButton} display="inline">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Box>
                    <Box mr={2}>
                        <Typography variant="h5" display="inline">
                            {t('SurveySettings')}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" display="inline">
                                {this.state.surveyData.courseInfo.courseId + " - " + this.state.surveyData.courseInfo.courseName[i18n.language] + " [" + this.state.surveyData.courseInfo.classType + "] " +
                                this.state.surveyData.courseInfo.termId}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Box mb={4}>
                        <Button variant="contained" onClick={this.updateButtonClick}>
                            <Typography variant="button">
                                {t('UpdateSurvey')}
                            </Typography>
                        </Button>
                    </Box>
                    <Box mr={2} mb={4}>
                        <FormControl variant="outlined" >
                            <InputLabel id="select-is-open-label">Otwarta</InputLabel>
                            <Select labelId="select-is-open-label" id="select-is-open" value={this.state.isOpen} label="Otwarta"
                                onChange={(event) => this.isOpenChange(event.target.value)}
                                style={{width: '200px'}}>
                                <MenuItem value={true}>Tak</MenuItem>
                                <MenuItem value={false}>Nie</MenuItem>
                            </Select>
                            <FormHelperText>{t('ShareSurvey')}</FormHelperText>
                        </FormControl>
                    </Box>
                    {(this.state.isOpen) ?
                        <Box mb={4}>
                            <TextField variant="outlined" value={this.state.openDate} onChange={(event) => { this.openDateChange(event.target.value) }} id="openDate" label="Data otwarcia" type="date" InputLabelProps={{ shrink: true }} style={{ width: "200px" }} />
                            <TextField variant="outlined" value={this.state.closeDate} onChange={(event) => { this.closeDateChange(event.target.value) }} id="closeDate" label="Data zamkni??cia" type="date" InputLabelProps={{ shrink: true }} style={{ width: "200px", marginLeft: "16px" }} />
                        </Box> :
                    false
                }
                </Box>
            </Box>
        )
    }
}
export default withTranslation()(SurveySettings);