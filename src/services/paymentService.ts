import type { OPayCheckoutRequest, OPayCheckoutResponse } from "../types/payment";

const OPAY_API_URL = import.meta.env.VITE_OPAY_API_URL || "https://testapi.opaycheckout.com/api/v1/international/cashier/create";
const OPAY_SECRET_KEY = import.meta.env.VITE_OPAY_SECRET_KEY;
const OPAY_MERCHANT_ID = import.meta.env.VITE_OPAY_MERCHANT_ID;

export const createOPayCheckout = async (formData: OPayCheckoutRequest): Promise<OPayCheckoutResponse> => {
  const response = await fetch(OPAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPAY_SECRET_KEY}`,
      "MerchantId": OPAY_MERCHANT_ID,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create OPay checkout session");
  }

  return response.json();
};
