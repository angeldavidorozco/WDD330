import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from './utils.mjs';

function deleteItem(itemId) {
  const cartItems = getLocalStorage('so-cart');
  const filteredCart = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage('so-cart', filteredCart);
  renderCartContents();
}

function modifyQuantity(itemId, operation) {
  let cartItems = getLocalStorage('so-cart');
  const existingProduct = cartItems.find((item) => item.Id === itemId);
  existingProduct.Quantity = existingProduct.Quantity + operation;
  if (existingProduct.Quantity == 0) {
    deleteItem(itemId);
    return;
  }
  cartItems = cartItems.filter((item) => item.Id !== existingProduct.Id);
  cartItems.push(existingProduct);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

function hideTotal() {
  document.querySelector('#cart-footer').classList.add('hide');
}

function renderTotal(cartItems) {
  let total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * item.Quantity,
    0,
  );
  document.querySelector('#cart-footer').classList.remove('hide');
  document.querySelector('#cart-footer').innerHTML = `
  <p class="cart-total">Total: $${total.toFixed(2)}</p>
  `;
}

function renderCartContents() {
  let cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  if (cartItems.length == 0) {
    hideTotal();
  } else {
    renderTotal(cartItems);
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images.PrimarySmall}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.Quantity}</p>
  <p class="cart-card__price">$${item.FinalPrice * item.Quantity}</p>
  <div class='button-grid'>
  <button class="cart-card__add" data-id="${item.Id}" data-operation="1">➕</button>
  <button class="cart-card__delete" data-id="${item.Id}">❌</button>
  <button class="cart-card__substract" data-id="${item.Id}" data-operation="-1">➖</button>
  </div>

  
</li>`;

  return newItem;
}

function attachEvent() {
  document
    .querySelector('.product-list')
    .addEventListener('click', function (event) {
      if (event.target.dataset.operation && event.target.dataset.id) {
        const itemId = event.target.dataset.id;
        const operation = parseInt(event.target.dataset.operation);
        modifyQuantity(itemId, operation);
        return;
      }
      if (event.target.dataset.id) {
        const itemId = event.target.dataset.id;
        deleteItem(itemId);
        return;
      }
    });
}

renderCartContents();
attachEvent();
loadHeaderFooter();
