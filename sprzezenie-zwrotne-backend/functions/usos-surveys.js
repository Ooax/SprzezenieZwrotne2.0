const got = require('got');
const OAuth = require('oauth-1.0a');
require("dotenv").config();

//Funkcja ktora pobiera ankiety ktore mozna aktualnie wypelnic
const getSurveysToFill = async function(token) {
        let url = 'https://usosapps.umk.pl/services/surveys/surveys_to_fill2'
        const oauth = OAuth({
            consumer: {
                key: process.env.OAUTH_CONSUMER_KEY,
                secret: process.env.OAUTH_CONSUMER_SECRET
            },
            signature_method: 'PLAINTEXT',
        });
        try{
            const returnObject = await got(url, {
                headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
                searchParams:{
                    include_filled_out: true,
                    fields: "id|survey_type|name|can_i_fill_out|lecturer",
                }
            });
            const surveys = JSON.parse(returnObject.body);
            let unit_ids = "";
            // return surveys;
            surveys.forEach((element,index) => {
                const parts = element.id.split("|");
                if(index>0)
                    unit_ids+="|";
                unit_ids+=parts[2];
                element.unit_id = parts[2];
            });
            
            url = 'https://usosapps.umk.pl/services/courses/units'
            const returnObject2 = await got.post(url, {
                headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
                searchParams:{
                    unit_ids: unit_ids,
                    fields: "id|course_name|course_id|term_id|profile_url|classtype_id",
                    format: "json",
                }
            });
            const coursesInfo = JSON.parse(returnObject2.body);
            surveys.forEach((element) => {
                element.course_info = coursesInfo[element.unit_id];
            });
            return surveys;
        }
        catch(error){
            if(error.response){
                console.log(error.response.body);
                return error.response.body;
            }
            else{
                console.error(error);
            }
        }
        
};

//Funkcja pobierajaca dane o ankiecie
const getSurvey = async function(token, data) {
        let url = 'https://usosapps.umk.pl/services/surveys/survey2'
        const oauth = OAuth({
            consumer: {
                key: process.env.OAUTH_CONSUMER_KEY,
                secret: process.env.OAUTH_CONSUMER_SECRET
            },
            signature_method: 'PLAINTEXT',
        });
        try{
            const returnObject = await got.post(url, {
                headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
                searchParams:{
                    survey_id: data,
                    fields: "id|survey_type|name|headline_html|can_i_fill_out|did_i_fill_out|lecturer|programme|questions|has_final_comment",
                    format: "json",
                }
            });
            return JSON.parse(returnObject.body);
        }
        catch(error){
            if(error.response){
                console.log(error.response.body);
                return error.response.body;
            }
            else{
                console.error(error);
            }
        }
    
};

//Funkcja wysylajaca odpowiedzi do ankiety
const fillSurvey = async function(token, data) {
    let url = 'https://usosapps.umk.pl/services/surveys/fill_out2'
    const oauth = OAuth({
        consumer: {
            key: process.env.OAUTH_CONSUMER_KEY,
            secret: process.env.OAUTH_CONSUMER_SECRET
        },
        signature_method: 'PLAINTEXT',
    });
    try{
        const returnObject = await got.post(url, {
            headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
            searchParams:{
                survey_id: data.surveyId,
                answers: data.answers,
                comment: data.comment ? data.comment : "",
                format: "json",
            }
        });
        return JSON.parse(returnObject.body);
    }
    catch(error){
        if(error.response){
            console.log(error.response.body);
            return error.response.body;
        }
        else{
            console.error(error);
        }
    }

};


module.exports = {
    getSurveysToFill: getSurveysToFill,
    getSurvey: getSurvey,
    fillSurvey: fillSurvey
   };