export const checkServerHealth = async () => {
  try {
    const response = await fetch("/api/health");
    return response.ok;
  } catch {
    return false;
  }
};
