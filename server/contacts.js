import axios from "axios";
import { baseURL } from "./base";

export async function contacts(
  firstName,
  lastName,
  email,
  phone,
  attendees,
  type
) {
  try {
    const response = await axios.post(`${baseURL}/contacts`, {
      firstName,
      lastName,
      email,
      phone,
      attendees,
      type,
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (error.response) {
      // Handle server errors
      return {
        success: false,
        status: error.response.status,
        message:
          error.response.data.message ||
          "An error occurred while processing your request.",
      };
    } else if (error.request) {
      // Handle no response received
      return {
        success: false,
        message: "No response received from the server.",
      };
    } else {
      // Handle other errors
      return { success: false, message: `Error: ${error.message}` };
    }
  }
}
