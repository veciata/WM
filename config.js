const dev = {
  API_URL: "http://localhost/api",
};

const prod = {
  API_URL: "https://api.world-moneys.com/public/api",
};

const config = __DEV__ ? dev : prod;

export default config;
