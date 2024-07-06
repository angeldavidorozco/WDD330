// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false){
  if(clear){
    return
  }
  const htmlStrings = list.map((product) => templateFn(product));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// function to take an optional object and a template and insert the objects as HTML into the DOM
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.insertAdjacentHTML("afterbegin", template);
  //if there is a callback...call it and pass data
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  const html = await response.text();

  return html;
}

// function to dynamically load the header and footer into a page
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll=true) {

  const alert = document.createElement('div');
  const button = document.createElement('button');

  alert.classList.add('alert');
  button.classList.add('alert-button');
  
  alert.innerText = message;
  button.innerText = 'X';
  
  alert.appendChild(button);
  
  alert.addEventListener('click', function(e) {
      if(e.target.innerText = message) { 
        main.removeChild(this);
      }
  })
  
  const main = document.querySelector('main');
  main.prepend(alert);
  
  if(scroll)
    window.scrollTo(0,0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}

export function getLabelText(inputId) {
  const label = document.querySelector(`label[for="${inputId}"]`);
  if (label) {
    return label.textContent.trim();
  } else {
    console.error(`Label not found for input ID: ${inputId}`);
    return '';
  }
}

export function checkFieldsEmpty(orderData) {
  for (let key in orderData) {
    if (orderData[key] == '' || orderData[key] == null) {
      removeAllAlerts();
      let message = getLabelText(key);
      alertMessage(`Missing ${message}`); 
      return true;
    }
  }
  return false; 
}