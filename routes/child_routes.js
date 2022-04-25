const express = require("express");
const router = express.Router();

const childApi = require("../controllers/childAPI");
const authenticate = require("../common/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Child's API
 *   description: Child's API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Child:
 *       type: object
 *       required:
 *         - email
 *         - password
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
 *         tokens:
 *           type: string array
 *           
 *           description: array of Tokens
 *         isCompleted:
 *           type: boolean
 *           description: Is the task completed
 */



/**
 * @swagger
 * /child/transactions:
 *   get:
 *     summary: Get all transactions
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
 *             $ref: '#/components/schemas/Child'
 *     responses:
 *       200:
 *         description: The new transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Child'
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
