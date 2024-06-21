import {renderListWithTemplate} from "./utils.mjs"

export default class ProductListing{
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = document.querySelector(listElement);
    }

    productCardTemplate(product) {
        if (product.Id === "989CG" || product.Id === "880RT"){
            return 
        }
        return `<li class="product-card">
          <a href="product_pages/index.html?product=${product.Id}">
            <img 
            src=${product.Image}
            alt=${product.NameWithoutBrand}
            >
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.Name}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>`
    }

    renderList(list){
        renderListWithTemplate(this.productCardTemplate, this.listElement, list);
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

}