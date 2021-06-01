import React from 'react';
import SurveysTable from './tables/surveyTable.js';
import SurveyComponent from './questions/surveyQuestion.js';
import { Typography, Box } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import i18n from '../i18n';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

//Strona z ankietami ktore mozna wypelnic
class SurveysPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            surveysLoaded: false,
            surveyLoaded: false,
            surveyToGet: "",
            availableSurveysData: null,
            dialogLoaded: false,
            dialogOpen: false
        };

        this.getAvailableSurveys = this.getAvailableSurveys.bind(this);
        this.getSurveyData = this.getSurveyData.bind(this);
        this.handleSurveyToGetCallback = this.handleSurveyToGetCallback.bind(this);
        this.handleSurveyQuestionsCallback = this.handleSurveyQuestionsCallback.bind(this);
        this.handleSurveyToGetCallback2 = this.handleSurveyToGetCallback2.bind(this);
        this.getCourseDetails = this.getCourseDetails.bind(this);
    }

    componentDidMount(){
        this.getAvailableSurveys();
    }

    handleSurveyToGetCallback = async function(surveyChosen) {
        this.surveyData = surveyChosen;
        await this.setState({surveyToGet: surveyChosen.surveyId});
        this.getSurveyData();
    }
    handleSurveyToGetCallback2 = async function(surveyChosen, button) {
        if (button === "info"){
            await this.setState({courseDetailsToGet: surveyChosen});
            this.setState({dialogLoaded : true});
            this.getModalOpened();
            this.getCourseDetails();
        }
    }

    getModalOpened = () => {
        this.setState({dialogOpen: true});
    }

    handleToggle = () => {
        this.setState({
            dialogOpen: !this.state.dialogOpen
        })
    }

    setCourseData(courseData){
        if (courseData.name["en"] == "" || courseData.description["en"] == ""){
            if (i18n.language == "en")
            {
                this.setState({courseEnAv: false});
            }
            else
            {
                this.setState({courseEnAv: true});
            }
            if (courseData.name["en"] == "")
            {
                this.setState({courseName : courseData.name["pl"]})
            }
            else
            {
                this.setState({courseName : courseData.name[i18n.language]})
            }
            this.setState({courseDesc : courseData.description["pl"]})
            
            if (courseData.attributes2.find(x => x.name.pl === "Rodzaj przedmiotu") === undefined)
            {
                this.setState({courseType : ""})
            }
            else
            {
                this.setState({courseType : (courseData.attributes2.find(x => x.name["pl"] === "Rodzaj przedmiotu").values[0].label["pl"])})
            }      
            if (courseData.attributes2.find(x => x.name.pl === "Całkowity nakład pracy studenta") === undefined)
            {
                this.setState({courseTotalWorkload : ""})
            }
            else
            {
                this.setState({courseTotalWorkload : (courseData.attributes2.find(x => x.name["pl"] === "Całkowity nakład pracy studenta").values[0].label["pl"])})
            }      
            if (courseData.attributes2.find(x => x.name.pl === "Metody dydaktyczne") === undefined)
            {
                this.setState({courseTeachingMetods : ""})
            }
            else
            {
                this.setState({courseTeachingMetods : (courseData.attributes2.find(x => x.name["pl"] === "Metody dydaktyczne").values[0].label["pl"])})
            }      
            this.setState({courseAssessment : courseData.assessment_criteria["pl"]})
        }
        else {
            this.setState({courseDesc : courseData.description[i18n.language]})
            this.setState({courseName : courseData.name[i18n.language]})
            if (courseData.attributes2.find(x => x.name.pl === "Rodzaj przedmiotu") === undefined)
            {
                this.setState({courseType : ""})
            }
            else
            {
                this.setState({courseType : (courseData.attributes2.find(x => x.name["pl"] === "Rodzaj przedmiotu").values[0].label[i18n.language])})
            }      
            if (courseData.attributes2.find(x => x.name.pl === "Całkowity nakład pracy studenta") === undefined)
            {
                this.setState({courseTotalWorkload : ""})
            }
            else
            {
                this.setState({courseTotalWorkload : (courseData.attributes2.find(x => x.name["pl"] === "Całkowity nakład pracy studenta").values[0].label[i18n.language])})
            }      
            if (courseData.attributes2.find(x => x.name.pl === "Metody dydaktyczne") === undefined)
            {
                this.setState({courseTeachingMetods : ""})
            }
            else
            {
                this.setState({courseTeachingMetods : (courseData.attributes2.find(x => x.name["pl"] === "Metody dydaktyczne").values[0].label[i18n.language])})
            }      
            this.setState({courseAssessment : courseData.assessment_criteria[i18n.language]})
        }
        this.setState({courseLink : courseData.profile_url});
        this.setState({courseCode : courseData.id});
    }

    getCourseDetails = async function(){
        const response = await fetch('/surveys/getCourseDetails', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseId: this.state.courseDetailsToGet
            })
        });
        const courseData = await response.json();
        if (!courseData) return;
        this.courseData = courseData;
        this.setCourseData(courseData);
        this.setState({courseData : courseData})
        return courseData;
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
        const { t } = this.props;
        return (
            <div>
                {
                    (!this.state.surveyLoaded) ?
                        ((this.state.surveysLoaded) ?
                            <Box>
                                <Box mb={3}>
                                    <Typography variant="h4">
                                        {t('SurveysToFill')}
                                    </Typography>
                                </Box>
                                <SurveysTable data={this.state.availableSurveysData} parentCallback={this.handleSurveyToGetCallback} parentCallback2={this.handleSurveyToGetCallback2} />
                            </Box>
                            : false) :
                        false
                }
                {
                    (!this.state.surveysLoaded) ?
                        ((this.state.surveyLoaded) ? <SurveyComponent data={this.surveyData} parentCallback={this.handleSurveyQuestionsCallback} /> : false) :
                        false
                }
                {
                        ((this.state.dialogLoaded) ? <Dialog open = {this.state.dialogOpen} onClick = {this.handleToggle} maxWidth="lg">
                            <DialogTitle>
                                {
                                     <a target="_blank" rel="noopener noreferrer" href = {this.state.courseLink}>
                                     {this.state.courseName}
                                 </a>
                                    
                                }
                            </DialogTitle>
                            <DialogContent style={{ overflowX: "hidden"}}>
                                {
                                    (!this.state.courseEnAv) ? <div><p><i>Course details in English are unavailable. Displaying details in Polish.</i></p></div> : false
                                }
                                {
                                    <div>
                                    <div><p><b>{t('Code')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseCode}</pre></p></div>
                                    <div><p><b>{t('CourseDesc')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseDesc}</pre></p></div>
                                    {
                                            (!this.state.courseType == "") ? <p><b>{t('TypeOfClasses')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseType}</pre></p> : false
                                    }
                                    {
                                            (!this.state.courseTotalWorkload == "") ?  <p><b>{t('CourseTotalWorkload')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseTotalWorkload}</pre></p> : false
                                    }
                                    {
                                            (!this.state.courseTeachingMetods == "") ? <p><b>{t('CourseTeachingMethods')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseTeachingMetods}</pre></p> : false
                                    }
                                    {
                                            (!this.state.courseAssessment == "") ? <p><b>{t('CourseAssessments')}</b>: <pre style={{ flexWrap: "wrap", whiteSpace: "pre-wrap"}}>{this.state.courseAssessment}</pre></p> : false
                                    }
                                   </div>
                                }
                            </DialogContent>
                        </Dialog>: false
                        )
                }
            </div>
        )
    }
}
export default withTranslation()(SurveysPage);