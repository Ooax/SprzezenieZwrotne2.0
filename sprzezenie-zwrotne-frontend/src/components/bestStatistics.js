import React from 'react';
import { Typography, Box, IconButton } from '@material-ui/core';
import {Bar} from 'react-chartjs-2';
import lightBlue from '@material-ui/core/colors/lightBlue';
import purple from '@material-ui/core/colors/purple';
import indigo from '@material-ui/core/colors/indigo';
import teal from '@material-ui/core/colors/teal';
import lightGreen from '@material-ui/core/colors/lightGreen';
import amber from '@material-ui/core/colors/amber';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { withTranslation } from 'react-i18next';
import i18n from '../i18n';


//Komponent statystyk ankiety
class BestStatistics extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            surveyData: null,
            loaded: false
        }
        
        

        this.organizeDataToView = this.organizeDataToView.bind(this);
        this.renderBars = this.renderBars.bind(this);
        this.getMyBestSurveys = this.getMyBestSurveys.bind(this);
    }

    organizeDataToView(){
        this.surveys = [];
        this.surveys1 = [];
        this.comments = [];
        this.state.surveyData.forEach((survey, surveyIndex) => {
            var surveyData = {
                surveyText: survey.text,
                surveyStats: {
                    labels: [],
                    datasets: [{
                        label: "",
                        backgroundColor: [
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                        ],
                        borderColor: [
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: [
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                        ],
                        hoverBorderColor: [
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                        ],
                        data: [],
                        data1: []
                    }]
                }
            }
            // surveyData.surveyStats.datasets[0].label = this.state.surveyData[surveyIndex].surveyName ? this.state.surveyData[surveyIndex].surveyName :
            //   (+": " + this.state.surveyData[surveyIndex].surveyName.courseInfo.courseName[i18n.language]);
            survey.questions.forEach((question, questionIndex) => {
                if(question.graded){
                    surveyData.surveyStats.labels.push(questionIndex + 1);
                    if(question.questionType === "Radio"){
                        surveyData.surveyStats.datasets[0].data.push(question.countedGrade / (question.maxGrade * question.timesAnswered));
                        surveyData.surveyStats.datasets[0].data1.push(question.text);
                        console.log(surveyData)
                    }
                    else if(question.questionType === "Checkbox"){
                        surveyData.surveyStats.datasets[0].data.push(question.countedGrade / (question.maxGrade * survey.timesAnswered));
                        surveyData.surveyStats.datasets[0].data1.push(question.text);
                    }
                }
            })
            
            this.surveys.push(surveyData);
        })

        this.state.surveyData1.forEach((survey, surveyIndex) => {
            var surveyData = {
                surveyText: survey.text,
                surveyStats: {
                    labels: [],
                    datasets: [{
                        label: "",
                        backgroundColor: [
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                            lightBlue[200],
                            purple[200],
                            indigo[200],
                            teal[200],
                            lightGreen[200],
                            amber[200],
                            deepOrange[200],
                        ],
                        borderColor: [
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                            lightBlue[400],
                            purple[400],
                            indigo[400],
                            teal[400],
                            lightGreen[400],
                            amber[400],
                            deepOrange[400],
                        ],
                        borderWidth: 1,
                        hoverBackgroundColor: [
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                            lightBlue[800],
                            purple[800],
                            indigo[800],
                            teal[800],
                            lightGreen[800],
                            amber[800],
                            deepOrange[800],
                        ],
                        hoverBorderColor: [
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                            lightBlue[900],
                            purple[900],
                            indigo[900],
                            teal[900],
                            lightGreen[900],
                            amber[900],
                            deepOrange[900],
                        ],
                        data: [],
                        data1: []
                    }]
                }
            }
            // surveyData.surveyStats.datasets[0].label = this.state.surveyData1[surveyIndex].surveyName ? this.state.surveyData1[surveyIndex].surveyName :
            //   (+": " + this.state.surveyData1[surveyIndex].surveyName.courseInfo.courseName[i18n.language]);
            survey.questions.forEach((question, questionIndex) => {
                if(question.graded){
                    surveyData.surveyStats.labels.push(questionIndex + 1);
                    if(question.questionType === "Radio"){
                        surveyData.surveyStats.datasets[0].data.push(question.countedGrade / (question.maxGrade * question.timesAnswered));
                        surveyData.surveyStats.datasets[0].data1.push(question.text);
                        console.log(surveyData)
                    }
                    else if(question.questionType === "Checkbox"){
                        surveyData.surveyStats.datasets[0].data.push(question.countedGrade / (question.maxGrade * survey.timesAnswered));
                        surveyData.surveyStats.datasets[0].data1.push(question.text);
                    }
                }
            })
            
            this.surveys1.push(surveyData);
        })
        
    }

    componentDidMount(){
        this.getMyBestSurveys();
    }


    renderBars(srvs, srv){
        const { t } = this.props;
        if((srvs)?(srvs.length > 0):false)
        {
            return srvs.map((survey, index) => {
                return(
                    <Box key={"hb-box-"+index} display="inline-block" height={600} style={{width: 'calc(33.3% - 20px)'}} m={1} p={2} border={1} borderRadius="borderRadius">
                        <Box height={'15%'}>
                        <Typography variant="h6">
                            {srv[index].courseInfo.courseId + " - " + srv[index].courseInfo.courseName[i18n.language] + " [" + srv[index].courseInfo.classType + "] " +
                                srv[index].courseInfo.termId}
                        </Typography>
                        </Box>
                        <Box height={'15%'}>
                        <Typography variant="h6">
                            {t('AverageGradeScale') + ": " + parseFloat(srv[index].overallGrade).toFixed(2)}
                        </Typography>
                        </Box>
                        <Box height={'70%'}>
                            <Bar data={survey.surveyStats} 
                                options={{ maintainAspectRatio: false, scales: { yAxes: [{ ticks: { beginAtZero: true, min: 0, max: 1 }, scaleLabel: {
                                    display: true, labelString: t('AverageGrade')
                                } }], xAxes: [{
                                    scaleLabel: {
                                        display: true, labelString: t('Questions')
                                    }
                                }] },
                                tooltips: {
                                    mode: 'label',
                                    callbacks: {
                                        title: function(){return t('AverageGrade');},
                                        label: function(tooltipItem, data){return data.datasets[0].data1[tooltipItem.index] + ": " + parseFloat(data.datasets[0].data[tooltipItem.index]).toFixed(2);}
                                    }
                                },
                                legend: {
                                    display: false
                                } }} />  
                        </Box>
                    </Box>
                )
            })
        }
        else{
            return (
                <Box mt={5} color={lightBlue[600]}>
                    <Typography variant="h5" >
                        {t('NoSurveyAnswered')}
                    </Typography>
                </Box>
            )
        }
    }


    getMyBestSurveys = async function(){
        const response = await fetch('/surveys/getMyBestSurveys', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const surveyData = await response.json();
        // if(surveysData?(surveysData.length > 0):false)
        //     this.setState({surveysLoaded: true, surveyLoaded: false, surveysAvailableToManage: surveysData});
        // else
        //     return
        console.log(surveyData);
        this.state.surveyData = surveyData.best;
        this.state.surveyData1 = surveyData.worst;
        this.organizeDataToView();
        this.setState({isOpen: surveyData.isOpen, loaded: true});
    }


    render() {
        const { t } = this.props;
        return (
            (!this.state.loaded)?
            <div>{t('Loading')}</div>:
            <Box>
                <Typography variant="h5">
                        {t('YourBestClasses')+": " }
                </Typography>
                {
                    this.renderBars(this.surveys, this.state.surveyData)
                }
                <Typography variant="h5">
                        {t('YourWorstClasses')+": " }
                </Typography>
                {
                    this.renderBars(this.surveys1, this.state.surveyData1)
                }
            </Box>
        )
    }
}
export default withTranslation()(BestStatistics);