import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Decode the session secret correctly (base64 -> Uint8Array)
const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}

// Decode the base64 secret key to a Uint8Array
const encodedKey = new Uint8Array(Buffer.from(secretKey, "base64"));

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiration time to 7 days
  const session = await encrypt({ userId, expiresAt });

  // Set the session cookie with the encrypted token
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure cookies are secure in production
    expires: expiresAt,
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey); // Sign the JWT with the decoded key
}

export async function decrypt(session: string | undefined = "") {
  // console.log("**********************");
  // console.log("Session inside Decrypt", session);
  // console.log("Encoded Key inside Decrypt", encodedKey);
  // console.log("**********************");

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload; // Return the decoded payload
  } catch (error) {
    console.log("Failed to verify session", error); // Log detailed error message for debugging
    return null; // Return null if verification fails
  }
}
