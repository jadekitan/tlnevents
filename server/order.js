import axios from "axios";
import { baseURL } from "./base";

export async function order(
  referenceNumber,
  attendeeName,
  email,
  fees,
  quantity,
  subTotal,
  ticketType,
  ticketPrice
) {
  const response = await axios.post(`${baseURL}/orders`, {
    referenceNumber,
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
  });
  return response.data;
}
