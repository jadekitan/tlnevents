import axios from "axios";
import { baseURL } from "./base";

export async function merch(
  name,
  productName,
  email,
  phone,
  size,
  color,
  quantity,
  price,
  total
) {
  try {
    const response = await axios.post(`${baseURL}/merch `, {
      name,
      productName,
      email,
      phone,
      size,
      color,
      quantity,
      price,
      total,
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
    // Return the data from the response
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside of the range of 2xx
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.message || "Something went wrong",
      };
    } else if (error.request) {
      // The request was made but no response was received
      return { success: false, message: "No response received from server" };
    } else {
      // Something happened in setting up the request
      return { success: false, message: error.message };
    }
  }
}
