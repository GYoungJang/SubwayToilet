const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const salt = 12;
const user = require('../models/users');
const passport = require('../passport/index');
const jwt = require('jsonwebtoken');

function setUserToken(user) {
  const token = jwt.sign({ user }, process.env.TOKEN, {
    expiresIn: '10m',
  });
  console.log('token : ', token);
  return token;
}

exports.getSignUP = (req, res, next) => {
  res.send('signUP page');
};

exports.getLogin = (req, res, next) => {
  res.send('login page');
};

exports.getUserInfo = async (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
  } catch (err) {
    const error = new HttpError('로그인 해주세요');
    return next(error);
  }
  const id = req.decoded.user.id;
  let User;
  try {
    User = await user.findOne({ id });
    res.json({ User });
  } catch (err) {
    const error = new HttpError('사용자 정보를 불러올 수 없습니다.');
    return next(error);
  }
};

exports.getIdFind = (req, res, next) => {
  res.send('forgot id');
};

exports.getPwCheck = (req, res, next) => {
  res.send('forgot pw');
};

exports.getPwReset = (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
    res.json({ message: '재설정 페이지' });
  } catch (err) {
    const error = new HttpError('유저 확인이 되지 않았습니다.');
    return next(error);
  }
};

exports.postSignUP = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('회원가입 오류', 422));
  }

  const { id, email, password, name } = req.body;

  let existingUser;

  try {
    existingUser = await user.findOne({ id: id });
  } catch (err) {
    const error = new HttpError('회원가입 실패', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('이미 존재하는 회원입니다.', 422);
    return next(error);
  }

  let cryptedPw = await bcrypt.hash(password, salt);

  const object = {
    id,
    email,
    password: cryptedPw,
    name,
  };
  const userInfo = new user(object);
  await userInfo.save();

  res.status(201).json({
    message: '회원가입 완료',
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
  });
};

exports.postIdFind = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    await user.find({ email: email, name: name }).then((result) => {
      res.json({ id: result[0].id });
    });
  } catch (err) {
    const error = new HttpError('아이디 찾기 실패', 500);
    return next(error);
  }
};

exports.postPwCheck = async (req, res, next) => {
  const { email, name, id } = req.body;
  try {
    await user.find(
      { id, email, name }.then(async (result) => {
        const token = await setUserToken(result[0].id);
        res.json({ message: '비밀번호 재설정 페이지로 이동합니다.', token });
      })
    );
  } catch (err) {
    const error = new HttpError('사용자 확인이 안 됩니다.');
    return next(error);
  }
};

exports.postPwReset = async (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
  } catch (err) {
    const error = new HttpError('유저 확인이 되지 않았습니다.');
    return next(error);
  }
  const password = await bcrypt.hash(req.body.password, salt);

  try {
    user.findOneAndUpdate({ id: req.decoded.user.id }, { password: password });
    res.json({ message: '비밀번호 재설정 성공!' });
  } catch (err) {
    const error = new HttpError('비밀번호 재설정 실패!');
    return next(error);
  }
};

exports.patchUserInfo = async (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
  } catch (err) {
    const error = new HttpError('로그인 해주세요.');
    return next(error);
  }
  const id = req.decoded.user.id;
  const { name, email } = req.body;
  try {
    const userInfo = await user.findOneAndUpdate(
      { id },
      { name: name, email: email }
    );
    res.json({ userInfo });
  } catch (err) {
    const error = new HttpError('회원 정보 수정 실패');
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  passport.authenticate('jwt', { session: false });
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
  } catch (err) {
    const error = new HttpError('로그인 해주세요.');
    return next(error);
  }
  const id = req.decoded.user.id;
  try {
    await user.DeleteOne({ id: id }).then((result) => {
      res.json({ message: '회원 탈퇴 성공' });
    });
  } catch (err) {
    const error = new HttpError('회원 탈퇴 실패');
    return next(error);
  }
};
