import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
  removeAllAlerts,
  alertMessage,
  checkFieldsEmpty,
} from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

function packageItems() {
  // convert the cartItems of products from localStorage to the simpler form required for the checkout process. Array.map would be perfect for this.
  let cartItems = getLocalStorage('so-cart') || [];
  let simplifiedList = cartItems.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity,
  }));
  return simplifiedList;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.cartItems = [];
    this.subtotal = 0;
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.cartItems = getLocalStorage(this.key);
    this.calculateItemSummary();
    let form = document.getElementById('checkout-form');
    let formButton = document.getElementById('submit-button');
    formButton.addEventListener('click', (event) => this.checkout(event, form));
  }

  calculateItemSummary() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    let cartItems = getLocalStorage('so-cart') || [];
    this.subtotal = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * item.Quantity,
      0,
    );
    this.itemTotal = cartItems.reduce((sum, item) => sum + item.Quantity, 0);

    document.getElementById('total-items').textContent =
      `Total items: ${this.itemTotal}`;
    document.getElementById('subtotal').textContent =
      `Subtotal: $${this.subtotal.toFixed(2)}`;
    this.calculateOrdertotal();
  }

  calculateOrdertotal() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.shipping = (this.itemTotal - 1) * 2 + 10;
    this.tax = this.subtotal * 0.06; // Assuming 7% tax rate
    this.orderTotal = this.subtotal + this.shipping + this.tax;
    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.getElementById('shipping').textContent = this.shipping.toFixed(2);
    document.getElementById('tax').textContent = this.tax.toFixed(2);
    document.getElementById('total').textContent = this.orderTotal.toFixed(2);
  }

  async checkout(event, form) {
    event.preventDefault();
    // build the data object from the calculated fields, the items in the cart, and the information entered into the form
    const formData = new FormData(form);

    // Collect form data
    const fname = formData.get('fname');
    const lname = formData.get('lname');
    const street = formData.get('street');
    const city = formData.get('city');
    const state = formData.get('state');
    const zip = formData.get('zip');
    const cardNumber = formData.get('cardNumber');
    const expiration = formData.get('expiration');
    const code = formData.get('code');

    const items = packageItems();

    const orderData = {
      orderDate: new Date().toISOString(),
      fname: fname,
      lname: lname,
      street: street,
      city: city,
      state: state,
      zip: zip,
      cardNumber: cardNumber,
      expiration: expiration,
      code: code,
      items: items,
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    if (checkFieldsEmpty(orderData)) {
      return;
    }
    // call the checkout method in our ExternalServices module and send it our data object.
    try {
      services.checkout(orderData);
      window.location.href = '/checkout/success.html';
      setLocalStorage('so-cart', []); //Cleaning the cart
    } catch (err) {
      removeAllAlerts();
      for (let message in err.message) {
        alertMessage(err.message[message]);
      }
    }
  }
}

const checkoutProcess = new CheckoutProcess('so-cart');
const services = new ExternalServices();
checkoutProcess.init();
loadHeaderFooter();
