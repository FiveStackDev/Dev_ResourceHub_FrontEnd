// API base URL for all microservices
const BASE_URL =
  "https://4f2de039-e4b3-45c1-93e2-4873c5ea1a8e-dev.e1-us-east-azure.choreoapis.dev/resource-hub/ballerina";

// Service-specific base URLs
export const BASE_URLS = {
  // login: `${BASE_URL}/v1.0`,
  // maintenance: `${BASE_URL}/maintenance-f9f/v1.0`,
  // asset: `${BASE_URL}/asset-e99/v1.0`,
  // user: `${BASE_URL}/user-294/v1.0`,
  // assetRequest: `${BASE_URL}/assetrequest-9fc/v1.0`,
  // calendar: `${BASE_URL}/calander-7e9/v1.0`,
  // mealtime: `${BASE_URL}/mealtime-481/v1.0`,
  // mealtype: `${BASE_URL}/mealtype-899/v1.0`,
  // settings: `${BASE_URL}/settings-e6f/v1.0`,
  // dashboardAdmin: `${BASE_URL}/dashboard-admin-b74/v1.0`,
  // dashboardUser: `${BASE_URL}/dashboard-user-033/v1.0`,

    // For local development
  login: "http://localhost:9090/auth",
  maintenance: "http://localhost:9090/maintenance",
  asset: "http://localhost:9090/asset",
  user: "http://localhost:9090/user",
  assetRequest: "http://localhost:9090/assetrequest",
  calendar: "http://localhost:9090/calendar",
  mealtime: "http://localhost:9090/mealtime",
  mealtype: "http://localhost:9090/mealtype",
  settings: "http://localhost:9090/settings",
  dashboardAdmin: "http://localhost:9090/dashboard/admin",
  dashboardUser: "http://localhost:9090/dashboard/user",
};
