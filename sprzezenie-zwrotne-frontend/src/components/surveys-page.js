import React from 'react';
import { SurveysTable } from './tables.js';
import { SurveyComponent } from './questions.js';
import { Typography, Box } from '@material-ui/core';

//Strona z ankietami ktore mozna wypelnic
export default class SurveysPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surveysLoaded: false,
            surveyLoaded: false,
            surveyToGet: "",
            availableSurveysData: null
        };

        this.getAvailableSurveys = this.getAvailableSurveys.bind(this);
        this.getSurveyData = this.getSurveyData.bind(this);
        this.surveyToGetCallback = this.surveyToGetCallback.bind(this);
        this.handleSurveyQuestionsCallback = this.handleSurveyQuestionsCallback.bind(this);
    }

    componentDidMount(){
        this.getAvailableSurveys();
    }

    surveyToGetCallback = async function(surveyChosen) {
        this.surveyData = surveyChosen;
        await this.setState({surveyToGet: surveyChosen.surveyId});
        this.getSurveyData();
    }

    handleSurveyQuestionsCallback(data){
        if(data === "Return"){
            this.getAvailableSurveys();
        }
        else if(data === "Reload"){
            this.getAvailableSurveys();
        }
    }

    getAvailableSurveys = async function(){
        const response = await fetch('/surveys/getAvailableSurveys', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const surveysData = await response.json();
        if(surveysData || surveysData.length > 0)
            this.setState({surveysLoaded: true, surveyLoaded: false, availableSurveysData: surveysData.filter((element) => element.availableToFillOut === true)});
        else
            this.setState({surveysLoaded: true, surveyLoaded: false});
        return surveysData;
    }

    getSurveyData = async function(){
        const response = await fetch('/surveys/getSurveyData', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({surveyId: this.state.surveyToGet})
        });
        const surveyData = await response.json();
        if(!surveyData)
            return;
        this.surveyData.questions = surveyData[0].questions;
        this.setState({surveysLoaded: false, surveyLoaded: true});
    }


    render() {
        return (
            <div>
                {
                    (!this.state.surveyLoaded) ?
                        ((this.state.surveysLoaded) ?
                            <Box>
                                <Box mb={3}>
                                    <Typography variant="h4">
                                        Ankiety, które można wypełnić:
                                    </Typography>
                                </Box>
                                <SurveysTable data={this.state.availableSurveysData} parentCallback={this.surveyToGetCallback} />
                            </Box>
                            : false) :
                        false
                }
                {
                    (!this.state.surveysLoaded) ?
                        ((this.state.surveyLoaded) ? <SurveyComponent data={this.surveyData} parentCallback={this.handleSurveyQuestionsCallback} /> : false) :
                        false
                }
            </div>
        )
    }
}