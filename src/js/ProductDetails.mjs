import { setLocalStorage, getLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
        }

    
    async addToCartHandler(e) {
        const product =  await this.dataSource.findProductById(e.target.dataset.id);
        this.addProductToCart(product);
    }

    addProductToCart(product) {
        let cartList = getLocalStorage('so-cart');
        if (!Array.isArray(cartList)) {
            cartList = [];
        }
        cartList.push(product);
        setLocalStorage('so-cart', cartList);
    }

    productDetailsTemplate(product){

        let productDetails = `
        <section class="product-detail">
        <h3>${product.Brand.Name}</h3>

        <h2 class="divider">${product.Name}</h2>

        <img
          class="divider"
          src=${product.Image}
          alt=${product.NameWithoutBrand}
        />

        <p class="product-card__price">${product.FinalPrice}</p>

        <p class="product__color">${product.Colors[0].ColorName}</p>

        <p class="product__description">
        ${product.DescriptionHtmlSimple}
        </p>

        <div class="product-detail__add">
          <button id="addToCart" data-id=${product.Id}>Add to Cart</button>
        </div>
      </section>
      `
      return productDetails
    }

    addToCart(e) {
        this.addToCartHandler(e);
      }

    renderProductDetails(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            this.productDetailsTemplate(this.product)
        );
    }


    async init() {
       
        this.product = await this.dataSource.findProductById(this.productId);

        await this.renderProductDetails("main");
       
        document
          .getElementById("addToCart")
          .addEventListener("click", this.addToCart.bind(this));
    }
      
    
}

  