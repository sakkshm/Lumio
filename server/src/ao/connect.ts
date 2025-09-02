import { readFileSync } from "node:fs";
import * as path from "path";
import { addModerationMessage } from "./moderationMessageMap";
import * as crypto from "node:crypto";

import {
  result,
  results,
  message,
  spawn,
  monitor,
  unmonitor,
  dryrun,
  createDataItemSigner
} from "@permaweb/aoconnect/node";

// Function to convert JWK to PEM format
function jwkToPem(jwk: any): string {
  try {
    console.log('Converting JWK to PEM format...');
    
    // Create a KeyObject from the JWK
    const keyObject = crypto.createPrivateKey({
      key: jwk,
      format: 'jwk'
    });
    
    // Export as PEM
    const pemKey = keyObject.export({
      type: 'pkcs8',
      format: 'pem'
    });
    
    console.log('JWK to PEM conversion successful ✓');
    return pemKey as string;
  } catch (error) {
    console.error('Error converting JWK to PEM:', error);
    throw new Error(`Failed to convert JWK to PEM: ${error}`);
  }
}

// Wallet validation function
function validateWallet(wallet: any) {
  console.log('Validating wallet...');
  const requiredFields = ['kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'];
  
  for (const field of requiredFields) {
    if (!wallet[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (wallet.kty !== 'RSA') {
    throw new Error(`Unsupported key type: ${wallet.kty}`);
  }
  
  console.log('Wallet validation passed ✓');
  return wallet;
}

// Async wallet loader with caching
let walletCache: any = null;

async function getWallet(): Promise<any> {
  if (walletCache) return walletCache;
  
  try {
    let jwkWallet;
    
    if (process.env.WALLET_JSON) {
      console.log('Loading wallet from environment variable...');
      jwkWallet = validateWallet(JSON.parse(process.env.WALLET_JSON));
    } else {
      console.log('Loading wallet from file...');
      const walletPath = path.join(__dirname, "wallet.json");
      jwkWallet = validateWallet(JSON.parse(readFileSync(walletPath).toString()));
    }
    
    // Convert JWK to PEM format for aoconnect compatibility
    const pemKey = jwkToPem(jwkWallet);
    
    // Cache the converted wallet
    walletCache = {
      ...jwkWallet,
      pemKey: pemKey
    };
    
    return walletCache;
  } catch (error) {
    console.error('Error loading wallet:', error);
    throw error;
  }
}

// Fix the undefined issue by adding validation
const moderationProcessID = process.env.MODERATION_AO_PROCESS;
if (!moderationProcessID) {
  throw new Error('MODERATION_AO_PROCESS environment variable is not set');
}

export async function sendMessageforModeration(
  serverID: string, 
  chatId: string, 
  userId: string, 
  chatMessageId: string, 
  messageText: string, 
  platform: string
) {
  try {
    const wallet = await getWallet();
    console.log('Sending message for moderation:', messageText);
    
    const messageId = await message({
      process: moderationProcessID!,
      tags: [
        { name: "Action", value: "Moderate" },
        { name: "Server", value: serverID },
      ],
      signer: createDataItemSigner(wallet),
      data: messageText
    });
    
    console.log('Message sent successfully:', messageId);
    addModerationMessage(messageId, serverID, chatId, userId, chatMessageId, messageText, platform);
    
  } catch (error) {
    console.error('Error in sendMessageforModeration:', error);
    throw error;
  }
}

export async function setModerationConfig(
  serverID: string, 
  strictness: string, 
  bannedWords: string
) {
  try {
    const wallet = await getWallet();
    console.log('Setting moderation config...');
    
    const messageId = await message({
      process: moderationProcessID!,
      tags: [
        { name: "Action", value: "SetConfig" },
        { name: "Server", value: serverID },
        { name: "Strictness", value: strictness.toString() },
        { name: "BannedWords", value: bannedWords },
      ],
      signer: createDataItemSigner(wallet),
      data: ""
    });
    
    console.log("Config set:", messageId);
  } catch (error) {
    console.error('Error in setModerationConfig:', error);
    throw error;
  }
}
