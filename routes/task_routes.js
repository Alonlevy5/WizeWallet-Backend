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
 *         - message
 *         - amount
 *         - sender
 *       properties:
 *         message:
 *           type: string
 *           description: The task's text.
 *         amount:
 *           type: number
 *           description: The amount you get for the given task.
 *         sender:
 *           type: string
 *           description: who sended the task
 *       example:
 *         message: 'Do your homework'
 *         amount: 150
 *         sender: 'Father'
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
 * /task/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Task Api]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
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
router.get("/:id", authenticate, Task.getTasksById);

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
