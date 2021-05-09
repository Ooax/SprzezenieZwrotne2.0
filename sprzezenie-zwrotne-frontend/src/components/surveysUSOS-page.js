import React from 'react';
import SurveysUSOSTable from "./tables/surveyUSOSTable.js";
import SurveyUSOSComponent from "./questions/surveyUSOSQuestion.js";

//Strona z ankietami usos ktore mozna wypelnic
export default class SurveysUSOSPage extends React.Component {
    constructor() {
        super();
        this.state = {
            surveysLoaded: false,
            surveyLoaded: false,
            surveyToGet: "",
            availableSurveysData: null
        };

        this.getUsosSurveysToFill = this.getUsosSurveysToFill.bind(this);
        this.getUsosSurveyData = this.getUsosSurveyData.bind(this);
        this.handleSurveyToGetCallback = this.handleSurveyToGetCallback.bind(this);
        this.handleSurveyQuestionsCallback = this.handleSurveyQuestionsCallback.bind(this);
    }

    componentDidMount(){
        this.getUsosSurveysToFill();
    }

    handleSurveyToGetCallback = async function(surveyChosen) {
        await this.setState({surveyToGet: surveyChosen});
        this.getUsosSurveyData();
    }

    handleSurveyQuestionsCallback(data){
        if(data === "Return"){
            this.getUsosSurveysToFill();
        }
        else if(data === "Reload"){
            this.getUsosSurveysToFill();
        }
    }


    getUsosSurveysToFill = async function(){
        const response = await fetch('/usosSurveys/getUsosSurveysToFill', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const surveysData = await response.json();
        if(surveysData || surveysData.length > 0)
            this.setState({surveysLoaded: true, surveyLoaded: false, availableSurveysData: surveysData.filter((element) => element.can_i_fill_out === true)});
        else
            this.setState({surveysLoaded: true, surveyLoaded: false});
        return surveysData;
    }

    getUsosSurveyData = async function(){
        const response = await fetch('/usosSurveys/getUsosSurvey', {
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
        surveyData.course_info = {
            course_id: null,
            course_name: null,
            term_id: null,
            classtype_id: null
        }
        surveyData.course_info.course_id = this.state.availableSurveysData.find((element) => element.id === this.state.surveyToGet).course_info.course_id;
        surveyData.course_info.course_name = this.state.availableSurveysData.find((element) => element.id === this.state.surveyToGet).course_info.course_name;
        surveyData.course_info.term_id = this.state.availableSurveysData.find((element) => element.id === this.state.surveyToGet).course_info.term_id;
        surveyData.course_info.classtype_id = this.state.availableSurveysData.find((element) => element.id === this.state.surveyToGet).course_info.classtype_id;
        this.surveyData = surveyData;
        this.setState({surveysLoaded: false, surveyLoaded: true});
        return surveyData;
    }

    render() {
        return (
            <div>
                {
                    (!this.state.surveyLoaded)?
                        ((this.state.surveysLoaded) ? <SurveysUSOSTable data = {this.state.availableSurveysData} parentCallback = {this.handleSurveyToGetCallback}/>: false):
                        false
                }
                {/* <form>
                    <input type="text" id="surveyToGet" placeholder="Wpisz id ankiety którą chcesz pobrać" size="50"
                        onChange={event => this.setState({surveyToGet: event.target.value})}/>
                </form> */}
                {
                    (!this.state.surveysLoaded)?
                        ((this.state.surveyLoaded) ? <SurveyUSOSComponent data = {this.surveyData} parentCallback={this.handleSurveyQuestionsCallback} /> : false):
                        false
                }

            </div>
        )
    }
}