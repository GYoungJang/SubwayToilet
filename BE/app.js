const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { swaggerUi, specs } = require('./swagger/swagger');

dotenv.config();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('cookie'));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookie',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const adminRoutes = require('./routes/adminRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const toiletRoutes = require('./routes/toiletRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const suggestRoutes = require('./routes/suggestRoutes');
console.log(process.env.FEIP);
const corsOption = {
  origin: process.env.FEIP,
};
app.use(cors(corsOption));
app.use('/user', usersRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/page-notice', boardRoutes);
app.use('/page-Suggest', suggestRoutes);
app.use('/toilet', toiletRoutes);
app.use('/review', reviewRoutes);

// 오류 처리 미들웨어
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || '에러 발생!' });
});

// 몽고디비 연결
mongoose
  .connect(process.env.DB)
  .then(
    app.listen(process.env.PORT),
    console.log(`mongoDB server connected : ${process.env.PORT}`)
  )
  .catch((err) => {
    console.log(err);
  });
