import { loadHeaderFooter } from './utils.mjs';

export default class CheckoutProcess {
    constructor(key, outputSelector) {
      this.key = key;
      this.outputSelector = outputSelector;
      this.list = [];
      this.subtotal = 0;
      this.itemTotal = 0;
      this.shipping = 0;
      this.tax = 0;
      this.orderTotal = 0;
    }
  
    init() {
      this.list = getLocalStorage(this.key);
      this.calculateItemSummary();
    }
  
    calculateItemSummary() {
        // calculate and display the total amount of the items in the cart, and the number of items.
        list = getLocalStorage('so-cart') || [];
        subtotal = list.reduce((sum, item) => sum + item.FinalPrice * item.Quantity, 0);
        itemTotal = list.reduce((sum, item) => sum + item.Quantity, 0);

        
        
        document.getElementById('total-tems').textContent = `Total items: ${itemTotal}`;
        document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
        
    }
  
    calculateOrdertotal() {
      // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
      shipping = ((itemTotal - 1) * 2 + 10);
      tax = subtotal * 0.07; // Assuming 7% tax rate
      total = subtotal + shipping + tax;
      // display the totals.
      this.displayOrderTotals();
    }
  
    displayOrderTotals() {
        document.getElementById('shipping').textContent = shipping.toFixed(2);
        document.getElementById('tax').textContent = tax.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
    }
}

loadHeaderFooter();
