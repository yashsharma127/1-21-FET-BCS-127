import { fetchProducts, fetchProductDetails } from './services.js';

export const getProducts = async (req, res) => {
  const { category } = req.params;
  const { n, page = 1, minPrice, maxPrice, sort, order = 'asc' } = req.query;

  if (!n || isNaN(n) || n < 1) {
    return res.status(400).send({ error: 'Invalid value for query parameter "n"' });
  }

  try {
    const products = await fetchProducts(category, parseInt(n), parseInt(page), parseFloat(minPrice), parseFloat(maxPrice), sort, order);
    res.json(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { category, productId } = req.params;

  try {
    const product = await fetchProductDetails(category, productId);
    res.json(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
