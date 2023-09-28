const express = require('express');
const http = require('http');
const mongoose = require("mongoose")
const socketIO = require('socket.io');
const handlebars = require("express-handlebars")
const viewsRouter = require('./routers/view.router')
const viewsCart = require('./routers/viewsCart')
const cartRouter = require("./routers/cartRouter")
const productRouter = require("./routers/productRouter")
const path = require('path');


const app = express();
const PORT = 8080
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('./src/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', './src/views')
app.set('view engine', 'handlebars');


app.get('/', (req, res) => res.render('index'))
app.use('/products', viewsRouter);
app.use('/cart', viewsCart)
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


const httpServer = http.createServer(app);
const io = socketIO(httpServer);

(async () => {
  try {
    await mongoose.connect("mongodb+srv://Alstromg:320maVEZ@atlascluster.56bn6jf.mongodb.net/", {
      dbName: "Productos",
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
module.exports = PORT;


