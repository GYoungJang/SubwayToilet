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
router.get('/id/find', usersControllers.getIdFind);

// 비번 재설정 전 유저 확인
router.get('/pw/check', usersControllers.getPwCheck);

// 비번 재설정
router.get('/pw/reset', usersControllers.getPwReset);

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

router.post('/id/find', usersControllers.postIdFind);
router.post('/pw/check', usersControllers.postPwCheck);
router.post('/pw/reset', usersControllers.postPwReset);

// 회원 정보 수정
router.put('/userinfo/edit', usersControllers.patchUserInfo);
// 회원 탈퇴
router.delete('/userinfo/delete', usersControllers.deleteUser);

module.exports = router;
