const express = require("express");
const router = express.Router();

const Link = require("../controllers/link");
const authenticate = require("../common/auth_middleware");

/**
 * @swagger
 * tags:
 *   name: Link Api 
 *   description: Api for linking children to parents
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Children Array:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: array
 *           items:
 *             type: number
 *           description: Refrence to kid REAL ID!
 *       example:
 *         id: 123456
 */



/**
 * @swagger
 * /link:
 *   get:
 *     summary: Get all kids linked to authorized parent
 *     tags: [Link Api]
 *     description: Get kids linked to the logged parent JUST SEND TOKEN
 *     responses:
 *       200:
 *         description: Return An array of kidID and an Object which has all the CHILDREN Under that parent(Full details)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Child'
 */
router.get("/", authenticate, Link.getKids);


/**
 * @swagger
 * /link:
 *   post:
 *     summary: Link a child to parent
 *     tags: [Link Api]
 *     description: Send The KID ID you just REGIESTED!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Children Array'
 *     responses:
 *       200:
 *         description: Returns The new linked child!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Children Array'
 */
router.post("/", authenticate, Link.addKids);

module.exports = router;
