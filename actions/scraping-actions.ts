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
  
  try {
    console.log("scrapeCartaDataAction: Getting Clerk JWT token");
    // Get the authenticated user's JWT token
    const { getToken } = await auth()
    const token = await getToken()
    
    console.log(`scrapeCartaDataAction: JWT token obtained: ${token ? 'Yes' : 'No'}`);
    
    if (!token) {
      console.error("scrapeCartaDataAction: No JWT token available");
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
    const response = await fetch("https://7e29von2h1.execute-api.us-east-1.amazonaws.com/default/carta-scraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(actualPayload)
    });
    
    console.log(`^^^ scrapeCartaDataAction: API response status: ${JSON.stringify(response)}`);
    
    // Handle the response based on status
    if (!response.ok) {
      // For error responses, clone the response before reading to avoid the "body already read" error
      const clonedResponse = response.clone();
      
      // First log the raw response for debugging
      const responseText = await clonedResponse.text();
      console.log("scrapeCartaDataAction: Raw error response:", responseText);
      
      // Try to parse as JSON if possible, otherwise use the text
      let errorMessage = "Failed to retrieve Carta data";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
        console.error("scrapeCartaDataAction: API error response:", errorData);
      } catch (parseError) {
        console.error("scrapeCartaDataAction: Could not parse error response as JSON");
      }
      
      throw new Error(errorMessage);
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
        message: "Received invalid data format from API"
      };
    }
    
    return {
      isSuccess: true,
      message: "Retrieved Carta data successfully",
      data: data
    }
  } catch (error) {
    console.error("scrapeCartaDataAction: Error retrieving Carta data:", error);
    
    if (error instanceof Error) {
      console.error(`scrapeCartaDataAction: Error type: ${error.name}`);
      console.error(`scrapeCartaDataAction: Error message: ${error.message}`);
      console.error(`scrapeCartaDataAction: Error stack: ${error.stack}`);
      
      // Check for specific error types
      if (error.message.includes("unauthorized") || error.message.includes("auth")) {
        return {
          isSuccess: false,
          message: "Authorization failed. Please log in again."
        };
      }
    }
    
    return { 
      isSuccess: false, 
      message: error instanceof Error ? error.message : "Failed to retrieve Carta data" 
    }
  }
}

