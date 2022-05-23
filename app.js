const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
const {
  deepCheckTrack
} = require('./middlewares/allmidlewares');

const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(process.env.PWD, "views", "partials"));

//ROUTERS
const {
  checkUser
} = require('./middlewares/checkUser')
const indexRouter = require('./routes/index');
const trackRouter = require('./routes/tracks.router');
//const singUpRouter = require('./routes/registration');
//const singInRouter = require('./routes/login')


app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const sessionConfig = { //просто коперни
  store: new FileStore(), //тут хранится сессия
  key: 'sid', //название ключа куки
  secret: 'trololo', //шифрование id сессии
  resave: false, //пересохранение сессии только при изменении
  saveUninitialized: false, //сохранит инициализированную сессию
  httpOnly: true, //нельзя изменить куку с фронта
  cookie: {
    express: 24 * 60 * 60e3
  }, //время жизни куки сутки
};
app.use(session(sessionConfig)); //чтобы на фронте можно было посмотреть, что за пользователь есть

app.use((req, res, next) => {
  res.locals.userId = req.session.userId; //при каждом проходе лок пер userId клалось Id из сессии
  res.locals.userEmail = req.session.email;
  next();
}) //делаем защищенные руты

app.use(deepCheckTrack);

app.use('/', indexRouter);
app.use('/track', checkUser, trackRouter);



app.listen(PORT, () => console.log('сервер запустился, порт:', PORT))

module.exports = app;
