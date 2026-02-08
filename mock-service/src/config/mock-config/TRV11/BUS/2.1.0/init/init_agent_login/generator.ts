import { SessionData } from "../../../../session-types";

export async function initGenerator(existingPayload: any, sessionData: SessionData) {
  try {
    return existingPayload;
  } catch (err) {
    console.error("Error in initUnlimitedPassGenerator:", err);
    throw err;
  }
}
