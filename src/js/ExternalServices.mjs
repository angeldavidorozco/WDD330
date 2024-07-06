const baseURL = import.meta.env.VITE_SERVER_URL;
const serverURL = "http://wdd330-backend.onrender.com/checkout";

async function convertToJson(res) {
  try {
    let jsonResponse = await res.json();
    if (res.ok) {
      return jsonResponse;
    } else {
      throw { name: 'servicesError', message: jsonResponse };
    }
  } catch (error) {
    throw { name: 'networkError', message: 'Failed to parse JSON response' };
  }
}

export default class ExternalServices {
  constructor(category) {

  }
  async getData(category) {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(baseURL + `product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(order){
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    }
    let response = await fetch(baseURL + 'checkout', options);
    const data = await convertToJson(response);
    console.log(data);
  }

}
