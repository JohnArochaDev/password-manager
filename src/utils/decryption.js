import CryptoJS from 'crypto-js';

// Function to decrypt data
export default function decryptData(encryptedData, base64Key) {
    // Decode the base64 encoded key
    const decodedKey = CryptoJS.enc.Base64.parse(base64Key);

    // Decode the base64 encoded encrypted data
    const decodedEncryptedData = CryptoJS.enc.Base64.parse(encryptedData);

    // Decrypt the data
    const decryptedData = CryptoJS.AES.decrypt(
        { ciphertext: decodedEncryptedData },
        decodedKey,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    // Convert the decrypted data to a string
    return decryptedData.toString(CryptoJS.enc.Utf8);
}