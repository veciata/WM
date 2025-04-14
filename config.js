const dev = {
  API_URL: "http://10.0.2.2/api",
};

const prod = {
  API_URL: "https://api.world-moneys.com/public/api",
};

const config = __DEV__ ? dev : prod;

export default config;
