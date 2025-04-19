import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler";


class ApiRequest {
  constructor(url) {
    this.url = url;
  }

  async getRequest(queryParams = {}, headers = {}) {
    return await asyncHandler(() =>
      axios.get(this.url, {
        params: queryParams,
        headers: headers,
      })
    );
  }

  async postRequest(body, headers = {}) {
    return await asyncHandler(() =>
      axios.post(this.url, body, { headers: headers })
    );
  }

  async putRequest(body, headers = {}) {
    return await asyncHandler(() =>
      axios.put(this.url, body, { headers: headers })
    );
  }

  async deleteRequest(headers = {}) {
    return await asyncHandler(() =>
      axios.delete(this.url, { headers: headers })
    );
  }

  async patchRequest(body, headers = {}) {
    return await asyncHandler(() =>
      axios.patch(this.url, body, { headers: headers })
    );
  }
}

export default ApiRequest;
