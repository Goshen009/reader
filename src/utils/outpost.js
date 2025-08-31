import axios from "axios";
import { ok, err } from "neverthrow";

export async function outpost(url, options = {}) {
  try {
    const response = await axios({
      url,
      method: options.method || "GET",
      headers: options.headers || {},
      data: options.body || null,
      onUploadProgress: options.onUploadProgress,
      onDownloadProgress: options.onDownloadProgress,
    });

    return ok(response.data);
  } catch (error) {
    if (error.response) {
      return err({
        type: "API",
        status: error.response.status,
        statusText: error.response.statusText,
        body: error.response.data,
      });
    } else {
      return err({
        type: "Network",
        message: error.message,
      });
    }
  }
}