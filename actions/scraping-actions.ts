/**
 * @description
 * This file provides server actions related to Carta scraping.
 * It contains a function that calls the Carta scraper API endpoint to retrieve equity data.
 * 
 * Key Features:
 * - scrapeCartaDataAction: Accepts a userId and credentials, sends them to the API endpoint,
 *   and returns the response data.
 * 
 * @dependencies
 * - ActionState from "@/types" for standard success/failure patterns
 * - auth from "@clerk/nextjs/server" for JWT token authentication
 * 
 * @notes
 * - Credentials are only used for the API call and are not stored
 * - The API endpoint is https://7e29von2h1.execute-api.us-east-1.amazonaws.com/default/carta-scraper
 * - A Clerk JWT token is included in the Authorization header for security
 */

"use server"

import { ActionState } from "@/types"
import { auth } from "@clerk/nextjs/server"

interface CartaCredentials {
  email: string
  password: string
  twoFactorCode?: string
}

/**
 * @function scrapeCartaDataAction
 * @async
 * @description
 *  Makes an API call to the Carta scraper endpoint to retrieve equity data
 *  using user credentials. Includes a Clerk JWT token for authorization.
 * 
 * @param {string} userId - The ID of the user who is attempting to import Carta data.
 * @param {CartaCredentials} credentials - An object containing email, password, and optional 2FA code.
 * @returns {Promise<ActionState<any>>}
 *  - A success or failure result, with the retrieved data on success.
 * 
 * @example
 *  const result = await scrapeCartaDataAction("user_abc", {
 *    email: "test@example.com",
 *    password: "password123",
 *    twoFactorCode: "123456" // Optional
 *  })
 */
export async function scrapeCartaDataAction(
  userId: string,
  credentials: CartaCredentials
): Promise<ActionState<any>> {
  console.log(`scrapeCartaDataAction: Starting for user ${userId.substring(0, 5)}...`);
  
  async function makeRequest(isRetry = false) {
  try {
      console.log(`scrapeCartaDataAction: Getting Clerk JWT token${isRetry ? ' (retry attempt)' : ''}`);
      // Get the authenticated user's JWT token
    const { getToken } = await auth()
      const token = await getToken({ template: isRetry ? "carta_template" : undefined });
      
      // Log token details (truncated for security)
      if (token) {
        const tokenFirstPart = token.substring(0, 15);
        const tokenLastPart = token.substring(token.length - 5);
        console.log(`scrapeCartaDataAction: JWT token obtained: ${tokenFirstPart}...${tokenLastPart} (${token.length} chars)`);
        
        // Check if token looks like a valid JWT (should have 3 parts separated by dots)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.warn("scrapeCartaDataAction: WARNING - Token does not appear to be a valid JWT (should have 3 parts)");
        } else {
          console.log("scrapeCartaDataAction: Token structure appears valid (has 3 parts)");
        }
      } else {
        console.error("scrapeCartaDataAction: No JWT token available");
      }
      
      if (!token) {
        return {
          isSuccess: false,
          message: "Authentication required. Please log in again."
        }
      }
      
      // Prepare the request payload in the specified format
      console.log("scrapeCartaDataAction: Preparing request payload");
      const payload = {
        userId: userId,
        credentials: {
          email: credentials.email,
          password: "********", // Masked for logging
          twoFactorCode: credentials.twoFactorCode ? "******" : undefined
        }
      }
      
      console.log(`scrapeCartaDataAction: Payload prepared with email: ${credentials.email}`);
      console.log(`scrapeCartaDataAction: 2FA code provided: ${credentials.twoFactorCode ? 'Yes' : 'No'}`);
      
      // Restore the actual password for the API call
      const actualPayload = {
        userId: userId,
        credentials: {
          email: credentials.email,
          password: credentials.password,
          twoFactorCode: credentials.twoFactorCode
        }
      }
      
      // Make the API call to the Carta scraper endpoint with the JWT token
      console.log("scrapeCartaDataAction: Making API call to Carta scraper endpoint");
      
      // Get token parts for logging (defined here to fix linter errors)
      const tokenFirstPart = token.substring(0, 15);
      const tokenLastPart = token.substring(token.length - 5);
      
      console.log(`scrapeCartaDataAction: Request headers: ${JSON.stringify({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenFirstPart}...${tokenLastPart}`
      })}`);
      console.log(`scrapeCartaDataAction: Request payload (sanitized): ${JSON.stringify(payload)}`);
      
    const response = await fetch("https://7e29von2h1.execute-api.us-east-1.amazonaws.com/default/carta-scraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(actualPayload)
      });
      
      console.log(`scrapeCartaDataAction: API response status: ${response.status} ${response.statusText}`);
      console.log(`scrapeCartaDataAction: API response headers: ${JSON.stringify(Object.fromEntries([...response.headers]))}`);
      
      // Handle the response based on status
    if (!response.ok) {
        // For error responses, clone the response before reading to avoid the "body already read" error
        const clonedResponse = response.clone();
        
        // First log the raw response for debugging
        const responseText = await clonedResponse.text();
        console.log("scrapeCartaDataAction: Raw error response:", responseText);
        
        // Try to parse as JSON if possible, otherwise use the text
        let errorMessage = `Failed to retrieve Carta data: HTTP ${response.status}`;
        let isAuthError = false;
        
        try {
          const errorData = JSON.parse(responseText);
          console.error("scrapeCartaDataAction: API error response object:", errorData);
          
          // Construct a detailed error message
          errorMessage = errorData.message || errorMessage;
          if (errorData.error) {
            errorMessage += ` - ${errorData.error}`;
          }
          if (errorData.details) {
            errorMessage += ` (${errorData.details})`;
          }
          
          // Check if this is an authentication error
          isAuthError = 
            response.status === 401 || 
            response.status === 403 || 
            errorMessage.includes('auth') || 
            errorMessage.includes('token') || 
            errorMessage.includes('unauthorized');
        } catch (parseError) {
          console.error("scrapeCartaDataAction: Could not parse error response as JSON, using raw text");
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
          
          // Check if this is an authentication error based on status code
          isAuthError = response.status === 401 || response.status === 403;
        }
        
        // If this is an authentication error and we haven't retried yet, try again
        if (isAuthError && !isRetry) {
          console.log("scrapeCartaDataAction: Authentication error detected, will retry with fresh token");
          return await makeRequest(true);
        }
        
        return {
          isSuccess: false,
          message: errorMessage
        };
      }
      
      // For successful responses, we only need to read the body once
      const responseText = await response.text();
      console.log("scrapeCartaDataAction: Raw successful response:", responseText);
      
      // Parse the response data
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("scrapeCartaDataAction: Data retrieved successfully");
      } catch (parseError) {
        console.error("scrapeCartaDataAction: Error parsing response as JSON:", parseError);
        return {
          isSuccess: false,
          message: `Received invalid data format from API: ${responseText.substring(0, 100)}...`
        };
      }
      
      return {
        isSuccess: true,
        message: "Retrieved Carta data successfully",
        data: data
      }
    } catch (error) {
      console.error(`scrapeCartaDataAction: Error retrieving Carta data${isRetry ? ' (retry attempt)' : ''}:`, error);
      
      if (error instanceof Error) {
        console.error(`scrapeCartaDataAction: Error type: ${error.name}`);
        console.error(`scrapeCartaDataAction: Error message: ${error.message}`);
        console.error(`scrapeCartaDataAction: Error stack: ${error.stack}`);
        
        // Check if this is an authentication error
        const isAuthError = 
          error.message.includes("unauthorized") || 
          error.message.includes("auth") || 
          error.message.includes("token");
        
        // If this is an authentication error and we haven't retried yet, try again
        if (isAuthError && !isRetry) {
          console.log("scrapeCartaDataAction: Authentication error detected, will retry with fresh token");
          return await makeRequest(true);
        }
        
        if (error.message.includes("unauthorized") || error.message.includes("auth")) {
          return {
            isSuccess: false,
            message: "Authorization failed. Please log in again. Details: " + error.message
          };
        }
        
        if (error.message.includes("fetch") || error.message.includes("network")) {
          return {
            isSuccess: false,
            message: "Network error when connecting to the Carta API. Please check your connection and try again."
          };
        }
      }
      
      return { 
        isSuccess: false, 
        message: error instanceof Error ? error.message : "Failed to retrieve Carta data" 
      }
    }
  }
  
  // Start the initial request
  return await makeRequest();
}

/**
 * @function testAuthenticationAction
 * @async
 * @description
 *  Tests authentication by attempting to get a JWT token from Clerk.
 *  Used to verify that a user can authenticate properly before
 *  attempting to scrape data.
 * 
 * @returns {Promise<ActionState<{ isAuthenticated: boolean, tokenInfo?: string }>>}
 *  - A success or failure result, with authentication status details.
 */
export async function testAuthenticationAction(): Promise<
  { isSuccess: true; message: string; data: { isAuthenticated: boolean; tokenInfo?: string } } |
  { isSuccess: false; message: string; data?: never }
> {
  console.log("testAuthenticationAction: Starting authentication test");
  try {
    // Get the authenticated user's JWT token
    const { getToken } = await auth()
    const token = await getToken()
    
    // Validate the token
    if (!token) {
      console.log("testAuthenticationAction: No token available");
      return {
        isSuccess: false,
        message: "Authentication failed: No JWT token available. Please log in again."
      }
    }

    // Log token details (truncated for security)
    const tokenFirstPart = token.substring(0, 15);
    const tokenLastPart = token.substring(token.length - 5);
    console.log(`testAuthenticationAction: JWT token obtained: ${tokenFirstPart}...${tokenLastPart} (${token.length} chars)`);
    
    // Analyze token structure
    const tokenParts = token.split('.');
    let tokenInfo = `Token obtained successfully (${token.length} characters)`;
    
    if (tokenParts.length !== 3) {
      console.warn("testAuthenticationAction: WARNING - Token does not appear to be a valid JWT (should have 3 parts)");
      tokenInfo += "\nWARNING: Token does not appear to be a valid JWT (should have 3 parts).";
    } else {
      console.log("testAuthenticationAction: Token structure appears valid (has 3 parts)");
      tokenInfo += "\nToken structure appears valid (has expected format).";
      
      // Try to decode the payload (middle part) to check expiration
      try {
        const payloadBase64 = tokenParts[1];
        // Add padding if needed
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const payloadJson = Buffer.from(paddedBase64, 'base64').toString();
        const payload = JSON.parse(payloadJson);
        
        if (payload.exp) {
          const expiryDate = new Date(payload.exp * 1000);
          const now = new Date();
          const timeUntilExpiry = expiryDate.getTime() - now.getTime();
          const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
          
          tokenInfo += `\nToken expires: ${expiryDate.toLocaleString()} (in ${minutesUntilExpiry} minutes)`;
          
          if (minutesUntilExpiry < 5) {
            tokenInfo += "\nWARNING: Token will expire soon!";
          }
        }
        
        if (payload.iss) {
          tokenInfo += `\nIssuer: ${payload.iss}`;
        }
      } catch (err) {
        console.error("testAuthenticationAction: Error decoding token payload:", err);
      }
    }
    
    return {
      isSuccess: true,
      message: "Authentication successful. You are properly authenticated.",
      data: {
        isAuthenticated: true,
        tokenInfo
      }
    }
  } catch (error) {
    console.error("testAuthenticationAction: Error during authentication test:", error);
    
    let errorMessage = "Authentication test failed";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error(`testAuthenticationAction: Error type: ${error.name}`);
      console.error(`testAuthenticationAction: Error message: ${error.message}`);
      console.error(`testAuthenticationAction: Error stack: ${error.stack}`);
    }
    
    return { 
      isSuccess: false, 
      message: errorMessage
    }
  }
}

