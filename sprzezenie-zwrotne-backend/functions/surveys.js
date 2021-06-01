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
    let returnObject = null;
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
    const data = JSON.parse(returnObject.body);
    let currentCourses = null;
    const wholeYearTerm = userdata.term.slice(0, -1);
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
    // let returnObject = null;
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
    // let data = JSON.parse(returnObject.body);
    // data = data.course_editions_conducted;
    // console.log(data);
    // const wholeYearTerm = userdata.term.slice(0, -1);
    // // data = data.filter(course => (course.term.id == userdata.term) || (course.term.id == wholeYearTerm));
    // const currentCourseEditions = [];
    // data.forEach(courseEdition => {
    //     currentCourseEditions.push({courseId: courseEdition.course.id, termId: courseEdition.term.id});
    // });

    // const currentCourseUnitsIds = [];
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
    //     let courseData = JSON.parse(returnObject.body);
    //     courseData.course_units_ids.forEach(cui => {
    //         currentCourseUnitsIds.push(cui);
    //     })
        
    // });
/////////////


    let pipeSeparatedUnitIds = "";
    currentCourseUnitsIds.forEach((element, index) => {
        if(index>0)
            pipeSeparatedUnitIds += "|";
        pipeSeparatedUnitIds += element;
    })
    const returnCourses = [];
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
            const returnCoursesBeforeProcessing = JSON.parse(returnObject.body);
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
    let returnObject = null;
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
    let returnObject = null;
    if (data.surveyId) {
        let newCourseSurvey = {
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
        let currentMaxSurveySortId = 0;
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
        let newSurvey = {
            surveySortId: (currentMaxSurveySortId + 1),
            questions: data.survey.questions,
            isTemplate: data.survey.isTemplate,
            templateFor: data.survey.templateFor
        }
        let newSurveyId = null;
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
        let newCourseSurvey = {
            surveyName: data.surveyName,
            surveyDescription: data.surveyDescription,
            courseInfo: data.courseSurvey,
            surveyId: new ObjectId(newSurveyId),
            isOpen: data.isOpen,
            openDate: (data.openDate != "") ? new Date(data.openDate) : null,
            closeDate: (data.closeDate != "") ? new Date(data.closeDate) : null,
            allowComment: data.allowComment,
            graded: false
        }
        data.survey.questions.forEach(question => {
            if(question.graded){
                newCourseSurvey.graded = true;
            }
        })
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
    let returnObject = null;
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
    const data = JSON.parse(returnObject.body);
    let currentCourses = null;
    const wholeYearTerm = userdata.term.slice(0, -1);
    if (data.course_editions[wholeYearTerm])
        currentCourses = data.course_editions[userdata.term].concat(data.course_editions[wholeYearTerm]);
    else
        currentCourses = data.course_editions[userdata.term];
    const currentCourseUnits = [];
    const surveys = [];

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
    const alreadyFilledOut = [];
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
    const availableSurveys = [];
    let currentDate = new Date();
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
                    let foundIndex = surveys.findIndex(element => element.course_unit_id == e.courseInfo.courseUnitId);
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
    let returnObject = null;
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
    let returnObject = null;
    let input = {
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
    let userSurveysObject = null;
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
let returnObject = null;
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
const data = JSON.parse(returnObject.body);
let currentCourses = null;
const wholeYearTerm = userdata.term.slice(0, -1);
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
    // let returnObject = null;
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
    // let data = JSON.parse(returnObject.body);
    // data = data.course_editions_conducted;
    // console.log(data);
    // let currentCourses = null;
    // const wholeYearTerm = userdata.term.slice(0, -1);
    // // data = data.filter(course => (course.term.id == userdata.term) || (course.term.id == wholeYearTerm));
    // const currentCourseEditions = [];
    // data.forEach(courseEdition => {
    //     currentCourseEditions.push({courseId: courseEdition.course.id, termId: courseEdition.term.id});
    // });

    // const currentCourseUnitsIds = [];
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
    //     const courseData = JSON.parse(returnObject.body);
    //     courseData.course_units_ids.forEach(cui => {
    //         currentCourseUnitsIds.push(cui);
    //     })
        
    // });
//////////////





    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });
    let mySurveys = [];
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
    let mySurvey = null;
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
    let returnObject = null;
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
const getMyBestSurveys = async function (mongoInfo, token, userdata) {
    const client = await MongoClient.connect(mongoInfo.url, { useUnifiedTopology: true });


    // //Część testowania
let url = 'https://usosapps.umk.pl/services/courses/user'
const oauth = OAuth({
    consumer: {
        key: process.env.OAUTH_CONSUMER_KEY,
        secret: process.env.OAUTH_CONSUMER_SECRET
    },
    signature_method: 'PLAINTEXT',
});
let returnObject = null;
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
const data = JSON.parse(returnObject.body);
let currentCourses = null;
const wholeYearTerm = userdata.term.slice(0, -1);
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
    // let returnObject = null;
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
    // let data = JSON.parse(returnObject.body);
    // data = data.course_editions_conducted;
    // console.log(data);
    // let currentCourses = null;
    // const wholeYearTerm = userdata.term.slice(0, -1);
    // // data = data.filter(course => (course.term.id == userdata.term) || (course.term.id == wholeYearTerm));
    // const currentCourseEditions = [];
    // data.forEach(courseEdition => {
    //     currentCourseEditions.push({courseId: courseEdition.course.id, termId: courseEdition.term.id});
    // });

    // const currentCourseUnitsIds = [];
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
    //     const courseData = JSON.parse(returnObject.body);
    //     courseData.course_units_ids.forEach(cui => {
    //         currentCourseUnitsIds.push(cui);
    //     })
        
    // });
//////////////















    let mySurveys = null;
    await mongoQuery.findQuery(client, mongoInfo, 'course_surveys', { graded: true, "courseInfo.courseUnitId": { $in : currentCourseUnitsIds}})
        .then(function (result) {
            mySurveys = result;
        })
        .catch(function (error) {
            console.log(error);
        })
    for(let i = 0; i < mySurveys.length; i++){
        await mongoQuery.findQuery(client, mongoInfo, 'surveys', { _id: new ObjectId(mySurveys[i].surveyId) })
        .then(function (result) {
            mySurveys[i].questions = result[0].questions;
        })
        .catch(function (error) {
            console.log(error);
        })

        mySurveys[i].surveyAnswers = [];
        await mongoQuery.findQuery(client, mongoInfo, 'course_surveys_answers', { courseSurveyId: new ObjectId(mySurveys[i]._id) })
        .then(function (result) {
            if (result) {
                result.forEach((element) => {
                    mySurveys[i].surveyAnswers.push({ answers: element.answers, surveyComment: element.surveyComment,
                         lecturer: element.courseInfo.lecturer });
                })
            }
        })
        .catch(function (error) {
            console.log(error);
        })
        //console.log(mySurveys[i].surveyAnswers);
    }
    
    let answeredIndex = -1;
    for(let i = 0; i < mySurveys.length; i++){
        mySurveys[i].countedGrade = 0;
        mySurveys[i].timesAnswered = 0;
        mySurveys[i].maxGrade = 0;
        for(let questionIndex = 0; questionIndex < mySurveys[i].questions.length; questionIndex++){
            if(mySurveys[i].questions[questionIndex].graded){
                if(mySurveys[i].questions[questionIndex].questionType == "Radio") mySurveys[i].maxGrade += mySurveys[i].questions[questionIndex].maxGrade;
                mySurveys[i].surveyAnswers.forEach(surveyAnswer => {
                    if(questionIndex == 0){
                        mySurveys[i].timesAnswered++;
                    }
                    if(mySurveys[i].questions[questionIndex].questionType == "Radio"){
                        answeredIndex = parseInt(surveyAnswer.answers[questionIndex]);
                        mySurveys[i].countedGrade += mySurveys[i].questions[questionIndex].answers[answeredIndex].grade // Tak mozna sie dostac do punktacji odpowiedzi
                        if(mySurveys[i].questions[questionIndex].timesAnswered === undefined)   mySurveys[i].questions[questionIndex].timesAnswered = 0;
                        mySurveys[i].questions[questionIndex].timesAnswered++;
                        if(mySurveys[i].questions[questionIndex].countedGrade === undefined)   mySurveys[i].questions[questionIndex].countedGrade = 0
                        mySurveys[i].questions[questionIndex].countedGrade += mySurveys[i].questions[questionIndex].answers[answeredIndex].grade;
                    }
                    else if(mySurveys[i].questions[questionIndex].questionType == "Checkbox"){
                        //mySurveys[i].countedGrade += mySurveys[i].questions[questionIndex].answers[answeredIndex].grade // Tak mozna sie dostac do punktacji odpowiedzi
                        mySurveys[i].questions[questionIndex].timesAnswered = mySurveys[i].timesAnswered;
                        if(mySurveys[i].questions[questionIndex].countedGrade === undefined)   mySurveys[i].questions[questionIndex].countedGrade = 0
                        mySurveys[i].questions[questionIndex].maxGrade = 0;
                        surveyAnswer.answers[questionIndex].forEach((ans) => {
                            mySurveys[i].questions[questionIndex].maxGrade += mySurveys[i].questions[questionIndex].answers[answeredIndex].grade;
                            if(ans == true){
                                //mySurveys[i].questions[questionIndex].timesAnswered++;
                                mySurveys[i].questions[questionIndex].countedGrade += mySurveys[i].questions[questionIndex].answers[answeredIndex].grade;
                            }
                        })
                    }
                })
            }
        }
        mySurveys[i].overallGrade = mySurveys[i].countedGrade / (mySurveys[i].maxGrade * mySurveys[i].timesAnswered);
    }
    mySurveys.sort((a, b) => (a.overallGrade > b.overallGrade) ? -1 : 1);
    client.close()
    const retObject = {
        best: mySurveys.slice(0,3), 
        worst: []
    }
    if(mySurveys.length === 3){
        retObject.worst = [];
    }
    else if(mySurveys.length === 4){
        retObject.worst = mySurveys.slice(mySurveys.length-1,mySurveys.length);
    }
    else if(mySurveys.length === 5){
        retObject.worst = mySurveys.slice(mySurveys.length-2,mySurveys.length);
    }
    else{
        retObject.worst = mySurveys.slice(mySurveys.length-3,mySurveys.length);
    }
    return retObject;
};

//Funkcja pobierajaca szczegoly przedmiotu
const getCourseDetails = async function(token, data) {
    let url = 'https://usosapps.umk.pl/services/courses/course'
    const oauth = OAuth({
        consumer: {
            key: process.env.OAUTH_CONSUMER_KEY,
            secret: process.env.OAUTH_CONSUMER_SECRET
        },
        signature_method: 'PLAINTEXT',
    });
    try {
        const returnObject = await got.post(url, {
            headers: oauth.toHeader(oauth.authorize({url: url, method: 'POST'}, token)),
            searchParams:{
                course_id: data,
                fields: "id|name|homepage_url|profile_url|terms|description|assessment_criteria|learning_outcomes|practical_placement|attributes2",
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
    getCoursesAvailableToSurvey: getCoursesAvailableToSurvey,
    getSurveyTemplates: getSurveyTemplates,
    addNewSurvey: addNewSurvey,
    getAvailableSurveys: getAvailableSurveys,
    getSurveyData: getSurveyData,
    fillOutSurvey: fillOutSurvey,
    getMySurveys: getMySurveys,
    getMySurveyData: getMySurveyData,
    updateMySurveyData: updateMySurveyData,
    getCourseDetails: getCourseDetails,
    getMyBestSurveys: getMyBestSurveys
};