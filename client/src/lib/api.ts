const apiBaseUrl = "http://localhost:5431/api";
// Booking component

// Fetch data from the API
export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      role: "user", // Set default role
      associatedID: "", // Set associatedID as an empty string
    }),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }

  return response.json();
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  return response.json();
};

export const fetchUserAppointments = async (token: string | null) => {
  return await fetch(`${apiBaseUrl}/appointments/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchHospitals = async () => {
  const response = await fetch(`${apiBaseUrl}/hospitals`);
  if (!response.ok) {
    throw new Error("Failed to fetch hospitals");
  }
  return await response.json();
};

export const fetchDoctor = async (hospitalId: number) => {
  const response = await fetch(`${apiBaseUrl}/hospitals/${hospitalId}/doctors`);
  if (!response.ok) {
    throw new Error("Failed to fetch doctor");
  }
  return await response.json();
};
