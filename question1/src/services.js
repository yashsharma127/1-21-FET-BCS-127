import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ecomcompanies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
const testserverURL = 'http://20.244.56.144/test/companies';
const authToken = process.env.AUTH_TOKEN

const uniID = (product) => {
    const productId = isNaN(product.id) ? '' : product.id.toString();
    const productName = isNaN(product.name) ? '' : product.name.toString();
    
    return crypto.createHash('md5').update(productId + productName).digest('hex');
  };

const fetchcompanyProducts = async (company, category, minPrice, maxPrice, topN) => {
  const url = `${testserverURL}/${company}/categories/${category}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch products from ${company}: ${error.response ? error.response.status : error.message}`);
  }
};

export const fetchProducts = async (category, n, page, minPrice, maxPrice, sort, order) => {
  const allProducts = [];

  for (const company of ecomcompanies) {
    const products = await fetchcompanyProducts(company, category, minPrice, maxPrice, n);
    allProducts.push(...products);
  }

  const productsWithId = allProducts.map(product => ({
    ...product,
    customId: uniID(product)
  }));

  if (sort) {
    productsWithId.sort((a, b) => {
      if (order === 'asc') {
        return a[sort] > b[sort] ? 1 : -1;
      } else {
        return a[sort] < b[sort] ? 1 : -1;
      }
    });
  }

  const startIndex = (page - 1) * n;
  const paginatedProducts = productsWithId.slice(startIndex, startIndex + n);

  return paginatedProducts;
};

export const fetchProductDetails = async (category, productId) => {
  for (const company of ecomcompanies) {
    const products = await fetchcompanyProducts(company, category, 0, Number.MAX_SAFE_INTEGER, 10);
    const product = products.find(p => uniID(p) === productId);

    if (product) {
      return { ...product, customId: uniID(product) };
    }
  }

  throw new Error('Product not found');
};
