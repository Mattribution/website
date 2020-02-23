import fetch from "isomorphic-unfetch";
import auth0 from "../../../lib/auth0";
import config from "../../../lib/config";

export default async function kpi(req, res) {
  const id = req.query.id;

  async function deleteKpi(req, res) {
    try {
      const tokenCache = auth0.tokenCache(req, res);
      const { accessToken } = await tokenCache.getAccessToken();

      const url = `${config.API_BASE_URL}/kpis/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify(req.body),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      const resp = await response.json();
      res.status(200).json(resp);
    } catch (error) {
      console.error(error);
      res.status(error.status || 500).json({
        code: error.code,
        error: error.message
      });
    }
  }

  switch (req.method) {
    case "DELETE":
      await deleteKpi(req, res);
    default:
      res.status(405).end(); //Method Not Allowed
      break;
  }
}
