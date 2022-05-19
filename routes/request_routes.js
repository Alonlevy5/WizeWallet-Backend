const express = require("express");
const router = express.Router();

const Request = require("../controllers/request");
const authenticate = require("../common/auth_middleware");

/**
* @swagger
* tags:
*   name: Request Api
*   description: The Request API
*/


/**
* @swagger
* components:
*   schemas:
*     _ID:
*       type: object
*       required:
*         - _id
*       properties:
*         _id:
*           type: number
*           description: The KID-ID
*       example:
*         _id: 122
*/


/**
* @swagger
* components:
*   schemas:
*     Request:
*       type: object
*       required:
*         - message
*         - amount
*       properties:
*         message:
*           type: string
*           description: The request's text.
*         amount:
*           type: number
*           description: The amount you ask from your parent.
*         sender:
*           type: string
*           description: Filled automaticlly KID IS THE SENDER
*       example:
*         message: 'Please give me money for food'
*         amount: 250
*/


/**
 * @swagger
 * /request:
 *   post:
 *     summary: Add new request
 *     tags: [Request Api]
 *     description: Kid need to be logged in See example below
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: Returns The new request!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 */
router.post("/", authenticate, Request.addRequest);


/**
 * @swagger
 * /request/getparent:
 *   post:
 *     summary: Get request that the kid sent 
 *     tags: [Request Api]
 *     description: Parent need to be logged in USE POST SEND KIDID and SEND TOKEN!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/_ID'
 *     responses:
 *       200:
 *         description: Returns all the request the kid send
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
router.post("/getparent", authenticate, Request.getRequestSentByKid);


/**
 * @swagger
 * /request/delete:
 *   post:
 *     summary: Delete the request that the kid sent DAD DOSENT ACCEPT
 *     tags: [Request Api]
 *     description: Parent need to be logged in USE POST SEND REQUEST-ID and SEND TOKEN! _ID is a STRING
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/_ID'
 *     responses:
 *       200:
 *         description: Return the deleted request the kid send
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */

router.post("/delete", authenticate, Request.deleteRequest);

module.exports = router;
