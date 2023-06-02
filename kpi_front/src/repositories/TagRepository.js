import Request from "../services/Request";

export default class TagRepository {
  async fetchTags() {
    return await Request.make("GET", "/tags");
  }

  async createTag(body) {
    return await Request.make("POST", "/tags", { data: body });
  }

  async updateTag(id, body) {
    return await Request.make("PATCH", `/tags/${id}`, { data: body });
  }

  async deleteTag(id) {
    return await Request.make("DELETE", `/tags/${id}`);
  }
}
