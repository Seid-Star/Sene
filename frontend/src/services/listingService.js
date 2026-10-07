
import api from "./api";

/**
 * Fetch all produce listings with optional filter params.
 */
const getListings = async (params = {}) => {
  const response = await api.get("/listings", { params });
  return response.data;
};

/**
 * Fetch a single listing by its ID.
 */
const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

/**
 * Fetch market price summary metrics.
 */
const getPriceSummary = async (crop, region) => {
  const response = await api.get("/listings/price-summary", {
    params: {
      crop,
      ...(region && { region }),
    },
  });

  return response.data;
};

/**
 * Fetch listings created by the authenticated user.
 */
const getMyListings = async (params = {}) => {
  const response = await api.get("/listings/mine", { params });
  return response.data;
};

/**
 * Create a new produce listing.
 */
const createListing = async (listingData) => {
  const response = await api.post("/listings", listingData);
  return response.data;
};

/**
 * Update an existing listing.
 */
const updateListing = async (id, listingData) => {
  const response = await api.patch(`/listings/${id}`, listingData);
  return response.data;
};

/**
 * Cancel or soft-delete a listing.
 */
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