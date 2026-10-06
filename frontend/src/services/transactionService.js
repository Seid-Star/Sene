import api from "./api";

/**
 * Initiate a new transaction for a produce listing
 */
const createTransaction = async ({ listingId, note, quantity }) => {
  try {
    const response = await api.post("/transactions", {
      listingId,
      note,
      ...(quantity && { quantity }),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create transaction",
    );
  }
};

/**
 * Fetch all transactions for the current user with optional filters
 */
const getTransactions = async (params = {}) => {
  try {
    const response = await api.get("/transactions", { params });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions",
    );
  }
};

/**
 * Fetch details of a specific transaction by ID
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
 * Accept a pending transaction offer (Seller action)
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
 * Reject a pending transaction offer (Seller action)
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
 * Cancel a transaction with a specified reason
 */
const cancelTransaction = async (id, reason) => {
  try {
    const response = await api.patch(`/transactions/${id}/cancel`, { reason });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to cancel transaction",
    );
  }
};

/**
 * Trigger payment processing for a transaction (via Links.et or internal service)
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
 * Mark a transaction as completed (e.g., after produce delivery/pickup)
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
