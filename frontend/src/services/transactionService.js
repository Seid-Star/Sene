import api from "./api";

const createTransaction = async ({ listingId, note }) => {
  const response = await api.post("/transactions", {
    listingId,
    note,
  });

  return response.data;
};

const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions", {
    params,
  });

  return response.data;
};

const getTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`);

  return response.data;
};

const acceptTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/accept`);

  return response.data;
};

const rejectTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/reject`);

  return response.data;
};

const cancelTransaction = async (id, reason) => {
  const response = await api.patch(`/transactions/${id}/cancel`, {
    reason,
  });

  return response.data;
};

const payTransaction = async (id) => {
  const response = await api.post(`/transactions/${id}/pay`);

  return response.data;
};

const completeTransaction = async (id) => {
  const response = await api.patch(`/transactions/${id}/complete`);

  return response.data;
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