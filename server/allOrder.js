import axios from "axios";
import { baseURL } from "./base";

export async function getAllOrders() {
  try {
    // Fetch the orders from the API
    const response = await axios.get(`${baseURL}/orders/all`);

    // Validate and sort the response data
    const sortedData = response.data.data
      .filter((order) => order.createdAt) // Ensure createdAt exists
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

    // Return sorted data
    return {
      success: true,
      message: response.data.message || "Orders fetched successfully",
      data: sortedData,
    };
  } catch (error) {
    // Handle errors gracefully
    if (error.response) {
      // Server responded with an error
      return {
        success: false,
        message: error.response.data.message || "Something went wrong",
      };
    } else if (error.request) {
      // No response received
      return { success: false, message: "No response received from server" };
    } else {
      // Other errors (e.g., network issues)
      return { success: false, message: error.message };
    }
  }
}
