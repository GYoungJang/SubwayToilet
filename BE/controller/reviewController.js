const review = require('../models/review');
const HttpError = require('../models/http-error');
const moment = require('moment');
const passport = require('../passport/index');
const jwt = require('jsonwebtoken');

// const auth = function(req,res,next) {
  
// }
exports.getReview = async (req, res, next) => {
  const { stinCd } = req.query;
  try {
    const Review = await review.find({ stinCd: stinCd });
    await res.json({Review});
  } catch (err) {
    const error = new HttpError('리뷰 정보를 불러올 수 없습니다.');
    return next(error);
  }
}

exports.postReview = async (req, res, next) => {
  // console.log(req.headers)
  passport.authenticate('jwt', { session: false })
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.TOKEN);
  } catch (err) {
    const error = new HttpError('로그인 해주세요');
    return next(error);
  }
  const { stinCd, cleanliness, count, size, convenience,  text, rating } = req.body;
  const Review = new review({
    stinCd,
    id : req.decoded.user.id,
    cleanliness,
    count,
    size,
    convenience,
    text,
    rating,
    date: String(moment().format('YYYY-MM-DD HH:mm:ss')),
  });
  try {
    await Review.save();
    res.json({ message: '리뷰 작성 성공', Review });
  } catch (err) {
    const error = new HttpError('리뷰 작성 실패');
    return next(error);
  }
};

exports.patchReview = async (req, res, next) => {
  const { stinCd,id, cleanliness, count, size, convenience,  text, rating } = req.body;
  const filter = { stinCd, date };
  let Review;
  try {
    Review = await review.findOne({ filter });
    Review.text = text;
    Review.rating = rating;
    Review.date = String(moment().format('YYYY-MM-DD HH:mm:ss'));
  } catch (err) {
    const error = new HttpError('수정할 대상이 없습니다.');
    return next(error);
  }

  try {
    await Review.save();
    res.json({ message: '수정성공', Review });
  } catch (err) {
    const error = new HttpError('수정 실패');
    return next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  const { stinNm, date } = req.body;
  let Review;
  try {
    Review = await review.findOne({ stinNm, date });
  } catch (err) {
    const error = new HttpError('삭제할 대상이 없습니다.');
    return next(error);
  }
  try {
    await Review.remove();
    res.json({ message: '삭제성공' });
  } catch (err) {
    const error = new HttpError('삭제 실패');
    return next(error);
  }
};
