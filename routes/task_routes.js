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
 */

/**
* @swagger
* components:
*   schemas:
*     kidID:
*       type: object
*       required:
*         - id
*       properties:
*         kidid:
*           type: number
*           description: The KID-ID
*       example:
*         kidid: 12345
*/

/**
* @swagger
* components:
*   schemas:
*     taskID:
*       type: object
*       required:
*         - _id
*       properties:
*         _id:
*           type: string
*           description: The TASK-ID
*       example:
*         _id: "62828a82077b56b51e0da779"
*/

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task Api]
 *     description: Just for checking we are not using this API
 *     responses:
 *       200:
 *         description: RETURNS ALL TASKS THAT EXSITS NOT IN USE ONLY FOR TESTING!!
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
 *     summary: Get task by KIDID(Automaticlly)
 *     tags: [Task Api]
 *     description: Kid need to be logged in USE GET and SEND TOKEN!
 *     responses:
 *       200:
 *         description: Returns The kids task list!
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
 *     description: Parent need to be logged in See example below(PUT REAL KID ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Returns The new task!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post("/", authenticate, Task.addTasks);

/**
 * @swagger
 * /task/completed:
 *   post:
 *     summary: Mark a task TRUE in completed field
 *     tags: [Task Api]
 *     description: Kid need to be logged on PASS ACCESS TOKEN and TASK ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/taskID'
 *     responses:
 *       200:
 *         description: Returns The new task!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */

router.post("/completed", authenticate, Task.taskCompleted);

/**
 * @swagger
 * /task/parent:
 *   post:
 *     summary: Get tasks that the parent sent
 *     tags: [Task Api]
 *     description: Parent need to be logged in USE POST SEND KIDID and SEND TOKEN!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/kidID'
 *     responses:
 *       200:
 *         description: Returns all the tasks the parent send
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.post("/parent", authenticate, Task.getTaskSendByParent);



module.exports = router;
