import api from "./api";

/**
 * Fetch all produce listings with optional filter params (search, category, region, etc.)
 */
const getListings = async (params = {}) => {
  try {
    const response = await api.get("/listings", { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch listings"
    );
  }
};

/**
 * Fetch a single listing by its ID
 */
const getListing = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Listing with ID ${id} not found`
    );
  }
};

/**
 * Fetch market price summary metrics filtered by crop type and optional region
 */
const getPriceSummary = async (crop, region) => {
  try {
    const response = await api.get("/listings/price-summary", {
      params: {
        crop,
        ...(region && { region }),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch price summary"
    );
  }
};

/**
 * Fetch listings created by the authenticated user
 */
const getMyListings = async (params = {}) => {
  try {
    const response = await api.get("/listings/mine", { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch your listings"
    );
  }
};

/**
 * Create a new produce listing
 */
const createListing = async (listingData) => {
  try {
    const response = await api.post("/listings", listingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create listing"
    );
  }
};

/**
 * Update an existing listing by ID
 */
const updateListing = async (id, listingData) => {
  try {
    const response = await api.patch(`/listings/${id}`, listingData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update listing"
    );
  }
};

/**
 * Cancel or soft-delete a listing by ID
 */
const cancelListing = async (id) => {
  try {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel listing"
    );
  }
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