import api from "./api";

export const getProducts=async(limit = 10, skip = 0)=>{
    const response = await api.get(`/products?limit=${limit}&skip=${skip}`);

    return response.data;
};