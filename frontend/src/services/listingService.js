
import api from "./api";

const getListings = async (params = {}) => {
  const response = await api.get("/listings", {
    params,
  });

  return response.data;
};

const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);

  return response.data;
};

const getPriceSummary = async (crop, region) => {
  const response = await api.get("/listings/price-summary", {
    params: {
      crop,
      ...(region && { region }),
    },
  });

  return response.data;
};

const getMyListings = async (params = {}) => {
  const response = await api.get("/listings/mine", {
    params,
  });

  return response.data;
};

const createListing = async (listingData) => {
  const response = await api.post("/listings", listingData);

  return response.data;
};

const updateListing = async (id, listingData) => {
  const response = await api.patch(`/listings/${id}`, listingData);

  return response.data;
};

const cancelListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);

  return response.data;
};

export {
  getListings,
  getListing,
  getPriceSummary,
  getMyListings,
  createListing,
  updateListing,
  cancelListing,
};