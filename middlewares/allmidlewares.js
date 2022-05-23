const {
  Music,
  Usermusic
} = require("../db/models");

const deepCheckTrack = async (req, res, next) => {
  if (req.params.trackId) {
    const currentTrack = await Music.findByPk(req.params.trackId, {
      raw: true
    });
    const userTrack = await Usermusic.findOne({
      where: {
        music_id: currentTrack.id,
        user_id: req.session.userId || 0
      },
      raw: true
    })
    console.log("======", currentTrack)
    console.log('+++++++++', userTrack)
    if (userTrack) {
      next()
    } else {
      res.redirect('/')
    }
  } else {
    next()
  }
  // if (Number(req.session.userId) === Number(currentTrack.user_id)) {
  //   // сравниваем id юзера и id профиля на который он хочет попасть
  // next();
  // } else {
  //   res.sendStatus(401); // редиректим юзера всегда на свой профиль при попытке перейти на чужой
  // }
};

module.exports = {
  deepCheckTrack
};
