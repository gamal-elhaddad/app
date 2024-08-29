import { parsePhoneNumber } from "libphonenumber-js";

export  const getInitialCountryCode = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return "+973";
    try {
        const parsedNumber = parsePhoneNumber(phoneNumber);

        return `+${parsedNumber.countryCallingCode}`;
    } catch (error) {
        console.error("Error parsing phone number:", error);
        
        return "+973";
    }
};