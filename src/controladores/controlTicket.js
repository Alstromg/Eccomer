

const cartDao = require('../dao/cartsDao'); 
const ticketDao = require('../dao/ticketDao'); 
const productsDAO = require("../dao/productDao")
const UserModel = require('../dao/models/user.model');

const postTicket = async (req, res) => {
    const cid = req.params.cid;
  
    try {
      const carrito = await cartDao.getCartById(cid);
  
      if (!carrito) {
        return res.status(404).json({ status: 'error', error: `Carrito con id = ${cid} no existe` });
      }
  
      const cartProduct = carrito.products;
      const productosNoComprados = [];
  
      for (const detalleProducto of cartProduct) {
        const { product, quantity } = detalleProducto;
        const producto = await productsDAO.getProductById(product);
  
        if (producto.stock >= quantity) {
            await productsDAO.editProduct(product, { stock: producto.stock - quantity });
          } else {
            productosNoComprados.push(detalleProducto);
          }
      }
  
      carrito.products = productosNoComprados;
      await carrito.save();
      
      const totalCantidad = cartProduct.reduce((total, producto) => total + producto.quantity, 0);
      const comprador = await buscarUsuarioPorCarrito(cid);
      if (!comprador || !comprador.email) {
        return res.status(400).json({ status: 'error', error: 'No se pudo obtener el correo del comprador' });
      }
      const correoComprador = comprador.email;
      const ticketDetails = await ticketDao.createTicket(totalCantidad, correoComprador);

      return res.status(201).json({ status: 'success', data: ticketDetails });
    } catch (err) {
      console.error('Error al procesar el ticket:', err);
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor', err });
    }
  };


  const buscarUsuarioPorCarrito = (carritoId) => {
    return UserModel.findOne({ cart: carritoId }).exec();
  };
  

module.exports ={ postTicket};