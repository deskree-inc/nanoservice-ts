import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

class LocalTokenManager {
	private storageDir: string;
	private tokenFile: string;

	constructor() {
		// Set up secure storage directory
		this.storageDir = path.join(os.homedir(), ".blokctl/token");
		this.tokenFile = path.join(this.storageDir, "token.enc");

		// Ensure storage directory exists with proper permissions
		this.ensureStorage();
	}

	private ensureStorage() {
		try {
			// Create directory if it doesn't exist (with secure permissions)
			if (!fs.existsSync(this.storageDir)) {
				fs.mkdirSync(this.storageDir, { mode: 0o700 }); // rwx for owner only
			} else {
				// Fix existing directory permissions if needed
				fs.chmodSync(this.storageDir, 0o700);
			}

			// Create empty token file if it doesn't exist (with secure permissions)
			if (!fs.existsSync(this.tokenFile)) {
				fs.writeFileSync(this.tokenFile, "", { mode: 0o600 }); // rw for owner only
			} else {
				// Fix existing file permissions if needed
				fs.chmodSync(this.tokenFile, 0o600);
			}
		} catch (error) {
			console.error("Failed to initialize secure storage:", (error as Error).message);
			throw new Error("Could not set up secure token storage, please check permissions.");
		}
	}

	private getEncryptionKey() {
		// In production, you should get this from a more secure source
		// For local development, we'll derive it from machine ID + salt
		const machineId = os.hostname();
		const salt = crypto
			.createHash("sha256")
			.update(os.userInfo().username + os.arch() + os.platform())
			.digest("hex");
		return crypto.scryptSync(machineId + salt, "salt", 32);
	}

	private encrypt(text: string): string {
		const iv: Buffer = crypto.randomBytes(16);
		const cipher: crypto.CipherGCM = crypto.createCipheriv("aes-256-gcm", this.getEncryptionKey(), iv);
		let encrypted: string = cipher.update(text, "utf8", "hex");
		encrypted += cipher.final("hex");
		const authTag: string = cipher.getAuthTag().toString("hex");
		return `${iv.toString("hex")}:${authTag}:${encrypted}`;
	}

	private decrypt(encryptedText: string): string {
		const parts = encryptedText.split(":");
		if (parts.length !== 3) {
			throw new Error("Invalid encrypted text format");
		}
		const [ivHex, authTagHex, encrypted]: [string, string, string] = parts as [string, string, string];
		const iv: Buffer = Buffer.from(ivHex, "hex");
		const authTag: Buffer = Buffer.from(authTagHex, "hex");
		const decipher: crypto.DecipherGCM = crypto.createDecipheriv("aes-256-gcm", this.getEncryptionKey(), iv);
		decipher.setAuthTag(authTag);
		let decrypted: string = decipher.update(encrypted, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return decrypted;
	}

	storeToken(token: string): boolean {
		try {
			const encrypted: string = this.encrypt(token);
			fs.writeFileSync(this.tokenFile, encrypted, { mode: 0o600 }); // rw only for owner
			return true;
		} catch (error: unknown) {
			console.error("Failed to store token:", (error as Error).message);
			return false;
		}
	}

	getToken() {
		try {
			if (!fs.existsSync(this.tokenFile)) return null;
			const encrypted = fs.readFileSync(this.tokenFile, "utf8");
			return this.decrypt(encrypted);
		} catch (error) {
			return null;
		}
	}

	clearToken() {
		try {
			if (fs.existsSync(this.tokenFile)) {
				fs.unlinkSync(this.tokenFile);
			}
			return true;
		} catch (error) {
			console.error("Failed to clear token:", (error as Error).message);
			return false;
		}
	}
}

// Singleton instance
const tokenManager = new LocalTokenManager();
export { LocalTokenManager, tokenManager };
