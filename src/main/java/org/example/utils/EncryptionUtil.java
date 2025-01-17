package org.example.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {

    private static final String ALGORITHM = "AES";
    // Secret key should be exactly 16, 24, or 32 bytes for AES
    private static final String SECRET_KEY = "1234567890123456";

    public static String encrypt(String data) throws Exception {
        // Use the secret key as it is (no need to decode it from Base64)
        byte[] keyBytes = SECRET_KEY.getBytes();
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);

        // Initialize the cipher for encryption
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);

        // Encrypt the data
        byte[] encryptedBytes = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static String decrypt(String encryptedData) throws Exception {
        // Use the secret key as it is (no need to decode it from Base64)
        byte[] keyBytes = SECRET_KEY.getBytes();
        SecretKeySpec keySpec = new SecretKeySpec(keyBytes, ALGORITHM);

        // Initialize the cipher for decryption
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, keySpec);

        // Decrypt the data
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
        return new String(decryptedBytes);
    }
}
