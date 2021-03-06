import React from 'react';
import { Typography, Box } from '@material-ui/core';
import CoursesTable from './tables/coursesTable.js';
import NewSurvey from './newSurvey.js';
import { withTranslation } from "react-i18next";

//Strona dodawania ankiet
class AddSurveyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coursesLoaded: false,
            newSurveyLoaded: false,
            coursesAvailableToSurvey: [],
            courseChosen: null,
        };

        this.getCoursesAvailableToSurvey = this.getCoursesAvailableToSurvey.bind(this);
        this.handleCourseToSurveyCallback = this.handleCourseToSurveyCallback.bind(this);
        this.handleNewSurveyCallback = this.handleNewSurveyCallback.bind(this);
    }

    componentDidMount(){
        this.getCoursesAvailableToSurvey();
    }

    handleCourseToSurveyCallback= async function(courseChosen){
        this.setState({courseChosen: courseChosen});
    }

    handleNewSurveyCallback(data){
        if(data === "Return")
            this.setState({courseChosen: null});
    }


    getCoursesAvailableToSurvey = async function(){
        const response = await fetch('/surveys/getCoursesAvailableToSurvey', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const coursesAvailableToSurvey = await response.json();
        this.setState({coursesLoaded: true, newSurveyLoaded: false, coursesAvailableToSurvey: coursesAvailableToSurvey});
        return coursesAvailableToSurvey;
    }



    render() {
        const { t } = this.props;
        if (!this.state.courseChosen)
            return (
                <Box>
                    <Box mb={2}>
                        <Typography variant="h5">
                        {t('ChooseCourse')}
                        </Typography>
                    </Box>
                    <Box>
                        {(this.state.coursesLoaded) ?
                            <CoursesTable data={this.state.coursesAvailableToSurvey} parentCallback={this.handleCourseToSurveyCallback} /> :
                            false}
                    </Box>
                </Box>
            )
        else if(this.state.courseChosen)
            return (
                <Box>
                    <NewSurvey data={this.state.courseChosen} parentCallback={this.handleNewSurveyCallback} />
                </Box>
            )
    }
}
export default withTranslation()(AddSurveyPage);