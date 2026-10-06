const normalizeVoiceResult = (result) => {
  if (!result) {
    return {
      success: false,
      message: "No response received.",
    };
  }

  return result;
};

const getVoiceErrorMessage = (error, fallback = "Something went wrong.") => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export {
  normalizeVoiceResult,
  getVoiceErrorMessage,
};