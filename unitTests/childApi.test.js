const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const { response } = require("../server");

const Child = require("../models/child_model");

const email = "child@gmail.com";
const pwd = "54321";
const balance = 400;
const id = 3065465;

const desc = "Purim Gift!";
let accessToken = "";
let userId = "";
const amount = 30;

beforeAll((done) => {
  Child.remove({ email: email }, (err) => {
    done();
  });
});

afterAll((done) => {
  Child.remove({ email: email }, (err) => {
    mongoose.connection.close();
    done();
  });
});

describe("Testing Child's API", () => {
  test("Test Child Registration", async () => {
    const response = await request(app).post("/auth/register").send({
      email: email,
      password: pwd,
      balance: balance,
      _id: id,
    });
    expect(response.statusCode).toEqual(200);
    userId = response.body._id;
  });

  test("Test Child login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: email,
      password: pwd,
    });
    expect(response.statusCode).toEqual(200);
    accessToken = response.body.accessToken;
  });

  test("Add new transaction", async () => {
    const response = await request(app)
      .post("/child/transactions")
      .set({ authorization: "JWT " + accessToken })
      .send({
        amount: amount,
        description: desc,
      });

    expect(response.statusCode).toEqual(200);

    const newTransaction = response.body.trans;
    expect(newTransaction.description).toEqual(desc);
    expect(newTransaction.amount).toEqual(amount);
  });
  test("GET transactions", async () => {
    const response = await request(app)
      .get("/child/transactions")
      .set({ authorization: "JWT " + accessToken });
    expect(response.statusCode).toEqual(200);
  });

  test("GET blance", async () => {
    const response = await request(app)
      .get("/child/balance")
      .set({ authorization: "JWT " + accessToken });
    expect(response.statusCode).toEqual(200);
  });

  test("POST updateBlance", async () => {
    const response = await request(app)
      .post("/child/balance")
      .set({ authorization: "JWT " + accessToken })
      .send({
        balance: balance,
      });
    expect(response.statusCode).toEqual(200);

    const resBalance = response.body.balance;
    expect(resBalance).toEqual(balance);
  });
});
