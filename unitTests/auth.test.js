const app = require("../server");
const request = require("supertest");
const mongoosse = require("mongoose");
const User = require("../models/user_model");
const { JsonWebTokenError } = require("jsonwebtoken");

const email = "test@test.com";
const pwd = "123456";
let accessToken = ''
let refreshToken = ''
let newAccessToken = ''
let newRefreshToken = ''

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

beforeAll((done) => { 
  User.remove({ email: email }, (err) => {
    done();
  });
});

afterAll((done) => {
  User.remove({ email: email }, (err) => {
    mongoosse.connection.close();
    done();
  });
});

describe("Testing Auth API", () => {

  test("Add a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      'email': email,
      'password': pwd,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("Login User", async () => {
    const response = await request(app).post("/auth/login").send({
      'email': email,
      'password': pwd,
    });
    expect(response.statusCode).toEqual(200);
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
    expect(accessToken).not.toEqual(null)
    expect(refreshToken).not.toEqual(null)
  });
  
  test('Authorized access', async () => {
    const response = await request(app).get('/task')
    .set({authorization : 'JWT ' + accessToken})
    expect(response.statusCode).toEqual(200)
  })

  test('UnAuthorized access', async () => {
    wrongToken = accessToken.replaceAt(10, accessToken[10] + 1)
    const response = await request(app).get('/task')
    .set({authorization : 'JWT ' + wrongToken})
    expect(response.statusCode).not.toEqual(200)
  })
  
  // jest.setTimeout(30000)
  // test('Timeout access', async () => {
  //   await new Promise(r => setTimeout(r, 3*1000 ))
  //   const response = await request(app).get('/task')
  //   .set({authorization : 'JWT ' + accessToken})
  //   expect(response.statusCode).not.toEqual(200)
  // })

  test('Refresh Token', async () => {
    const response = await request(app).post('/auth/refreshToken')
    .set({authorization : 'JWT ' + refreshToken})
    newAccessToken = response.body.accessToken
    newRefreshToken = response.body.refreshToken
    expect(newAccessToken).not.toEqual(null)
    expect(newRefreshToken).not.toEqual(null)
  })
});
