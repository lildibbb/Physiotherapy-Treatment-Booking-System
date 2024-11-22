export const handleExpiredSession = (message: string) => {
  console.warn(message);
  window.location.href = "/login";
};
