package org.example.utils;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Base64;

public class KeyGeneratorUtil {

    public static String generateAESKey() throws Exception {
        // Create a KeyGenerator instance for AES
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");

        // Initialize the KeyGenerator with a specific key size (e.g., 128, 192, or 256 bits)
        keyGen.init(256); // 256-bit key for AES-256

        // Generate the secret key
        SecretKey secretKey = keyGen.generateKey();

        // Convert the key to a Base64-encoded string for storage
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    public static void main(String[] args) throws Exception {
        // Generate a secure AES key
        String secretKey = generateAESKey();
        System.out.println("Generated AES Key: " + secretKey);
    }
}