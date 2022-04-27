const express = require("express");
const router = express.Router();

const childApi = require("../controllers/childAPI");
const authenticate = require("../common/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Child Api
 *   description: Child's API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - password
 *         - balance
 *       properties:
 *         id:
 *           type: number
 *           description: child's id
 *         email:
 *           type: string
 *           description: child's email
 *         password:
 *           type: string
 *           description: child's pwd
 *         balance:
 *           type: string
 *           description: the child's balance
 *         isCompleted:
 *           type: boolean
 *           description: Is the task completed
 *         tokens:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Tokens
 *       example:
 *         _id: 123456
 *         email: 'child@gmail.com'
 *         password: '123456'
 *         balance: 500
 */

/**
* @swagger
* components:
*   schemas:
*     Transactions:
*       type: object
*       required:
*         - amount
*         - description
*       properties:
*         amount:
*           type: number
*           description: The Amount Added/dedcuted
*         description:
*           type: string
*           description: Description of the transaction
*       example:
*         amount: 500
*         description: 'For your birthday'
*/



/**
 * @swagger
 * /child/transactions:
 *   get:
 *     summary: Get all child transactions
 *     tags: [Child Api]
 *     responses:
 *       200:
 *         description: The transactions list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Child'
 */

router.get("/transactions", authenticate, childApi.getTransactions);





/**
 * @swagger
 * /child/transactions:
 *   post:
 *     summary: Add new transaction to child, also updates his balance accordingly
 *     tags: [Child Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transactions'
 *     responses:
 *       200:
 *         description: The new transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transactions'
 */

router.post("/transactions", authenticate, childApi.addTransaction);




/**
 * @swagger
 * /child/balance:
 *   get:
 *     summary: Get balance
 *     tags: [Child Api]
 *     responses:
 *       200:
 *         description: child's current balance
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               items:
 *                 $ref: '#/components/schemas/Child'
 */

router.get("/balance", authenticate, childApi.getBalance);




/**
 * @swagger
 * /child/balance:
 *   post:
 *     summary: set a new balance for child
 *     tags: [Child Api]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Child'
 *     responses:
 *       200:
 *         description: The new balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Child'
 */

router.post("/balance", authenticate, childApi.updateBalance);

module.exports = router;
