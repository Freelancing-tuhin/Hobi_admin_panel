const SECRET_KEY = 7; // Must match backend

export const decryptDataFrontend = (encoded: string): string => {
  const decoded = atob(encoded); // base64 decode
  let decrypted = '';

  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) - SECRET_KEY);
  }

  return decrypted;
};
