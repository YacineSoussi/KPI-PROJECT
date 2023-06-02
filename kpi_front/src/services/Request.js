import axios from "axios";

class Request {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return Promise.resolve(config);
    });
  }

  async make(method, url, config = {}) {
    try {
      const response = await this.client[method.toLowerCase()](url, config);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Request();
