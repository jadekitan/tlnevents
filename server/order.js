import axios from "axios";
import { baseURL } from "./base";

export async function order(payload) {
  // Debug: Check exactly what is being sent
  console.log("📤 Order service sending payload:", payload);

  // We pass 'payload' directly.
  // Since we already handled the logic in the component,
  // 'payload' contains eventName, affiliateCode, orders, etc.
  const response = await axios.post(`${baseURL}/orders`, payload);

  return response.data;
}
