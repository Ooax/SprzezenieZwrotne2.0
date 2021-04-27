const got = require('got');
const OAuth = require('oauth-1.0a');
const mongoQuery = require('../mongoQuery.js');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


//Pobieranie danych o zajeciach, ktore sie prowadzilo i do ktorych mozna utworzyc ankiete
const getCoursesAvailableToSurvey = async function (token, userdata) {
    // //Część testowania
    let url = 'https://usosapps.umk.pl/services/courses/user'
    const oauth = OAuth({
        consumer: {
            key: process.env.OAUTH_CONSUMER_KEY,
            secret: process.env.OAUTH_CONSUMER_SECRET
        },
        signature_method: 'PLAINTEXT',
    });
    var returnObject = null;
    returnObject = await got(url, {
        headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
        searchParams: {
            fields: "course_editions",
        }
    })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.body);
                return { message: error.response.body };
            }
            else {
                console.error(error);
            }
        })
    var data = JSON.parse(returnObject.body);
    var currentCourses = null;
    var wholeYearTerm = userdata.term.slice(0, -1);
    if (data.course_editions[wholeYearTerm])
        currentCourses = data.course_editions[userdata.term].concat(data.course_editions[wholeYearTerm]);
    else
        currentCourses = data.course_editions[userdata.term];
    currentCourseUnitsIds = [];
    
    if (currentCourses.length > 0) {
        currentCourses.forEach(course => {
            if (course.user_groups) {
                if (course.user_groups.length > 0) {
                    course.user_groups.forEach(userGroup => {
                        currentCourseUnitsIds.push(userGroup.course_unit_id);
                    })
                }
            }

        })
    }
///////////////

    //Część faktyczna
    // let url = 'https://usosapps.umk.pl/services/users/user';
    // const oauth = OAuth({
    //     consumer: {
    //         key: process.env.OAUTH_CONSUMER_KEY,
    //         secret: process.env.OAUTH_CONSUMER_SECRET
    //     },
    //     signature_method: 'PLAINTEXT',
    // });
    // var returnObject = null;
    // returnObject = await got(url, {
    //     headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    //     searchParams: {
    //         fields: "course_editions_conducted",
    //     }
    // })
    //     .catch(function (error) {
    //         if (error.response) {
    //             console.log(error.response.body);
    //             return { message: error.response.body };
    //         }
    //         else {
    //             console.error(error);
    //         }
    //     });
    // var data = JSON.parse(returnObject.body);
    // data = data.course_editions_conducted;
    // console.log(data);
    // var wholeYearTerm = userdata.term.slice(0, -1);
    // // data = data.filter(course => (course.term.id == userdata.term) || (course.term.id == wholeYearTerm));
    // var currentCourseEditions = [];
    // data.forEach(courseEdition => {
    //     currentCourseEditions.push({courseId: courseEdition.course.id, termId: courseEdition.term.id});
    // });

    // var currentCourseUnitsIds = [];
    // currentCourseEditions.forEach(async function (currentCourseEdition) {
    //     url = 'https://usosapps.umk.pl/services/courses/course_edition';
    //     returnObject = null;
    //     returnObject = await got(url, {
    //         headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    //         searchParams: {
    //             course_id: currentCourseEdition.courseId,
    //             term_id: currentCourseEdition.termId,
    //             fields: "course_id|course_name|term_id|user_groups|course_units_ids",
    //         }
    //     })
    //         .catch(function (error) {
    //             if (error.response) {
    //                 console.log(error.response.body);
    //                 return { message: error.response.body };
    //             }
    //             else {
    //                 console.error(error);
    //             }
    //         });
    //     var courseData = JSON.parse(returnObject.body);
    //     courseData.course_units_ids.forEach(cui => {
    //         currentCourseUnitsIds.push(cui);
    //     })
        
    // });
/////////////


    var pipeSeparatedUnitIds = "";
    currentCourseUnitsIds.forEach((element, index) => {
        if(index>0)
            pipeSeparatedUnitIds += "|";
        pipeSeparatedUnitIds += element;
    })
    var returnCourses = [];
    url = 'https://usosapps.umk.pl/services/courses/units';
        returnObject = null;
        returnObject = await got(url, {
            headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
            searchParams: {
                unit_ids: pipeSeparatedUnitIds,
                fields: "id|course_name|course_id|term_id|profile_url|classtype_id",
            }
        })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.body);
                    return { message: error.response.body };
                }
                else {
                    console.error(error);
                }
            });
            var returnCoursesBeforeProcessing = JSON.parse(returnObject.body);
            currentCourseUnitsIds.forEach(cui => {
                returnCourses.push({
                    course_name: returnCoursesBeforeProcessing[cui].course_name,
                    term_id: returnCoursesBeforeProcessing[cui].term_id,
                    course_id: returnCoursesBeforeProcessing[cui].course_id,
                    course_unit_id: returnCoursesBeforeProcessing[cui].id+"",
                    class_type_id: returnCoursesBeforeProcessing[cui].classtype_id,
                })
            })
    return returnCourses;
}

//Dostepne do uzycia szablony ankiet (ogolne oraz dla danego przedmiotu)
const getSurveyTemplates = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var returnObject = null;
    await mongoQuery.findQuery(client, mongoInfo, 'surveys',
        {
            isTemplate: true, "templateFor.type": "course", "templateFor.for":
                { $in: [null, data.course_id] }
        })
        .then(function (result) {
            if (result)
                returnObject = result;
        })
        .catch(function (error) {
            console.log(error);
        })
    client.close();
    return returnObject;
}

//Dodawanie ankiety
//Podzielone na czesc kiedy dodajemy ankiete z szablonem wiec wpisujemy tylko dane ankiety
//Oraz czesc kiedy oprocz danych ankiety dodajemy rowniez pytania z proponowanymi odpowiedziami
const addNewSurvey = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var returnObject = null;
    if (data.surveyId) {
        var newCourseSurvey = {
            surveyName: data.surveyName,
            surveyDescription: data.surveyDescription,
            courseInfo: data.courseSurvey,
            // lecturer: {
            //     firstName: data.lecturer.first_name,
            //     lastName: data.lecturer.last_name,
            //     id: data.lecturer.id
            // },
            surveyId: new ObjectId(data.surveyId),
            isOpen: data.isOpen,
            openDate: (data.openDate != "") ? new Date(data.openDate) : null,
            closeDate: (data.closeDate != "") ? new Date(data.closeDate) : null,
            allowComment: data.allowComment
        }
        await mongoQuery.insertQuery(client, mongoInfo, 'course_surveys', newCourseSurvey)
            .then(function (result) {
                returnObject = result;
            })
            .catch(function (error) {
                console.error(error);
            })
        return returnObject;
    }
    else if (!data.surveyId && data.survey) {
        var currentMaxSurveySortId = 0;
        await mongoQuery.findQuery(client, mongoInfo, 'surveys', null, { sort: { surveySortId: -1 }, limit: 1 })
            .then(function (result) {
                if (result ? (result.length > 0) : false) {
                    currentMaxSurveySortId = result[0].surveySortId;
                }
                else {
                    currentMaxSurveySortId = 0;
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        var newSurvey = {
            surveySortId: (currentMaxSurveySortId + 1),
            questions: data.survey.questions,
            isTemplate: data.survey.isTemplate,
            templateFor: data.survey.templateFor
        }
        var newSurveyId = null;
        await mongoQuery.insertQuery(client, mongoInfo, 'surveys', newSurvey)
            .then(function (result) {
                if (result.message == "OK") {
                    newSurveyId = result.inserted[0]._id;
                }
                returnObject = result;
            }).catch(function (error) {
                console.error(error);
            })
        if (returnObject ? returnObject.message != "OK" : true) {
            client.close();
            return returnObject;
        }
        var newCourseSurvey = {
            surveyName: data.surveyName,
            surveyDescription: data.surveyDescription,
            courseInfo: data.courseSurvey,
            surveyId: new ObjectId(newSurveyId),
            isOpen: data.isOpen,
            openDate: (data.openDate != "") ? new Date(data.openDate) : null,
            closeDate: (data.closeDate != "") ? new Date(data.closeDate) : null,
            allowComment: data.allowComment
        }
        await mongoQuery.insertQuery(client, mongoInfo, 'course_surveys', newCourseSurvey)
            .then(function (result) {
                returnObject = result;
            }).catch(function (error) {
                console.error(error);
            })
    }
    client.close();
    return returnObject;
};

//Aktualnie otwarte ankiety przedmiotow na ktore uczeszczano 
const getAvailableSurveys = async function (mongoInfo, token, userdata) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    let url = 'https://usosapps.umk.pl/services/courses/user';
    const oauth = OAuth({
        consumer: {
            key: process.env.OAUTH_CONSUMER_KEY,
            secret: process.env.OAUTH_CONSUMER_SECRET
        },
        signature_method: 'PLAINTEXT',
    });
    var returnObject = null;
    returnObject = await got(url, {
        headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.body);
                return { message: error.response.body };
            }
            else {
                console.error(error);
            }
        })
    var data = JSON.parse(returnObject.body);
    var currentCourses = null;
    var wholeYearTerm = userdata.term.slice(0, -1);
    if (data.course_editions[wholeYearTerm])
        currentCourses = data.course_editions[userdata.term].concat(data.course_editions[wholeYearTerm]);
    else
        currentCourses = data.course_editions[userdata.term];
    var currentCourseUnits = [];
    var surveys = [];

    if (currentCourses.length > 0) {
        currentCourses.forEach(course => {
            if (course.user_groups) {
                if (course.user_groups.length > 0) {
                    course.user_groups.forEach(userGroup => {
                        currentCourseUnits.push(userGroup.course_unit_id);
                        surveys.push({course_unit_id: userGroup.course_unit_id, lecturer: userGroup.lecturers[0]});
                    })
                }
            }

        })
    }
    //Sprawdzamy, ktore ankiety uzytkownik wczesniej wypelnil
    var alreadyFilledOut = [];
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys_users', { userId: userdata.id })
        .then(function (result) {
            if (result ? (result.length == 1) : false) {
                result[0].courseSurveyIds.forEach((element) => {
                    alreadyFilledOut.push(new ObjectId(element));
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    var availableSurveys = [];
    var currentDate = new Date();
    //Dodawana jest godzina, aby odzwierciedlic faktyczna godzine polskiej strefy czasowej
    currentDate.setHours(currentDate.getHours() + 1);
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys', {
        "courseInfo.courseUnitId": { $in: currentCourseUnits },
        isOpen: true, openDate: { $lte: currentDate }, closeDate: { $gte: currentDate }, "_id": { $nin: alreadyFilledOut }
    })
        .then(function (result) {
            if (result) {
                result.forEach(e => {
                    e.availableToFillOut = true;
                    var foundIndex = surveys.findIndex(element => element.course_unit_id == e.courseInfo.courseUnitId);
                    e.lecturer = surveys[foundIndex].lecturer;
                    availableSurveys.push(e);
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })

    client.close();
    return availableSurveys;
};

//Podstawowe dane ankiety, pytania i odpowiedzi
const getSurveyData = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var returnObject = null;
    await mongoQuery.findQuery(client, mongoInfo, 'surveys', { _id: new ObjectId(data.surveyId) })
        .then(function (result) {
            if (result)
                returnObject = result;
        })
        .catch(function (error) {
            console.log(error);
        })
    client.close();
    return returnObject;
}

//Wypelnianie ankiety - dodawanie odpowiedzi oraz wpisu ktora ankiete student wypelnil
const fillOutSurvey = async function (mongoInfo, userdata, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var returnObject = null;
    var input = {
        courseSurveyId: new ObjectId(data.refId),
        courseInfo: data.courseInfo,
        answers: data.answers,
        surveyComment: data.surveyComment
    }
    await mongoQuery.insertQuery(client, mongoInfo, 'course_surveys_answers', input)
        .then(function (result) {
            returnObject = result;
        }).catch(function (error) {
            console.error(error);
        })
    if (returnObject ? returnObject.message != "OK" : true) {
        client.close();
        return returnObject;
    }
    //Dodawanie wpisu o wypelnieniu ankiety przez studenta
    var userSurveysObject = null;
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys_users', { userId: userdata.id })
        .then(function (result) {
            if (result ? (result.length == 1) : false) {
                userSurveysObject = result[0];
                userSurveysObject.courseSurveyIds.push(new ObjectId(data.refId));
            }
            else {
                userSurveysObject = {
                    userId: userdata.id,
                    courseSurveyIds: [new ObjectId(data.refId)]
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    await mongoQuery.upsertQuery(client, mongoInfo, 'course_surveys_users', { userId: userdata.id }, userSurveysObject)
        .then(function (result) {
            returnObject = result;
            // console.log(result.message);
        }).catch(function (error) {
            console.error(error);
        })
    client.close();
    return returnObject;
}

//Ankiety ktore stworzono - dla pracownika
const getMySurveys = async function (mongoInfo, token, userdata) {
// //Część testowania
let url = 'https://usosapps.umk.pl/services/courses/user'
const oauth = OAuth({
    consumer: {
        key: process.env.OAUTH_CONSUMER_KEY,
        secret: process.env.OAUTH_CONSUMER_SECRET
    },
    signature_method: 'PLAINTEXT',
});
var returnObject = null;
returnObject = await got(url, {
    headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    searchParams: {
        fields: "course_editions",
    }
})
    .catch(function (error) {
        if (error.response) {
            console.log(error.response.body);
            return { message: error.response.body };
        }
        else {
            console.error(error);
        }
    })
var data = JSON.parse(returnObject.body);
var currentCourses = null;
var wholeYearTerm = userdata.term.slice(0, -1);
if (data.course_editions[wholeYearTerm])
    currentCourses = data.course_editions[userdata.term].concat(data.course_editions[wholeYearTerm]);
else
    currentCourses = data.course_editions[userdata.term];
currentCourseUnitsIds = [];

if (currentCourses.length > 0) {
    currentCourses.forEach(course => {
        if (course.user_groups) {
            if (course.user_groups.length > 0) {
                course.user_groups.forEach(userGroup => {
                    currentCourseUnitsIds.push(userGroup.course_unit_id);
                })
            }
        }

    })
}
//////////////

//Część faktyczna
    // let url = 'https://usosapps.umk.pl/services/users/user';
    // const oauth = OAuth({
    //     consumer: {
    //         key: process.env.OAUTH_CONSUMER_KEY,
    //         secret: process.env.OAUTH_CONSUMER_SECRET
    //     },
    //     signature_method: 'PLAINTEXT',
    // });
    // var returnObject = null;
    // returnObject = await got(url, {
    //     headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    //     searchParams: {
    //         fields: "course_editions_conducted",
    //     }
    // })
    //     .catch(function (error) {
    //         if (error.response) {
    //             console.log(error.response.body);
    //             return { message: error.response.body };
    //         }
    //         else {
    //             console.error(error);
    //         }
    //     });
    // var data = JSON.parse(returnObject.body);
    // data = data.course_editions_conducted;
    // console.log(data);
    // var currentCourses = null;
    // var wholeYearTerm = userdata.term.slice(0, -1);
    // // data = data.filter(course => (course.term.id == userdata.term) || (course.term.id == wholeYearTerm));
    // var currentCourseEditions = [];
    // data.forEach(courseEdition => {
    //     currentCourseEditions.push({courseId: courseEdition.course.id, termId: courseEdition.term.id});
    // });

    // var currentCourseUnitsIds = [];
    // currentCourseEditions.forEach(async function (currentCourseEdition) {
    //     url = 'https://usosapps.umk.pl/services/courses/course_edition';
    //     returnObject = null;
    //     returnObject = await got(url, {
    //         headers: oauth.toHeader(oauth.authorize({ url: url, method: 'POST' }, token)),
    //         searchParams: {
    //             course_id: currentCourseEdition.courseId,
    //             term_id: currentCourseEdition.termId,
    //             fields: "course_id|course_name|term_id|user_groups|course_units_ids",
    //         }
    //     })
    //         .catch(function (error) {
    //             if (error.response) {
    //                 console.log(error.response.body);
    //                 return { message: error.response.body };
    //             }
    //             else {
    //                 console.error(error);
    //             }
    //         });
    //     var courseData = JSON.parse(returnObject.body);
    //     courseData.course_units_ids.forEach(cui => {
    //         currentCourseUnitsIds.push(cui);
    //     })
        
    // });
//////////////





    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var mySurveys = [];
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys', { "courseInfo.courseUnitId": { $in : currentCourseUnitsIds} })
        .then(function (result) {
            mySurveys = result;
        })
        .catch(function (error) {
            console.log(error);
        })
    client.close();
    return mySurveys;
};

//Pobieranie danych o ankiecie - wlacznie z odpowiedziami na podstawie ktorych moga byc wyswietlane statystyki
const getMySurveyData = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var mySurvey = null;
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys', { _id: new ObjectId(data._id) })
        .then(function (result) {
            mySurvey = result[0];
        })
        .catch(function (error) {
            console.log(error);
        })
    await mongoQuery.findQuery(client, mongoInfo, 'surveys', { _id: new ObjectId(mySurvey.surveyId) })
        .then(function (result) {
            mySurvey.questions = result[0].questions;
        })
        .catch(function (error) {
            console.log(error);
        })
    mySurvey.surveyAnswers = [];
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys_answers', { courseSurveyId: new ObjectId(data._id) })
        .then(function (result) {
            if (result) {
                result.forEach((element) => {
                    mySurvey.surveyAnswers.push({ answers: element.answers, surveyComment: element.surveyComment,
                         lecturer: element.courseInfo.lecturer });
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    client.close()
    return mySurvey;
};

//Aktualizacja ankiety - sluzaca do zamkniecia/otwarcia oraz wyznaczenia terminow kiedy ankieta jest otwarta
const updateMySurveyData = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var returnObject = null;
    await mongoQuery.updateQuery(client, mongoInfo, 'course_surveys', { _id: new ObjectId(data._id) },
        { isOpen: data.isOpen, openDate: (data.openDate != "") ? new Date(data.openDate) : null, closeDate: (data.closeDate != "") ? new Date(data.closeDate) : null })
        .then(function (result) {
            returnObject = result;
        }).catch(function (error) {
            console.error(error);
        })
    client.close();
    return returnObject;
};


//Pobieranie danych o ankietach z najlepszymi wynikami
const getMyBestSurveys = async function (mongoInfo, data) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    var mySurvey = null;
    await mongoQuery.aggregateQuery(client, mongoInfo, 'course_surveys', { _id: new ObjectId(data._id) })
        .then(function (result) {
            mySurvey = result[0];
        })
        .catch(function (error) {
            console.log(error);
        })
    await mongoQuery.findQuery(client, mongoInfo, 'surveys', { _id: new ObjectId(mySurvey.surveyId) })
        .then(function (result) {
            mySurvey.questions = result[0].questions;
        })
        .catch(function (error) {
            console.log(error);
        })
    mySurvey.surveyAnswers = [];
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys_answers', { courseSurveyId: new ObjectId(data._id) })
        .then(function (result) {
            if (result) {
                result.forEach((element) => {
                    mySurvey.surveyAnswers.push({ answers: element.answers, surveyComment: element.surveyComment,
                         lecturer: element.courseInfo.lecturer });
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    client.close()
    return mySurvey;
};


module.exports = {
    getCoursesAvailableToSurvey: getCoursesAvailableToSurvey,
    getSurveyTemplates: getSurveyTemplates,
    addNewSurvey: addNewSurvey,
    getAvailableSurveys: getAvailableSurveys,
    getSurveyData: getSurveyData,
    fillOutSurvey: fillOutSurvey,
    getMySurveys: getMySurveys,
    getMySurveyData: getMySurveyData,
    updateMySurveyData: updateMySurveyData
};