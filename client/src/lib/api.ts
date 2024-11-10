const apiBaseUrl = "http://localhost:5431/api";

// Fetch data from the API
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${apiBaseUrl}/auth/register/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role: "patient", // Set default role
      associatedID: "", // Set associatedID as an empty string
    }),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }

  return await response.json();
};

export const registerBusinessUser = async (
  personInChargeName: string,
  contactEmail: string,
  contactPhone: string,
  companyName: string,
  businessRegistrationNumber: string,
  contractSigneeName: string,
  contractSigneeNRIC: string,
  businessAddress: string,
  state: string,
  city: string,
  postalCode: string
) => {
  const response = await fetch(`${apiBaseUrl}/auth/register/business`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personInChargeName,
      contactEmail,
      contactPhone,
      companyName,
      businessRegistrationNumber,
      contractSigneeName,
      contractSigneeNRIC,
      businessAddress,
      state,
      city,
      postalCode,
    }),
  });
  // Check if email already exists
  if (response.status === 409) {
    // Assuming 409 means conflict (email exists)
    throw new Error("Email is already in use");
  }
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }

  return await response.json();
};

export const registerStaff = async (
  email: string,
  password: string,
  name: string,
  role: string
) => {
  const response = await fetch(`${apiBaseUrl}/register/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ email, password, name, role }),
  });
  //check if email already exist
  if (response.status === 409) {
    throw new Error("Email is already in use");
  }
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }
  return await response.json();
};

export const registerTherapist = async (
  email: string,
  password: string,
  name: string,
  specialization: string,
  contactDetails: string
) => {
  const response = await fetch(`${apiBaseUrl}/register/physiotherapist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      email,
      password,
      name,
      specialization,
      contactDetails,
    }),
  });

  //check if email already exist
  if (response.status === 409) {
    throw new Error("Email is already in use");
  }
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }
  return await response.json();
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

  return await response.json();
};

export const fetchStaffDetails = async () => {
  const response = await fetch(`${apiBaseUrl}/auth/staff`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch staff details");
  }
  return await response.json();
};

export const updateStaffDetails = async (
  staffID: string,
  email: string,
  password: string,
  name: string,
  role: string
) => {
  try {
    const response = await fetch(`${apiBaseUrl}/auth/staff/${staffID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ email, password, name, role }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update staff details");
    }

    // Return parsed response data if needed
    return await response.json();
  } catch (error) {
    console.error("Error updating staff details:", error);
    throw error;
  }
};

export const fetchTherapistDetails = async () => {
  const response = await fetch(`${apiBaseUrl}/auth/therapist`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Therapist details");
  }
  return await response.json();
};

export const updateTherapistDetails = async (
  therapistID: string,
  email: string,
  password: string,
  name: string,
  specialization: string,
  contactDetails: string
) => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/auth/therapist/${therapistID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email,
          password,
          name,
          specialization,
          contactDetails,
        }),
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update therapist details");
    }

    // Return parsed response data if needed
    return await response.json();
  } catch (error) {
    console.error("Error updating therapist details:", error);
    throw error;
  }
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
