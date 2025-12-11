import axios from "axios";
import { baseURL } from "./base";

export async function order(
  attendeeName,
  email,
  fees,
  quantity,
  subTotal,
  ticketType,
  ticketPrice,
  eventName,
  affiliateCode
) {
  const payload = {
    orders: [
      {
        attendeeName,
        email,
        fees,
        quantity,
        subTotal,
        ticketType,
        ticketPrice,
      },
    ],
    eventName,
  };

  // Only add affiliateCode if it exists and is valid
  if (
    affiliateCode &&
    affiliateCode !== "null" &&
    affiliateCode !== "undefined" &&
    affiliateCode.trim() !== ""
  ) {
    payload.affiliateCode = affiliateCode;
  }

  const response = await axios.post(`${baseURL}/orders`, payload);

  return response.data;
}
