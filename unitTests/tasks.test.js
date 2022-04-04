const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const { response } = require('../server')

beforeAll(done => {
    done()
})

afterAll(done => {
    mongoose.connection.close()
    done()
})


describe('Testing Task API', () => {
    const taskMessage = 'This is my test tasks!'
    const taskAmount = 150

    test('Task GET', async () => {
        const response = await request(app).get('/task')
        expect(response.statusCode).toEqual(200)
    })
    test('Add new task', async () => {
        const response = await request(app).post('/task').send({
            'message': taskMessage,
            'amount': taskAmount
        })
        expect(response.statusCode).toEqual(200)
        const newTask = response.body.task
        expect(newTask.message).toEqual(taskMessage)
        expect(newTask.amount).toEqual(taskAmount)
        
        const response2 = await request(app).get('/task/' + newTask._id)
        expect(response2.statusCode).toEqual(200)
        const task2 = response2.body

        expect(task2.message).toEqual(taskMessage)
        expect(task2.amount).toEqual(taskAmount)
    })
})