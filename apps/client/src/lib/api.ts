import {
  AppointmentPayload,
  AvailabilityPayload,
  ExercisePayload,
  TreatmentPayload,
} from "@/types/types";
import { handleExpiredSession } from "./helper";

const apiBaseUrl = import.meta.env.VITE_ENDPOINT_BASE_URL;
console.log("apiBaseUrl: " + apiBaseUrl);
// Fetch data from the API
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  contactDetails: string
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
      contactDetails,
    }),
  });
  if (response.status === 409) {
    const errorData = await response.json();
    const fieldConflicts = errorData.field || [];

    // Build an object of field-specific errors
    const errorDetails: Record<string, string> = {};
    if (fieldConflicts.includes("Contact details")) {
      errorDetails.contactDetails = "Contact details are already in use.";
    }
    if (fieldConflicts.includes("Email")) {
      errorDetails.email = "Email is already in use.";
    }

    throw errorDetails; // Throw an object containing field-specific errors
  }
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
  const response = await fetch(`${apiBaseUrl}/business/register`, {
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
  if (response.status === 409) {
    const errorData = await response.json();
    const fieldConflicts = errorData.field || [];

    // Build an object of field-specific errors
    const errorDetails: Record<string, string> = {};
    if (fieldConflicts.includes("Contact details")) {
      errorDetails.contactDetails = "Contact details are already in use.";
    }
    if (fieldConflicts.includes("Email")) {
      errorDetails.email = "Email is already in use.";
    }

    throw errorDetails; // Throw an object containing field-specific errors
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
  role: string,
  contactDetails: string
) => {
  const requestBody = { email, password, name, role, contactDetails };
  console.log("API Request Body:", requestBody); // New Log
  const response = await fetch(`${apiBaseUrl}/staff/register`, {
    method: "POST",
    credentials: "include", // Bagi auth cookie auto included with request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.message);
    return;
  }
  //check if email already exist
  if (response.status === 409) {
    throw new Error("Email is already in use");
  }
  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error response:", errorMessage);
    throw new Error("Failed to register");
  }
  const data = await response.json();
  console.log("data:", data);
  return data;
};

export const registerTherapist = async (
  email: string,
  password: string,
  name: string,
  specialization: string,
  contactDetails: string,
  rate: number
) => {
  const response = await fetch(`${apiBaseUrl}/therapist/register`, {
    method: "POST",
    credentials: "include", // Bagi auth cookie auto included with request
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      specialization,
      contactDetails,
      rate,
    }),
  });
  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.message);
    return;
  }
  if (response.status === 409) {
    const errorData = await response.json();
    const fieldConflicts = errorData.field || [];

    // Build an object of field-specific errors
    const errorDetails: Record<string, string> = {};
    if (fieldConflicts.includes("Contact details")) {
      errorDetails.contactDetails = "Contact details are already in use.";
    }
    if (fieldConflicts.includes("Email")) {
      errorDetails.email = "Email is already in use.";
    }

    throw errorDetails; // Throw an object containing field-specific errors
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
    credentials: "include",
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
  const response = await fetch(`${apiBaseUrl}/staff/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.message);
  }
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
    const response = await fetch(`${apiBaseUrl}/staff/${staffID}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, role }),
    });
    //check if token is expired or not
    if (response.status === 401) {
      const data = await response.json();
      handleExpiredSession(data.error);
      console.log("Session expired:", data.error);
      return;
    }
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
  const response = await fetch(`${apiBaseUrl}/therapist/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
  });

  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch Therapist details");
  }
  return await response.json();
};

export const updateTherapistDetails = async (
  therapistID: string,
  email: string,
  password: string,
  name: string,
  specialization: string,
  contactDetails: string,
  rate: number
) => {
  try {
    const response = await fetch(`${apiBaseUrl}/therapist/${therapistID}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
        specialization,
        contactDetails,
        rate,
      }),
    });
    console.log(response);
    //check if token is expired or not
    if (response.status === 401) {
      const data = await response.json();
      handleExpiredSession(data.error);
      console.log("Session expired:", data.error);
      return;
    }
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

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send email");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to request password reset");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const url = `${apiBaseUrl}/reset-password`;
    console.log("Attempting to call reset password endpoint:", url);

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    // Check if response is okay
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reset password");
    }

    // Extract JSON data from response
    const data = await response.json(); // This parses the JSON body from the response
    console.log("Response from backend:", data); // Should log the backend response with `email` and `name`

    // Log the specific fields to verify
    console.log("Email:", data.email, "Name:", data.name);
    return data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const fetchAllTherapistPublic = async () => {
  const response = await fetch(`${apiBaseUrl}/therapist/public`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch therapist details");
  }
  return await response.json();
};

export const fetchTherapistDetailsByID = async (therapistID: number) => {
  const response = await fetch(`${apiBaseUrl}/therapist/${therapistID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch therapist details");
  }
  return await response.json();
};

export const fetchTherapistAvailability = async (therapistID: number) => {
  const response = await fetch(
    `${apiBaseUrl}/therapist/${therapistID}/availability`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // Check for 404 or non-JSON responses
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text);
  }

  const data = await response.json();
  return data.availableSlots || [];
};
export const createAppointment = async (payLoad: AppointmentPayload) => {
  const response = await fetch(`${apiBaseUrl}/booking/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payLoad),
  });
  // check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    const contentType = response.headers.get("content-type");

    // Check if the response is JSON
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create appointment");
    } else {
      // Handle plain text or unexpected responses
      const errorText = await response.text();
      throw new Error(errorText || "Failed to create appointment");
    }
  }

  const data = await response.json();
  console.log("Data from backend:", data);
  return data;
};

export const createCheckoutSession = async (
  appointmentID: number,
  rate: string
) => {
  const response = await fetch(`${apiBaseUrl}/payment/checkout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ appointmentID, rate }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create checkout session");
  }
  const data = await response.json();
  console.log("Data from backend:", data.data.url);
  return data.data.url;
};

export const fulfillCheckoutRequest = async (sessionID: string) => {
  const response = await fetch(`${apiBaseUrl}/payment/success`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionID }),
  });
  console.log("Response from {api ts}:", response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fulfill checkout request");
  }
  const data = await response.json();
  console.log("Data from {api ts}:", data);
  return data;
};

export const fetchAppointments = async () => {
  const response = await fetch(`${apiBaseUrl}/booking/appointment`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.status);
  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return await response.json();
};

export const fetchAppointmentByID = async (appointmentID: number) => {
  const response = await fetch(
    `${apiBaseUrl}/booking/appointment/${appointmentID}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.status);
  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (response.status === 404) {
    throw new Error("Appointment not found");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }
  return await response.json();
};

export const fetchUserProfile = async () => {
  const response = await fetch(`${apiBaseUrl}/auth/profile`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }); //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await response.json();
};

interface UpdateUserProfileParams {
  name?: string;
  contactDetails?: string;
  dob?: Date;
  gender?: string;
  password?: string;
  avatarFile?: File;
  specialization?: string;
  qualification?: string[];
  experience?: number;
  language?: string[];
  about?: string;
}

export const updateUserProfile = async ({
  name,
  contactDetails,
  dob,
  gender,
  password,
  avatarFile,
  specialization,
  qualification,
  experience,
  language,
  about,
}: UpdateUserProfileParams) => {
  const formData = new FormData();

  if (name) formData.append("name", name);
  if (contactDetails) formData.append("contactDetails", contactDetails);
  if (dob) formData.append("dob", dob.toISOString().split("T")[0]);
  if (gender) formData.append("gender", gender);
  if (password) formData.append("password", password);
  if (avatarFile) formData.append("avatarFile", avatarFile);
  if (specialization) formData.append("specialization", specialization);
  // Append each qualification individually
  if (qualification && qualification.length > 0) {
    qualification.forEach((q) => formData.append("qualification", q));
  }

  // if (experience) {
  //   formData.append("experience", experience.toString());
  // }

  if (experience !== undefined) {
    formData.append("experience", experience.toString()); // "0", "5", etc.
  } else {
    // Optionally handle invalid or missing 'experience'
    formData.append("experience", "0"); // Default to "0" if undefined or invalid
  }
  // Append each language individually
  if (language && language.length > 0) {
    language.forEach((lang) => formData.append("language", lang));
  }
  if (about) formData.append("about", about);
  const response = await fetch(`${apiBaseUrl}/auth/profile`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });
  console.log(response.body);
  //check if token is expired or not
  if (response.status === 401) {
    const data = await response.json();

    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update profile");
  }

  return response.json();
};

//TODO: AuthContext
export const checkSession = async () => {
  const response = await fetch(`${apiBaseUrl}/check-session`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("response {apiCheckSession:", response);

  if (!response.ok) {
    throw new Error("Failed to check session");
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${apiBaseUrl}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("response {apiLogoutUser:", response);
  if (response.status === 401) {
    const data = await response.json();

    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    throw new Error("Failed to log out");
  }
  return response.json();
};

export const getDataTherapistForStaff = async () => {
  const response = await fetch(
    `${apiBaseUrl}/therapist/data-and-availability`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("response {apiGetDataTherapistForStaff:", response);
  if (!response.ok) {
    throw new Error("Failed to get data for staff");
  }
  return response.json();
};

// TODO : UI FOR STAFF UPDATE AVAILBILITY
export const updateAvailability = async (payLoad: AvailabilityPayload[]) => {
  const response = await fetch(`${apiBaseUrl}/therapist/availability`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payLoad),
  });
  console.log("Response from {api.ts}:", response);
  if (response.status === 401) {
    const data = await response.json();

    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update availability");
  }
  const data = await response.json();
  console.log("Data from {api.ts}:", data);
  return data;
};

export const getTreatmentPlan = async (appointmentID: number) => {
  const response = await fetch(
    `${apiBaseUrl}/treatment-plan/${appointmentID}/treatment-plan`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 401) {
    const data = await response.json();

    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  console.log("Response from {api.ts getTreatmentPlan}:", response);
  if (!response.ok) {
    throw new Error("Failed to get treatment plan");
  }
  return response.json();
};

export const createTreatmentPlan = async (
  appointmentID: number,
  payload: TreatmentPayload
) => {
  const response = await fetch(
    `${apiBaseUrl}/treatment-plan/${appointmentID}/create-treatment-plan`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ appointmentID, ...payload }),
    }
  );
  console.log("Payload being sent to the server:", {
    appointmentID,
    ...payload,
  });
  console.log("Response from {api.ts createTreatmentPlan}:", response);
  if (!response.ok) {
    throw new Error("Failed to create treatment plan");
  }
  return response.json();
};

export const createExercise = async (payload: ExercisePayload) => {
  const response = await fetch(`${apiBaseUrl}/treatment-plan/exercise/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("Response from {api.ts createExercise}:", response);
  if (!response.ok) {
    throw new Error("Failed to create exercise");
  }
  return response.json();
};

export const fetchExerciseByID = async (planID: number) => {
  const response = await fetch(
    `${apiBaseUrl}/treatment-plan/exercise/${planID}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("Response from {api.ts fetchExerciseByID}:", response);
  if (!response.ok) {
    throw new Error("Failed to fetch exercise by ID");
  }
  return response.json();
};

export const cancelAppointment = async (payload: { appointmentID: number }) => {
  const response = await fetch(`${apiBaseUrl}/booking/cancel`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("Response from {api.ts handleCancellation}:", response);
  if (response.status === 401) {
    const data = await response.json();
    handleExpiredSession(data.error);
    console.log("Session expired:", data.error);
    return;
  }
  if (!response.ok) {
    throw new Error("Failed to cancel appointment");
  }
  return response.json();
};

export interface PushSubscriptions {
  endpoint: string;

  keys: {
    p256dh: string;
    auth: string;
  };
}
export const subscribeToNotifications = async (
  subscription: PushSubscriptions
) => {
  try {
    const response = await fetch(`${apiBaseUrl}/notifications/subscribe`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to subscribe to notifications"
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error subscribing to notifications:", error);
    throw new Error("Network error or server is unavailable");
  }
};

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}

export interface NotificationResponse {
  message: string;
  total: number;
  failed: number;
  errors: Array<{
    success: boolean;
    error: string;
    endpoint: string;
  }>;
}

// Function to send a notification
export const sendNotification = async (
  payload: NotificationPayload
): Promise<NotificationResponse> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/notifications/send-notification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send notification.");
    }

    return response.json();
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new Error("Failed to send notification. Please try again.");
  }
};

export const createMeetingLink = async (
  meetingLink: string,
  appointmentID: number
) => {
  const response = await fetch(
    `${apiBaseUrl}/treatment-plan/${appointmentID}/meeting-link`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ meetingLink }),
    }
  );
  console.log("Response from {api.ts createMeetingLink}:", response);
  if (!response.ok) {
    throw new Error("Failed to create meeting link");
  }
  return response.json();
};
