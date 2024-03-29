const express = require("express");
const authenticate = require("../common/auth_middleware");
const router = express.Router();

const Auth = require("../controllers/auth");

/**
 * @swagger
 * tags:
 *   name: Auth Api
 *   description: The Authentication API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Parent:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - is_child
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         name:
 *           type: string
 *           description: The parent name
 *         is_child:
 *           type: boolean
 *           description: Toggle to know if its a child/parent login
 *         children:
 *           type: array
 *           items:
 *             type: number
 *           description: Array of children ID's
 *       example:
 *         email: 'alon@gmail.com'
 *         password: '123456'
 *         is_child: false
 */

/**
* @swagger
* components:
*   schemas:
*     Password:
*       type: object
*       required:
*         - oldpassword
*         - newpassword
*       properties:
*         oldpassword:
*           type: string
*           description: The OLD-PASSWORD
*         newpassword:
*           type: string
*           description: The NEW-PASSWORD
*       example:
*         oldpassword: "12345"
*         newpassword: "1"
*/


/**
* @swagger
* components:
*   schemas:
*     Tokens:
*       type: object
*       required:
*         - accessToken
*         - refreshToken
*       properties:
*         accessToken:
*           type: string
*           description: The JWT access token
*         refreshToken:
*           type: string
*           description: The JWT refresh token
*       Example:
*         accessToken: '12dasd232-Z1'
*         refreshToken: '1dsadZ4c4-3c'
*/

/**
* @swagger
* /auth/register:
*   post:
*     summary: Registers a new parent
*     tags: [Auth Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Parent'
*     responses:
*       200:
*         description: The new parent user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Parent'
*/

router.post("/register", Auth.register);


/**
* @swagger
* /auth/register/child:
*   post:
*     summary: Registers a new child
*     description: Need to provide the Access Token in the auth header so it can link CHILD to PARENT and all the details BELOW
*     tags: [Auth Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Child'
*     responses:
*       200:
*         description: The new child user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Child'
*/

router.post("/register/child", authenticate, Auth.childRegister);


/**
* @swagger
* /auth/changepassword:
*   post:
*     summary: Changes a password to a Parent and a Child
*     description: Need to provide the Access Token in the auth header and provide oldpassword & newpassword
*     tags: [Auth Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Password'
*     responses:
*       200:
*         description: The new password that has been changed
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Password'
*/

router.post("/changepassword", authenticate, Auth.changePassword);

/**
* @swagger
* /auth/login:
*   post:
*     summary: Login with auth
*     tags: [Auth Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Parent'
*     responses:
*       200:
*         description: The Access & Refresh Tokens
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/

router.post("/login", Auth.login);

/**
* @swagger
* /auth/logout:
*   post:
*     summary: User logout
*     tags: [Auth Api]
*     description: Need to provide the Refresh Token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: logout completed successfully
*/

router.post("/logout", Auth.logout);

/**
* @swagger
* /auth/refreshToken:
*   post:
*     summary: Get a new access token using the Refresh Token
*     tags: [Auth Api]
*     description: Need to provide the refresh token in the auth header
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: The Access & Refresh tokens.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Tokens'
*/

router.post('/refreshToken', Auth.refreshToken)

module.exports = router;
