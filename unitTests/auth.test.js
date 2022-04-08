const app = require("../server");
const request = require("supertest");
const mongoosse = require("mongoose");
const { response } = require("../server");
const User = require("../models/user_model");

const email = "test@test.com";
const pwd = "123456";

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
  test("test registration", async () => {
    const response = await request(app).post("/auth/register").send({
      email: email,
      password: pwd,
    });
    expect(response.statusCode).toEqual(200);
  });

  test("test login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: email,
      password: pwd,
    });
    expect(response.statusCode).toEqual(200);
  });
});
