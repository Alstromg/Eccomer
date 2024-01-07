const products = require("./models/products")

const getProducts = async (query) => {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const filterOptions = {};

    if (query.stock) filterOptions.stock = query.stock;
    if (query.category) filterOptions.category = query.category;

    const paginateOptions = { lean: true, limit, page };

    if (query.sort === 'asc') paginateOptions.sort = { price: 1 };
    if (query.sort === 'desc') paginateOptions.sort = { price: -1 };

    return await products.paginate(filterOptions, paginateOptions);
};

const getProductById = async (productId) => {
    return await products.findById(productId);
};


const editProduct = async (productid, updatedFields) => {
    try {
      const producto = await products.findById(productid);
  
      if (!producto) {
        throw new Error(`Producto con id = ${productid} no encontrado`);
      }
      Object.assign(producto, updatedFields);
  
      await producto.save();
  
      return producto;
    } catch (err) {
      throw err;
    }
  }
const createProduct = async (productData) => {
    const { title, description, price, code, stock, category, owner } = productData;
    const newProduct = new products({
        title: title,
        description: description,
        price: price,
        code: code,
        stock: stock,
        category: category,
        owner: owner
    });
    return await newProduct.save();
};

const deleteProduct = async (productId) => {
    return await products.deleteOne({ _id: productId });
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    editProduct,
};