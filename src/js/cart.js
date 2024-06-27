import { getLocalStorage, setLocalStorage } from './utils.mjs';
import { loadHeaderFooter } from './utils.mjs';

function deleteItem(itemId) {
  const cartItems = getLocalStorage('so-cart');
  const filteredCart = cartItems.filter((item) => item.Id !== itemId);
  setLocalStorage('so-cart', filteredCart);
  renderCartContents();
}

function countAndRemoveDuplicates(items) {
  const counts = {};
  const uniqueItems = [];

  items.forEach((item) => {
    if (counts[item.Id]) {
      counts[item.Id]++;
    } else {
      counts[item.Id] = 1;
      uniqueItems.push(item);
    }
  });

  return { counts, uniqueItems };
}

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  const { counts, uniqueItems } = countAndRemoveDuplicates(cartItems);
  const htmlItems = uniqueItems.map((item) =>
    cartItemTemplate(item, counts[item.Id]),
  );
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Event delegation
  document
    .querySelector('.product-list')
    .addEventListener('click', function (event) {
      if (event.target.dataset.id) {
        const itemId = event.target.dataset.id; // Use as string
        deleteItem(itemId);
      }
    });
}

function cartItemTemplate(item, quatity) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quatity}</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <button class="cart-card__delete" data-id="${item.Id}">❌</button>
</li>`;

  return newItem;
}

renderCartContents();
loadHeaderFooter();
