import api from "./api";

/**
 * Create a new transaction for a produce listing
 */
const createTransaction = async ({ listingId, note }) => {
  try {
    const response = await api.post("/transactions", {
      listingId,
      ...(note && { note }),
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create transaction",
    );
  }
};

/**
 * Fetch transactions for the current user
 * Optional filters: role, status, page, limit
 */
const getTransactions = async (params = {}) => {
  try {
    const response = await api.get("/transactions", {
      params,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions",
    );
  }
};

/**
 * Fetch a specific transaction by ID
 */
const getTransaction = async (id) => {
  try {
    const response = await api.get(`/transactions/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Transaction #${id} not found`,
    );
  }
};

/**
 * Accept a transaction request
 * Seller action
 */
const acceptTransaction = async (id) => {
  try {
    const response = await api.patch(`/transactions/${id}/accept`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to accept transaction",
    );
  }
};

/**
 * Reject a transaction request
 * Seller action
 */
const rejectTransaction = async (id) => {
  try {
    const response = await api.patch(`/transactions/${id}/reject`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reject transaction",
    );
  }
};

/**
 * Cancel a transaction
 * Buyer or seller action
 */
const cancelTransaction = async (id, reason) => {
  try {
    const response = await api.patch(`/transactions/${id}/cancel`, {
      ...(reason && { reason }),
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel transaction",
    );
  }
};

/**
 * Initiate payment for an accepted transaction
 * Buyer action
 */
const payTransaction = async (id) => {
  try {
    const response = await api.post(`/transactions/${id}/pay`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Payment processing failed",
    );
  }
};

/**
 * Mark a paid transaction as completed
 * Buyer action
 */
const completeTransaction = async (id) => {
  try {
    const response = await api.patch(`/transactions/${id}/complete`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to complete transaction",
    );
  }
};

export {
  createTransaction,
  getTransactions,
  getTransaction,
  acceptTransaction,
  rejectTransaction,
  cancelTransaction,
  payTransaction,
  completeTransaction,
};