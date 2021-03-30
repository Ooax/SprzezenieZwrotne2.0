process.env.NODE_ENV = 'test';

const chai = require('chai');
const request = require('supertest');
const app = require('../app.js');



describe('/GET /getUserInfo', () => {
    it('Should GET the userData object from session', (done) => {
        request(app)
            .get('/getUserInfo')
            .expect('Content-Type', /json/)
            .expect(200, {
                id: null,
                first_name: null,
                middle_names: null,
                last_name: null,
                sex: null,
                student_status: null,
                staff_status: null,
                term: null
            }, done)
    });
});


describe('/POST /surveys/getSurveyTemplates', () => {
    it('Should get 403: "Not logged in" because of no authentication', (done) => {
        let data = {
            course_id: "test",
        }
        request(app)
            .post('/surveys/getSurveyTemplates')
            .send(data)
            .expect(403)
            .expect('Not logged in', done)
        });  
})

describe('/GET /usosSurveys/getUsosSurveysToFill', () => {
    it('Should get 403: "Not logged in" because of no authentication', (done) => {
        request(app)
            .get('/usosSurveys/getUsosSurveysToFill')
            .expect(403)
            .expect('Not logged in', done)
        });  
})

