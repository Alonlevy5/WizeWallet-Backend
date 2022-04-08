const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { response } = require("../server");

const User = require("../models/user_model");

const email = "test@test.com";
const pwd = "123456";

beforeAll((done) => {
  User.remove({ 'email': email }, (err) => {
    done();
  });
});

afterAll((done) => {
  User.remove({ 'email': email }, (err) => {
    mongoose.connection.close();
    done();
  });
});

describe("Testing Task API", () => {
  const taskMessage = "This is my test task!";
  const taskAmount = 150;

  const sender = "Maor";
  let accessToken = "";
  let userId = "";

  test("test registration", async () => {
    const response = await request(app).post("/auth/register").send({
      'email': email,
      'password': pwd,
    });
    expect(response.statusCode).toEqual(200);
    userId = response.body._id; 
  });

  test("test login", async () => {
    const response = await request(app).post("/auth/login").send({
      'email': email,
      'password': pwd,
    });
    expect(response.statusCode).toEqual(200);
    accessToken = response.body.accessToken;
  });

  test("Task GET", async () => {
    const response = await request(app)
      .get("/task")
      .set({ authorization: "JWT " + accessToken });
    expect(response.statusCode).toEqual(200);
  });

  test("Add new task", async () => {
    const response = await request(app)
      .post("/task")
      .set({ authorization: "JWT " + accessToken })
      .send({
        message: taskMessage,
        amount: taskAmount,
      });

    expect(response.statusCode).toEqual(200);
    const newTask = response.body.task;

    expect(newTask.message).toEqual(taskMessage);
    expect(newTask.amount).toEqual(taskAmount);

    const response2 = await request(app)
      .get("/task/" + newTask._id)
      .set({ authorization: "JWT " + accessToken });

    expect(response2.statusCode).toEqual(200);
    const task2 = response2.body;

    expect(task2.message).toEqual(taskMessage);
    expect(task2.amount).toEqual(taskAmount);
  });
});
