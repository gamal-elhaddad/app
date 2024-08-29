import { PaymentMethods } from "src/types/apps/booking";

export const paymentMethods = [
    { value: PaymentMethods.Cash, label: "Cash" },
    { value: PaymentMethods.Tap, label: "Credit Card" },
    { value: PaymentMethods.ApplePay, label: "Apple Pay" },
];
