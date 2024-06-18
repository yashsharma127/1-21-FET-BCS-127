import axios from 'axios';
import crypto from 'crypto';

const ecomCompanies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];
const testserverURL = 'http://20.244.56.144/test/companies';

const genuniqueID = (product) => {
  return crypto.createHash('md5').update(product.id + product.name).digest('hex');
};

const fetchCompanyProducts = async (company, category, minPrice, maxPrice, topN) => {
  const url = `${testserverURL}/${company}/categories/${category}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
  const response = await axios.get(url);
  return response.data;
};

export const fetchProducts = async (category, n, page, minPrice, maxPrice, sort, order) => {
  const allProducts = [];

  for (const company of ecomCompanies) {
    const products = await fetchCompanyProducts(company, category, minPrice, maxPrice, n);
    allProducts.push(...products);
  }

  const productsWithId = allProducts.map(product => ({
    ...product,
    customId: genuniqueID(product)
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
  for (const company of ecomCompanies) {
    const products = await fetchCompanyProducts(company, category, 0, Number.MAX_SAFE_INTEGER, 10);
    const product = products.find(p => genuniqueID(p) === productId);

    if (product) {
      return { ...product, customId: genuniqueID(product) };
    }
  }

  throw new Error('Product not found');
};
