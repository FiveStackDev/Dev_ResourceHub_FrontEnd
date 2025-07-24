// API base URL for all microservices
const BASE_URL =
  'https://e7f2b9c3-7f86-4a6b-91f9-2ae1c2e1c631-dev.e1-us-east-azure.choreoapis.dev/default/ballerina';

// Service-specific base URLs
export const BASE_URLS = {
  login: `${BASE_URL}/auth-380/v1.0`,
  maintenance: `${BASE_URL}/maintenance-f9f/v1.0`,
  asset: `${BASE_URL}/v1.0`,
  user: `${BASE_URL}/user-294/v1.0`,
  assetRequest: `${BASE_URL}/assetrequest-9fc/v1.0`,
  calendar: `${BASE_URL}/calendar-eb2/v1.0`,
  mealtime: `${BASE_URL}/mealtime-481/v1.0`,
  mealtype: `${BASE_URL}/mealtype-899/v1.0`,
  settings: `${BASE_URL}/settings-e6f/v1.0`,
  dashboardAdmin: `${BASE_URL}/dashboard-admin-f7e/v1.0`,
  dashboardUser: `${BASE_URL}/dashboard-user-bda/v1.0`,
  orgsettings: `${BASE_URL}/orgsettings-433/v1.0`,
  report: `${BASE_URL}/schedulereports-a9e/v1.0`,
  notification: `${BASE_URL}/notification-ad2/v1.0`,

  // For local development
  // login: "http://localhost:9094/auth",
  // maintenance: "http://localhost:9090/maintenance",
  // asset: "http://localhost:9090/asset",
  // user: "http://localhost:9090/user",
  // assetRequest: "http://localhost:9090/assetrequest",
  // calendar: "http://localhost:9090/calendar",
  // mealtime: "http://localhost:9090/mealtime",
  // mealtype: "http://localhost:9090/mealtype",
  // settings: "http://localhost:9090/settings",
  // dashboardAdmin: "http://localhost:9092/dashboard/admin",
  // dashboardUser: "http://localhost:9092/dashboard/user",
  // orgsettings: "http://localhost:9090/orgsettings",
  // report: "http://localhost:9090/schedulereports",
  // notification: "http://localhost:9093/notification",
};
