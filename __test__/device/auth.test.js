/**
 * auth.test.js
 * @description :: contains test cases of APIs for authentication module.
 */

const dotenv = require('dotenv');
dotenv.config();
process.env.NODE_ENV = 'test';
const db = require('mongoose');
const request = require('supertest');
const { MongoClient } = require('mongodb');
const app = require('../../app');
const authConstant = require('../../constants/authConstant');
const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

/**
 * @description : model dependencies resolver
 */
beforeAll(async function (){
  try {
    await client.connect();
    const dbInstance = client.db('Dhiwise_test');

  }
  catch (error) {
    console.error(`we encountered ${error}`);
  }
  finally {
    client.close();
  }
});

// test cases

describe('POST /register -> if email and username is given', () => {
  test('should register a USERS', async () => {
    let registeredUser = await request(app)
      .post('/device/auth/register')
      .send({
        'username':'Janick.Parisian2',
        'password':'_Sj2sncGDxOr_86',
        'email':'Eliza.Jast@hotmail.com',
        'contact_info':'Comoros',
        'type':'Bacon',
        'verifed':true,
        'userType':authConstant.USER_TYPES.User,
        'Latitude':'SDD',
        'Longitude':'withdrawal',
        'CommissionRate':859,
        'DiscountRate':564,
        'DiscountUntil':'2024-05-10T18:41:24.244Z',
        'mobileNo':'(873) 834-8109',
        'ssoAuth':{
          'googleId':'Orchestrator',
          'facebookId':'Gabon'
        }
      });
    expect(registeredUser.statusCode).toBe(200);
    expect(registeredUser.body.status).toBe('SUCCESS');
    expect(registeredUser.body.data).toMatchObject({ id: expect.any(String) });
  });
});

describe('POST /login -> if username and password is correct', () => {
  test('should return USERS with authentication token', async () => {
    let USERS = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Janick.Parisian2',
          password: '_Sj2sncGDxOr_86'
        }
      );
    expect(USERS.statusCode).toBe(200);
    expect(USERS.body.status).toBe('SUCCESS');
    expect(USERS.body.data).toMatchObject({
      id: expect.any(String),
      token: expect.any(String)
    }); 
  });
});

describe('POST /login -> if username is incorrect', () => {
  test('should return unauthorized status and USERS not exists', async () => {
    let USERS = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'wrong.username',
          password: '_Sj2sncGDxOr_86'
        }
      );

    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /login -> if password is incorrect', () => {
  test('should return unauthorized status and incorrect password', async () => {
    let USERS = await request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Janick.Parisian2',
          password: 'wrong@password'
        }
      );

    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /login -> if username or password is empty string or has not passed in body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let USERS = await request(app)
      .post('/device/auth/login')
      .send({});

    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email has not passed from request body', () => {
  test('should return bad request status and insufficient parameters', async () => {
    let USERS = await request(app)
      .post('/device/auth/forgot-password')
      .send({ email: '' });

    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('POST /forgot-password -> if email passed from request body is not available in database ', () => {
  test('should return record not found status', async () => {
    let USERS = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email': 'unavailable.email@hotmail.com', });

    expect(USERS.statusCode).toBe(404);
    expect(USERS.body.status).toBe('RECORD_NOT_FOUND');
  });
});

describe('POST /forgot-password -> if email passed from request body is valid and OTP sent successfully', () => {
  test('should return success message', async () => {
    let USERS = await request(app)
      .post('/device/auth/forgot-password')
      .send({ 'email':'Eliza.Jast@hotmail.com', });

    expect(USERS.statusCode).toBe(200);
    expect(USERS.body.status).toBe('SUCCESS');
  });
});

describe('POST /validate-otp -> OTP is sent in request body and OTP is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Janick.Parisian2',
          password: '_Sj2sncGDxOr_86'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/USERS/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .post('/device/auth/validate-otp')
              .send({ 'otp': foundUser.body.data.resetPasswordLink.code, }).then(USERS => {
                expect(USERS.statusCode).toBe(200);
                expect(USERS.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('POST /validate-otp -> if OTP is incorrect or OTP has expired', () => {
  test('should return invalid OTP', async () => {
    let USERS = await request(app)
      .post('/device/auth/validate-otp')
      .send({ 'otp': '12334' });
    
    expect(USERS.statusCode).toBe(200);
    expect(USERS.body.status).toBe('FAILURE');
    
  });
});

describe('POST /validate-otp -> if request body is empty or OTP has not been sent in body', () => {
  test('should return insufficient parameter', async () => {
    let USERS = await request(app)
      .post('/device/auth/validate-otp')
      .send({});

    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> code is sent in request body and code is correct', () => {
  test('should return success', () => {
    return request(app)
      .post('/device/auth/login')
      .send(
        {
          username: 'Janick.Parisian2',
          password: '_Sj2sncGDxOr_86'
        }).then(login => () => {
        return request(app)
          .get(`/device/api/v1/USERS/${login.body.data.id}`)
          .set({
            Accept: 'application/json',
            Authorization: `Bearer ${login.body.data.token}`
          }).then(foundUser => {
            return request(app)
              .put('/device/auth/validate-otp')
              .send({
                'code': foundUser.body.data.resetPasswordLink.code,
                'newPassword':'newPassword'
              }).then(USERS => {
                expect(USERS.statusCode).toBe(200);
                expect(USERS.body.status).toBe('SUCCESS');
              });
          });
      });
  });
});

describe('PUT /reset-password -> if request body is empty or code/newPassword is not given', () => {
  test('should return insufficient parameter', async () => {
    let USERS = await request(app)
      .put('/device/auth/reset-password')
      .send({});
    
    expect(USERS.statusCode).toBe(400);
    expect(USERS.body.status).toBe('BAD_REQUEST');
  });
});

describe('PUT /reset-password -> if code is invalid', () => {
  test('should return invalid code', async () => {
    let USERS = await request(app)
      .put('/device/auth/reset-password')
      .send({
        'code': '123',
        'newPassword': 'testPassword'
      });

    expect(USERS.statusCode).toBe(200);
    expect(USERS.body.status).toBe('FAILURE');

  });
});

afterAll(function (done) {
  db.connection.db.dropDatabase(function () {
    db.connection.close(function () {
      done();
    });
  });
});
