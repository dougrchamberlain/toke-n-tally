// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAVd49dNPZLCcvhcCdNXYMBA_m5aUCLxvI",
  authDomain: "toke-n-tally.firebaseapp.com",
  projectId: "toke-n-tally",
  storageBucket: "toke-n-tally.appspot.com",
  messagingSenderId: "615572921940",
  appId: "1:615572921940:web:6ca2349edc6709138117c1",
  measurementId: "G-HXRW78QVJ2",
};

function fractionToNumber(fraction = "") {
  const fractionParts = fraction.split("/");
  const numerator = fractionParts[0] || "0";
  const denominator = fractionParts[1] || "1";
  const radix = 10;
  const number = parseInt(numerator, radix) / parseInt(denominator, radix);
  const result = number || 0;

  return result;
}

const DUTCHIE_EMBEDDED_URL = "https://dutchie.com";
const DUTCHIE_addProduct = "add_to_cart";
const DUTCHIE_removeProduct = "remove_from_cart";

// Initialize Firebase
export {
  config,
  fractionToNumber,
  DUTCHIE_EMBEDDED_URL,
  DUTCHIE_addProduct,
  DUTCHIE_removeProduct,
};
