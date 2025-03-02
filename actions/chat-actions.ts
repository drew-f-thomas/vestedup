"use server"
/**
 * @description
 * Server actions for handling the chat flow. We originally had sendMessageAction
 * which mocked an AI response. Now we add sendOpenAIMessageAction for a real GPT-4o call.
 *
 * Key Features:
 * - createMessageAction from conversation-actions to store messages
 * - Real OpenAI API call to GPT-4o model
 * - Proper error handling and message storage
 * - Uses the active system prompt from the admin dashboard
 *
 * @notes
 * - Requires OPENAI_API_KEY in .env.local
 * - Uses the chat completions API with the gpt-4o model
 * - Handles conversation history for context
 */

import { ActionState } from "@/types"
import { createMessageAction, getMessagesByConversationAction } from "@/actions/db/conversation-actions"
import { getActivePromptByTypeAction } from "@/actions/db/prompts-actions"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Default system prompt to use if no active prompt is found
const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant. Answer questions accurately, truthfully, and be as helpful as possible.`

// Re-export or keep the original function from the old code
// We'll keep it the same for reference:
interface SendMessageProps {
  conversationId: string
  userId: string
  content: string
}

/**
 * @function sendMessageAction
 *  The original function that mocks an AI response.
 */
export async function sendMessageAction(
  props: SendMessageProps
): Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>> {
  // Use the real OpenAI implementation instead of the mock
  return sendOpenAIMessageAction(props)
}

/**
 * @function sendOpenAIMessageAction
 * @description
 *  Makes a real API call to OpenAI's GPT-4o model. Fetches conversation history
 *  for context and stores both user and assistant messages in the database.
 *  Uses the active system prompt from the admin dashboard if available.
 *
 * @param {SendMessageProps} props
 * @returns {Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>>}
 */
export async function sendOpenAIMessageAction(
  props: SendMessageProps
): Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>> {
  try {
    const { conversationId, userId, content } = props

    // Create user message
    const userMsg = await createMessageAction(conversationId, "user", content)
    if (!userMsg.isSuccess) {
      return { isSuccess: false, message: userMsg.message }
    }

    // Get conversation history for context
    const messagesResult = await getMessagesByConversationAction(conversationId)
    if (!messagesResult.isSuccess) {
      return { isSuccess: false, message: "Failed to retrieve conversation history" }
    }

    // Get the active system prompt from the admin dashboard
    const activePromptResult = await getActivePromptByTypeAction("system")
    const systemPrompt = activePromptResult.isSuccess && activePromptResult.data
      ? activePromptResult.data.content
      : DEFAULT_SYSTEM_PROMPT

    // Format messages for OpenAI API with proper typing
    const messageHistory: ChatCompletionMessageParam[] = [
      // Add the system prompt as the first message
      { role: "system", content: systemPrompt },
      // Then add the conversation history
      ...messagesResult.data.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    ];

    // Make the actual API call to OpenAI
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messageHistory,
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantText = completion.choices[0]?.message?.content || "I couldn't generate a response at this time.";

      // Store the assistant message
      const aiMsg = await createMessageAction(
        conversationId,
        "assistant",
        assistantText
      )
      
      if (!aiMsg.isSuccess) {
        return { isSuccess: false, message: aiMsg.message }
      }

      return {
        isSuccess: true,
        message: "Message sent and GPT-4o responded.",
        data: {
          userMessageId: userMsg.data.id,
          assistantMessageId: aiMsg.data.id
        }
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      
      // Create a fallback message if the API call fails
      const fallbackMsg = await createMessageAction(
        conversationId,
        "assistant",
        "I'm sorry, I encountered an error while processing your request. Please try again later."
      );
      
      if (!fallbackMsg.isSuccess) {
        return { isSuccess: false, message: "Failed to create fallback message" }
      }
      
      // Return a success state with the fallback message
      return { 
        isSuccess: true, 
        message: "Error calling OpenAI API, fallback message created",
        data: {
          userMessageId: userMsg.data.id,
          assistantMessageId: fallbackMsg.data.id
        }
      }
    }
  } catch (error) {
    console.error("Error in sendOpenAIMessageAction:", error)
    return { isSuccess: false, message: "Failed to call GPT-4o" }
  }
}
