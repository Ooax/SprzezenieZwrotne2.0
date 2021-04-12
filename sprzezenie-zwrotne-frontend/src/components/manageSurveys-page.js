import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { StaffSurveysTable } from './tables.js';
import SurveyStatistics from './surveyStatistics.js';
import SurveySettings from './surveySettings.js';
import { withTranslation } from "react-i18next";


//Strona zarzadzania ankietami
class ManageSurveysPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surveysLoaded: false,
            surveyDataLoaded: false,
            surveysAvailableToManage: [],
            surveyChosen: null,
            actionOnSurvey: null
        };

        this.handleSurveyToGetCallback = this.handleSurveyToGetCallback.bind(this);
        this.handleSurveyStatisticsCallback = this.handleSurveyStatisticsCallback.bind(this);
        this.handleSurveySettingsCallback = this.handleSurveySettingsCallback.bind(this);
        this.getMySurveys = this.getMySurveys.bind(this);
    }

    componentDidMount(){
        this.getMySurveys();
    }

    handleSurveyToGetCallback = async function(surveyChosen, button) {
        await this.setState({surveyChosen: surveyChosen._id, actionOnSurvey: button});
        if(button === "statistics"){
            this.setState({surveysLoaded: false, surveyDataLoaded: true});
        }
        else if(button === "settings"){
            this.setState({surveysLoaded: false, surveyDataLoaded: true});
        }
    }

    handleSurveyStatisticsCallback(data){
        if(data === "Return"){
            this.setState({surveyChosen: null, surveysLoaded: true});
        }
    }

    handleSurveySettingsCallback(data){
        if(data === "Return"){
            this.setState({surveyChosen: null, surveysLoaded: true});
        }
    }

    getMySurveys = async function(){
        const response = await fetch('/surveys/getMySurveys', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const surveysData = await response.json();
        if(surveysData?(surveysData.length > 0):false)
            this.setState({surveysLoaded: true, surveyLoaded: false, surveysAvailableToManage: surveysData});
        else
            return
    }




    render() {
        const { t } = this.props;
        return (
            <Box>
                {
                    (!this.state.surveyChosen)
                        ?
                        (
                            (this.state.surveysAvailableToManage)
                                ?
                                <Box>
                                    <Box mb={2}>
                                        <Typography variant="h5">
                                        {t('ChooseSurveyToManage')}
                                    </Typography>
                                    </Box>
                                    <Box>
                                        <StaffSurveysTable data={this.state.surveysAvailableToManage} buttons={{ statistics: true, settings: true }} parentCallback={this.handleSurveyToGetCallback} />
                                    </Box>
                                </Box>
                                :
                                false
                        )
                        :
                        false
                }
                {
                    (this.state.surveyChosen)
                    ?
                    (
                        (this.state.surveyDataLoaded)
                            ?
                            (
                                (this.state.actionOnSurvey === "statistics")
                                ?
                                (
                                    <Box>
                                        <SurveyStatistics data={this.state.surveyChosen} parentCallback={this.handleSurveyStatisticsCallback} />
                                    </Box>
                                )
                                :
                                false
                            )
                            :
                            false
                    )
                    :
                    false
                }
                {
                    (this.state.surveyChosen)
                    ?
                    (
                        (this.state.surveyDataLoaded)
                            ?
                            (
                                (this.state.actionOnSurvey === "settings")
                                ?
                                (
                                    <Box>
                                        <SurveySettings data={this.state.surveyChosen} parentCallback={this.handleSurveySettingsCallback} />
                                    </Box>
                                )
                                :
                                false
                            )
                            :
                            false
                    )
                    :
                    false
                }
            </Box>
        )
    }
}
export default withTranslation()(ManageSurveysPage);