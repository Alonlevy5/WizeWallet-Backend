const express = require("express");
const router = express.Router();

const Task = require("../controllers/task");
const authenticate = require("../common/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Task Api
 *   description: The Task API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - kidid
 *         - message
 *         - amount
 *         - sender
 *         - isCompleted
 *       properties:
 *         kidid:
 *           type: number
 *           description: Refrence to kid REAL ID!
 *         message:
 *           type: string
 *           description: The task's text.
 *         amount:
 *           type: number
 *           description: The amount you get for the given task.
 *         sender:
 *           type: string
 *           description: The Parrent ID
 *         isCompleted:
 *           type: boolean
 *           description: Is the task completed
 *       example:
 *         kidid: 123456
 *         message: 'Do your homework'
 *         amount: 150
 *         sender: 'Parrent ID'
 *         isCompleted: true
 */

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task Api]
 *     responses:
 *       200:
 *         description: The task list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", authenticate, Task.getTasks);

/**
 * @swagger
 * /task/kid:
 *   get:
 *     summary: Get task by KID ID
 *     tags: [Task Api]
 *     responses:
 *       200:
 *         description: The task list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/kid", authenticate, Task.getTasksBykidId);

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Add new task
 *     tags: [Task Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The new task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post("/", authenticate, Task.addTasks);



module.exports = router;
