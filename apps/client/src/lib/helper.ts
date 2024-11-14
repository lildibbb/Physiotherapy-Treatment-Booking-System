export const handleExpiredSession = (message: string) => {
  console.warn(message);
  // Redirect to the login page
  window.location.href = "/login";
};
