const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const { User } = require("../db/models");
const { Music } = require("../db/models")


router
  .route("/")
  .get(async (req, res) => {
    const allTracks = await Music.findAll();
    if (allTracks  instanceof Error) {
      return res.render("404");
    }
    return res.render("index", { allTracks });
  })


//РОУТА ДЛЯ РЕГИСТРАЦИИ
router
  .route("/signup")
  .get((req, res) => {
    res.render("signup");
  })
  .post(async (req, res) => {
    const { name, email, password, groupname, year } = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex'); //шифруем пароль
    if (!name || !email || !password || !groupname || !year) {
      return res.render("signup", { message: "Вы заполнили не все поля" });
    }
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      groupname,
      year,
    }).catch((e) => e);
    if (newUser instanceof Error) {
      return res.render("signup", {
        message: "Такой пользователь уже существует",
      });
    }
    req.session.userId = newUser.id;
    req.session.email = newUser.email;

    return res.redirect("/");
  });
 

  //РОУТА ДЛЯ ВХОДА
router
.route("/signin")
.get((req, res) => {
  return res.render("signin");
})
.post(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("signin", { message: "Вы заполнили не все поля" });
  }
  const currentUser = await User.findOne({ where: { email } , raw: true});
  if (currentUser instanceof Error) {
    return res.render("404");
  }
  if (!currentUser) {
    return res.render("signup", {
      message: "Пользователь не найден, зарегестрируйтесь",
    });
  }
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  if (hashedPassword !== currentUser.password) {
    return res.render("signin", { message: "Пароль неверный" });
  }
  req.session.userId = currentUser.id;
  req.session.email = currentUser.email;
  return res.redirect("/");
});


//РОУТА ДЛЯ ВЫХОДА 
router.get('/logout', (req, res) => {
  req.session.destroy(); //удаляем сессию с сервера (или бд, если сессия хранится там)
  res.clearCookie('sid'); //говорим клиенту, чтобы он удалил куку
  res.redirect('/');
})


 module.exports = router;
