import api from "./api";

export const getProducts = async ({
  limit = 10,
  skip = 0,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  signal,
}) => {
  let url = "/products";

  if (search.trim()) {
    url = `/products/search?q=${encodeURIComponent(
      search.trim()
    )}`;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  const params = new URLSearchParams();

  params.append("limit", limit);
  params.append("skip", skip);

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("order", order);
  }

  if (search.trim()) {
    params.append("delay", "2000");
  }

  const separator = url.includes("?") ? "&" : "?";

  const response = await api.get(
    `${url}${separator}${params.toString()}`,
    {
      signal,
    }
  );

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
  
};

export const getProductById=async(id, signal)=>{
  const response = await api.get(`products/${id}`,{
    signal,
  });

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products/add", productData);

  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};