import axios from "axios";

////////////////////////////////////////////////////////////////////////////////

export function getFetcher(baseUrl: string) {
  return axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
