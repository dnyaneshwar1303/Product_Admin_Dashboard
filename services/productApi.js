import api from "./api";

export const getProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  signal,
}) => {
  let url;

  if (search.trim()) {
    url = `/products/search?q=${encodeURIComponent(
      search.trim()
    )}&limit=${limit}&skip=${skip}&delay=2000`;
  } else {
    url = `/products?limit=${limit}&skip=${skip}`;
  }

  const response = await api.get(url, {
    signal,
  });

  return response.data;
};