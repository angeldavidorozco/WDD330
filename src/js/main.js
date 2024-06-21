import ProductData from './ProductData.mjs';
import ProductListing from './ProductList.mjs';

const dataSource = new ProductData('tents');
const listing = new ProductListing('Tents', dataSource, '.product-list');

listing.init();
