const app = require("../server");
const request = require("supertest");
const mongoosse = require("mongoose");
const User = require("../models/user_model");

const email = "test@test.com";
const pwd = "123456";
let accessToken = ''
let refreshToken = ''

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
});
