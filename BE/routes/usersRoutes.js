const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const usersControllers = require('../controller/usersControllers');

/**
 * @swagger
 *  /signup:
 *    get:
 *      summary: 회원가입 페이지
 *      tags:
 *      - user
 *      description: 회원가입 페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 회원가입 페이지 렌더링 성공
 */
router.get('/signup', usersControllers.getSignUP);

/**
 * @swagger
 *  /login:
 *    get:
 *      summary: 로그인 페이지
 *      tags:
 *      - user
 *      description: 로그인 페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 로그인 페이지 렌더링 성공
 */
router.get('/login', usersControllers.getLogin);

/**
 * @swagger
 *  /userinfo:
 *    get:
 *      summary: 마이페이지
 *      tags:
 *      - user
 *      description: 마이페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 마이페이지 렌더링 성공
 */
router.get('/userinfo', usersControllers.getUserInfo);

// 아이디 찾기
/**
 * @swagger
 *  /id/find:
 *    get:
 *      summary: 아이디 찾기 페이지
 *      tags:
 *      - user
 *      description: 아이디 찾기 페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 아이디 찾기 페이지 렌더링 성공
 */
router.get('/id/find', usersControllers.getIdFind);

// 비번 재설정 전 유저 확인
/**
 * @swagger
 *  /pw/check:
 *    get:
 *      summary: 비번 재설정 전 유저 확인 페이지
 *      tags:
 *      - user
 *      description: 비번 재설정 전 유저 확인 페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 비번 재설정 전 유저 확인 페이지 렌더링 성공
 */
router.get('/pw/check', usersControllers.getPwCheck);

// 비번 재설정
/**
 * @swagger
 *  /pw/reset:
 *    get:
 *      summary: 비번 재설정 페이지
 *      tags:
 *      - user
 *      description: 비번 재설정 페이지
 *      produces:
 *      - application/json
 *
 *      responses:
 *       200:
 *        description: 비번 재설정 페이지 렌더링 성공
 */
router.get('/pw/reset', usersControllers.getPwReset);

/**
 * @swagger
 *  /signup:
 *    post:
 *      summary: 회원가입
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description : 아이디
 *           password:
 *            type: string
 *            description : 비밀번호
 *           name:
 *            type: string
 *            description : 이름
 *           email:
 *            type: string
 *            description : 이메일
 *       responses:
 *        200:
 *         description: 회원가입 성공
 */
router.post(
  '/signup',
  [
    check('id').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').not().isEmpty(),
    check('name').not().isEmpty(),
  ],
  usersControllers.postSignUP
);

/**
 * @swagger
 *  /id/find:
 *    post:
 *      summary: 아이디 찾기
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           name:
 *            type: string
 *            description : 이름
 *           email:
 *            type: string
 *            description : 이메일
 *       responses:
 *        200:
 *         description: 아이디 찾기 성공
 */
router.post('/id/find', usersControllers.postIdFind);

/**
 * @swagger
 *  /pw/check:
 *    post:
 *      summary: 비밀번호 재설정 전 유저 확인
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description : 아이디
 *           name:
 *            type: string
 *            description : 이름
 *           email:
 *            type: string
 *            description : 이메일
 *       responses:
 *        200:
 *         description: 비밀번호 재설정 전 유저 확인 성공
 */
router.post('/pw/check', usersControllers.postPwCheck);

/**
 * @swagger
 *  /pw/reset:
 *    post:
 *      summary: 비밀번호 재설정
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           password:
 *            type: string
 *            description : 비밀번호
 *           passwordCheck:
 *            type: string
 *            description : 비밀번호 확인
 *       responses:
 *        200:
 *         description: 비밀번호 재설정 성공
 */
router.post('/pw/reset', usersControllers.postPwReset);

// 회원 정보 수정
/**
 * @swagger
 *  /userinfo/edit:
 *    put:
 *      summary: 회원 정보 수정
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description : 아이디
 *           name:
 *            type: string
 *            description : 이름
 *           email:
 *            type: string
 *            description : 이메일
 *       responses:
 *        200:
 *         description: 회원 정보 수정 성공
 */
router.put('/userinfo/edit', usersControllers.patchUserInfo);

// 회원 탈퇴
/**
 * @swagger
 *  /userinfo/delete:
 *    delete:
 *      summary: 회원 탈퇴
 *      tags:
 *      - user
 *      requestBody:
 *       required: true
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *            description : 아이디
 *       responses:
 *        200:
 *         description: 회원 탈퇴 성공
 */
router.delete('/userinfo/delete', usersControllers.deleteUser);

module.exports = router;
