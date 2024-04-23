import { ProductService } from "../services/index.js";

export const createProductController = async (req, res) => {
    try {
      const product = req.body

      //const result = await Product.create(product);
      const result = await ProductService.create(product)
      
      //const products = await Product.find().lean().exec();
      const products = await ProductService.getAll()

      req.io.emit('productList', products); // emite el evento updatedProducts con la lista de productos
      res.status(201).json({ status: 'success', payload: result });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
}

export const updateProductController = async (req, res) => {
    try {
      const productId = req.params.pid;
      const updatedFields = req.body;
  
      // const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, {
      //   new: true // Para devolver el documento actualizado
      // }).lean().exec();
      const updatedProduct = await ProductService.update(productId, updatedFields)
  
      if (!updatedProduct) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
  
      //const products = await Product.find().lean().exec();
      const products = await ProductService.getAll();
  
      req.io.emit('productList', products);
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const deleteProductController = async (req, res) => {
    try {
      const productId = req.params.pid;
  
      //const deletedProduct = await Product.findByIdAndDelete(productId).lean().exec();
      const deletedProduct = await ProductService.delete(productId)
  
      if (!deletedProduct) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
  
      //const products = await Product.find().lean().exec();
      const products = await ProductService.getAll();
  
      req.io.emit('productList', products);
  
      res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
}

export const readProductController = async (req, res) => {
    const id = req.params.pid;
    try {
      //const product = await Product.findById(id).lean().exec();
      const product = await ProductService.getById(id)
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.log('Error al leer el producto:', error);
      res.status(500).json({ error: 'Error al leer el producto' });
    }
}

export const readAllProductsController = async (req, res) => {
    console.log('¡Solicitud recibida!');
    const result = await ProductService.getAllPaginate(req)
    res.status(result.statusCode).json(result.response)
}
