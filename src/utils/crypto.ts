import CryptoJS from "crypto-js";

const secretKey =
  process.env.NEXT_PUBLIC_CRYPTO_KEY ||
  "if_none_is_defined_ad32$5AD2dsfd%/dfk&&sdf@5S8dsf86";

export const encrypt = (data: any) => {
  const plainText = JSON.stringify(data);
  const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();

  return cipherText;
};

export const decrypt = (cipherText: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plainText);
};
