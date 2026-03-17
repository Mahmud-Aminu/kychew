export interface OPayAmount {
  currency: string;
  total: number;
}

export interface OPayProduct {
  description: string;
  name: string;
}

export interface OPayUserInfo {
  userEmail: string;
  userId: string;
  userMobile: string;
  userName: string;
}

export interface OPayCheckoutRequest {
  amount: OPayAmount;
  callbackUrl: string;
  cancelUrl: string;
  country: string;
  customerVisitSource: 'IOS' | 'ANDROID' | 'WEB';
  evokeOpay: boolean;
  expireAt: number;
  sn: string;
  payMethod: string;
  product: OPayProduct;
  reference: string;
  returnUrl: string;
  userInfo: OPayUserInfo;
}

export interface OPayCheckoutResponse {
  code: string;
  message: string;
  data: {
    reference: string;
    orderNo: string;
    cashierUrl: string;
    status: string;
    amount: string;
    currency: string;
  };
}
