import axios from "axios";
// import qs from "qs";

axios.defaults.withCredentials = true; //表示跨域请求时是否需要使用凭证
axios.defaults.crossDomain = true; //允许跨域

let baseurl = import.meta.env.VITE_BASE_URL;
export let get = async (url, params) => {
  let { data } = await axios.get(
    url,
    {
      params: params,
    },
    {
      headers: { operatingSys: 1, productType: 1 },
    }
  );
  return data;
};
export let post = async (url, data = {}) => {
  let res = await axios.post("/api" + url, data, {
    headers: { operatingSys: 1, productType: 1 },
  });
  return res.data;
};
export let put = async (url, data = {}) => {
  let res = await axios.put("/api" + url, data, {
    headers: { operatingSys: 1, productType: 1 },
  });
  return res.data;
};
