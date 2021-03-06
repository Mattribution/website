import fetch from "isomorphic-unfetch";
import auth0 from "../../../lib/auth0";
import config from "../../../lib/config";

export default async function list(req, res) {
  try {
    const tokenCache = auth0.tokenCache(req, res);
    const { accessToken } = await tokenCache.getAccessToken();

    const url = `${config.API_BASE_URL}/kpis`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const resp = await response.json();
    res.status(response.status).json(resp);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
}
