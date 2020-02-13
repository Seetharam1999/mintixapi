import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from './../src/main';

chai.use(chaiHttp);
const expect = chai.expect;
let token, apartId, siteId, blockId;

// test cases in progress

it('Server test', () => {
    return chai.request(app).get('/')
        .then(res => {
            expect(res.status).to.equal(200);
        });
});

it('should login a user', () => {
    return chai.request(app).post('/session/login')
        .send({username : "ofs", password : "password", "pushToken": "a", "deviceId": "a"})
        .then(res => {
            token = res.body.refreshToken;
            apartId = Number(res.body["address"]["apart_id"]);
            siteId = Number(res.body["address"]["site_id"]);
            blockId = Number(res.body["address"]["block_id"]);
            expect(res.status).to.equal(200);
        });
});

it('Should display dashbord data', () => {
    return chai.request(app).post('/dashboard')
        .send({'apart_id': apartId, "site_id": siteId, "block_id": blockId, "from_date": "2018-01-01", "to_date": "2019-01-01"})
        .set("token", token)
        .then(res => {
            expect(res.status).to.equal(200);
            expect(res.type).to.eql('application/json');
        });
});

it('Should display billing history', () => {
    return chai.request(app).post('/billing')
        .send({'apart_id': apartId, "site_id": siteId})
        .set("token", token)
        .then(res => {
            expect(res.status).to.equal(200);
            expect(res.type).to.eql('application/json');
        });
});

it('Should set alarms', () => {
    return chai.request(app).post('/alarms')
        .send({'apart_id': apartId})
        .set("token", token)
        .then(res => {
            expect(res.status).to.equal(200);
            expect(res.type).to.eql('application/json');
        });
});

it('Should dispatch refresh token', () => {
    return chai.request(app).post('/session/refresh')
        .send({'refreshToken': token})
        .then(res => {
            expect(res.status).to.equal(200);
            expect(res.type).to.eql('application/json');
        });
});

it('Should logout the user', () => {
    return chai.request(app).post('/session/logout')
        .send({'refreshToken': token})
        .then(res => {
            expect(res.status).to.equal(200);
            expect(res.type).to.eql('application/json');
        });
});

it('should not login because of incorrect password', () => {
    return chai.request(app).post('/session/login')
        .send({username : "ofs", password : "password1", "pushToken": "a", "deviceId": "a"})
        .then(res => {
            expect(res.status).to.equal(401);
        });
});

it('should not login because of user not found', () => {
    return chai.request(app).post('/session/login')
        .send({username : "random", password : "password", "pushToken": "a", "deviceId": "a"})
        .then(res => {
            expect(res.status).to.equal(400);
        });
});

it('should not refresh token because of invalidated token', () => {
    return chai.request(app).post('/session/refresh')
        .send({'refreshToken': "sdasdasdas"})
        .then(res => {
            expect(res.status).to.equal(400);
        });
});

