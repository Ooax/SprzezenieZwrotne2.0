import React from 'react';
import MainPage from './main-page.js';
import SurveysUSOSPage from './surveysUSOS-page.js';
import SurveysPage from './surveys-page.js';
import AddSurveyPage from './addSurvey-page.js';
import ManageSurveysPage from './manageSurveys-page.js';

//Glowna zawartosc strony wybierana z szuflady
export default class MainView extends React.Component {

    componentDidMount(){
    }


    render() {
        if(this.props.data === "Main")
            return(
                <MainPage />
            )
        else if(this.props.data === "GetSurveys")
            return(
                <SurveysPage />
            )
        else if(this.props.data === "AddSurvey")
            return(
                <AddSurveyPage />
            )
        else if(this.props.data === "ManageSurveys")
            return(
                <ManageSurveysPage />
            )
        else if(this.props.data === "GetUSOSSurveys")
            return(
                <SurveysUSOSPage />
            )
    }
}