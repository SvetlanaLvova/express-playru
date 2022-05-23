const express = require("express");
const router = express.Router();
const {
  User,
  Music,
  Usermusic
} = require("../db/models");
const {
  deepCheckTrack
} = require("../middlewares/allmidlewares")


//добавление в личном кабинете + отрисовка на главной всех треков из базы + текущий пользователь видит только свои треки
router
  .route("/")
  .get(async (req, res) => {
    const {
      userId
    } = req.session //достаем текущего зареганого юзера из сессии
    if (userId === undefined) return res.redirect('/') // ДОБАВЛЕНО В РЕЛИЗЕ 5!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const userTracks = await Music.findAll({ //!!! Пишу чтобы в "Мой плейлист" была музыка только текущего юзера
      include: {
        model: User,
        where: {
          id: userId
        },
      }
    });
    if (userTracks instanceof Error) {
      return res.render("404");
    }
    return res.render("track", {
      userTracks
    });
  })
  .post(async (req, res) => {
    const {
      tittle,
      description,
      img
    } = req.body;
    const {
      userId
    } = req.session
    const newTrack = await Music.create({
      tittle,
      description,
      img
    })
    const link = await Usermusic.create({ //чтобы промежуточная таблица заполнялась
      user_id: userId,
      music_id: newTrack.id
    })
    if (newTrack instanceof Error) {
      return res.render("404");
    }
    return res.redirect('/track');
  })

// ручка для кнопки "Подробнее" (см. detailTrack)

router.get('/detail/:trackId', async (req, res) => {
  const {
    trackId
  } = req.params;
  const currentTrack = await Music.findByPk(trackId); // находим в базе этот трек
  if (currentTrack instanceof Error) {
    return res.render('404');
  }
  if (!currentTrack) {
    return res.render('track', {
      message: 'Такого трека нет'
    });
  }
  return res.render('detailTrack', {
    currentTrack
  })
});


//УДАЛЕНИЕ трека
router.route("/delete/:trackId").delete(async (req, res) => {
  const {
    trackId
  } = req.params;
  // ручка срабатывает на запрос типа delete и удаляет юзера

  try {
    await Music.destroy({
      where: {
        id: trackId
      }
    });
    res.sendStatus(222);
  } catch (error) {
    console.log(error);
    res.sendStatus(553);
  }
});

// Коррекция трека
router.get('/edit/:trackId', (req, res) => {
  res.render('correct', {
    trackId: req.params.trackId
  });
});
router.put('/edit/:trackId', deepCheckTrack, async (req, res) => {
  const {
    title,
    description,
    img
  } = req.body;
  try { // пытаемся изменить юзера
    await Music.update({
      title,
      description,
      img
    }, {
      where: {
        id: req.params.trackId
      }
    });
    res.sendStatus(200); // если изменение прошло успешно, возвращаем стату 200
  } catch (error) {
    console.log(error);
    res.sendStatus(500); // если изменить юзера не удалось, статус 500
  }
});

module.exports = router
