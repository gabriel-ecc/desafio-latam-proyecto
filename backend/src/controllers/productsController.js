import { productsHATEOAS } from '../helpers/productsHateoas.js';
import {
  getProductsByPage,
  getProductsCount,
  getProductById,
} from '../models/productsModel.js';

export const getProducts = async (req, res) => {
  try {
    const products = await getProductsByPage(req.query);
    const count = await getProductsCount();
    const productsWithHATEOAS = await productsHATEOAS(
      'product',
      products,
      count,
    );
    res.status(200).json(productsWithHATEOAS);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};
