const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { response } = require("../server");

const Parent = require("../models/parent_model");

const email = "test@test.com";
const pwd = "123456";
const balance = 0;
const _id = 2059821;

beforeAll((done) => {
  Parent.remove({ 'email': email }, (err) => {
    done();
  });
});

afterAll((done) => {
  Parent.remove({ 'email': email }, (err) => {
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
  const kid = 1234568

  test("Test Parent Registration", async () => {
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
        kidid: kid,
        message: taskMessage,
        amount: taskAmount,
      });

    expect(response.statusCode).toEqual(200);
    const newTask = response.body.task;

    expect(newTask.message).toEqual(taskMessage);
    expect(newTask.amount).toEqual(taskAmount);
    expect(newTask.kidid).toEqual(kid);
    const response2 = await request(app)
      .get("/task/kid" )
      .set({ authorization: "JWT " + accessToken });

    expect(response2.statusCode).toEqual(200);
    const task2 = response2.body;

    expect(task2.message).toEqual(taskMessage);
    expect(task2.amount).toEqual(taskAmount);
  });
});
