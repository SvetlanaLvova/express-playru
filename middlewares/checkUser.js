const checkUser = (req, res, next) => {
  if (!req.session) {
    res.redirect('/')
  } next()
}
module.exports = {checkUser}
