import {renderListWithTemplate} from "./utils.mjs"

export default class ProductListing{
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    productCardTemplate(product) {
        let upperCaseTitle;

        if (product.Id === "989CG" || product.Id === "880RT"){
            return 
        }

        if (product.Category === 'sleeping-bags'){
            upperCaseTitle = 'Sleeping Bags';
        }else{
            const title = product.Category;
            upperCaseTitle = title.charAt(0).toUpperCase() + title.slice(1);
        }
        
        return `
        <h2>Top Products ${upperCaseTitle}</h2>
        <ul class="product-list">
            <li class="product-card">
                <a href="product_pages/index.html?product=${product.Id}">
                    <img 
                    src=${product.Images.PrimaryMedium}
                    alt=${product.NameWithoutBrand}
                    >
                    <h3 class="card__brand">${product.Brand.Name}</h3>
                    <h2 class="card__name">${product.Name}</h2>
                    <p class="product-card__price">$${product.FinalPrice}</p>
                </a>
            </li>
        </ul>
        `
    }

    renderList(list){
        renderListWithTemplate(this.productCardTemplate, this.listElement, list);
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.renderList(list);
    }

}