const express = require('express');
const http = require('http');
const mongoose = require("mongoose")
const socketIO = require('socket.io');
const exphbs = require("express-handlebars")
const viewsRouter = require('./routers/view.router')
const viewsCart = require('./routers/viewsCart')
const cartRouter = require("./routers/cartRouter")
const productRouter = require("./routers/productRouter")
const MongoStore = require("connect-mongo")
const sessiomViewsRouter = require("./routers/sessiomViewsRouter")
const session = require('express-session');
const sessionRouter = require("./routers/sessionRouter")
const app = express();
const passport = require('passport')
const initializePassport = require('./config/passportConfigjs')
const config = require('./config/config')
const compression = require('express-compression')
const errorHandler = require ('./middleware/error.js')
const mockingRouter = require('./routers/mockingRouter.js')
app.use(express.json());
app.use(errorHandler)
app.use(compression({
  brotli:{enabled:true, zlib:{}}
}))
app.use(session({
  store: MongoStore.create({
    mongoUrl: config.mongo.uri,
    dbname: "sessions"
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))


initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'));
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', hbs.engine);
app.set('views', './src/views')
app.set('view engine', 'handlebars');

app.use('/', sessiomViewsRouter)
app.use('/products', viewsRouter);
app.use('/cart', viewsCart)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use("/api/sessions", sessionRouter)
app.use('/mockingproducts', mockingRouter)


const httpServer = http.createServer(app);
const io = socketIO(httpServer);

(async () => {
  try {
    await mongoose.connect(config.mongo.uri, {
      dbName: config.mongo.dbName,
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    httpServer.listen(8080, () => console.log("Servidor en línea"));
    
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  }
})();

io.on("connection", socket => {
  socket.on("productList", data => {
    io.emit("updatedProducts", data);
  });
});



