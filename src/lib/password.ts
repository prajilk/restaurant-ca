import crypto from "crypto";

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET; // Your encryption secret
const ALGORITHM = "aes-256-cbc"; // AES encryption algorithm
const IV_LENGTH = 16; // Initialization vector length for AES-256-CBC

if (!ENCRYPTION_SECRET) {
    throw new Error("ENCRYPTION_SECRET environment variable is not set");
}

// Ensure the key is exactly 32 bytes by hashing it
const encryptionKey = crypto
    .createHash("sha256")
    .update(ENCRYPTION_SECRET)
    .digest();

// Encrypt the password
function encryptPassword(password: string) {
    const iv = crypto.randomBytes(IV_LENGTH); // Generate a random IV
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);

    let encrypted = cipher.update(password, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Return both the encrypted password and the IV used for encryption
    return {
        encryptedPassword: encrypted,
        iv: iv.toString("hex"),
    };
}

// Decrypt the password
function decryptPassword(encryptedPassword: string, iv: string) {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        encryptionKey,
        Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(encryptedPassword, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

export { encryptPassword, decryptPassword };
