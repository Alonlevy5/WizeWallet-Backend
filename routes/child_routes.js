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
 *         - name
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
 *         name:
 *           type: string
 *           description: child's name
 *         balance:
 *           type: string
 *           description: the child's balance
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
 *         name: 'Alon'
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
* components:
*   schemas:
*     Send-Money:
*       type: object
*       required:
*         - _id
*         - description
*         - amount
*       properties:
*         _id:
*           type: number
*           description: The KID-ID to send money to
*         amount:
*           type: number
*           description: The Amount the parent send
*         description:
*           type: string
*           description: The description of the money the parent send        
*       example:
*         _id: 123455
*         amount: 150
*         description: 'Gift For you'
*/

/**
* @swagger
* components:
*   schemas:
*     ID:
*       type: object
*       required:
*         - id
*       properties:
*         id:
*           type: number
*           description: The KID-ID
*       example:
*         id: 205872
*/



/**
 * @swagger
 * /child/transactions:
 *   get:
 *     summary: Get all child transactions
 *     description: Send only token from child account
 *     tags: [Child Api]
 *     responses:
 *       200:
 *         description: Return The transactions list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 */

router.get("/transactions", authenticate, childApi.getTransactions);





/**
 * @swagger
 * /child/transactions:
 *   post:
 *     summary: Add new transaction to child, also updates his balance accordingly
 *     tags: [Child Api]
 *     description: Adding new transactions to the child from child account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transactions'
 *     responses:
 *       200:
 *         description: Return The new transaction you added
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
 *     description: Gets the childs balance just send token nothing else!
 *     responses:
 *       200:
 *         description: Returns the childs balance
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
 * /child/sendmoney:
 *   post:
 *     summary: Send money to child from parent
 *     tags: [Child Api]
 *     description: Sending money to kid need to pass ACCESS TOKEN AND BELOW(_id for kid, amount , description)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Send-Money'
 *     responses:
 *       200:
 *         description: Returns the new balance and the transaction that was send!.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Send-Money'
 */

router.post("/sendmoney", authenticate, childApi.sendMoneyFromParent);


/**
 * @swagger
 * /child/transactions/parent:
 *   post:
 *     summary: Parent can see kids transactions by id
 *     tags: [Child Api]
 *     description: Parent need to be logged need to pass access token and KID-ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ID'
 *     responses:
 *       200:
 *         description: Returns The transactions for the KID-ID you passed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ID'
 */
router.post("/transactions/parent", authenticate, childApi.getTransactionsParent);


module.exports = router;
