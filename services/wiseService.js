import fetch from "node-fetch";

const wise_api_url = process.env.WISE_API_URL;
const wise_api_key = process.env.WISE_API_KEY;

export async function createWiseClient(endpoint, options = {}) {
  const url = `${wise_api_url}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${wise_api_key}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

export default createWiseClient;
