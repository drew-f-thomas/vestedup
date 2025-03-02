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
 * - Handles document content by adding it as context
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
import { ChatCompletionMessageParam, ChatCompletionContentPart } from "openai/resources/chat/completions"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Default system prompt to use if no active prompt is found
const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant. Answer questions accurately, truthfully, and be as helpful as possible.`

// Updated interface to include document content
interface SendMessageProps {
  conversationId: string
  userId: string
  content: string
  documentContent?: string
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
 *  If document content is provided, it's added as context for the model.
 *
 * @param {SendMessageProps} props
 * @returns {Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>>}
 */
export async function sendOpenAIMessageAction(
  props: SendMessageProps
): Promise<ActionState<{ userMessageId: string; assistantMessageId: string }>> {
  const { conversationId, userId, content, documentContent } = props

  try {
    // Create the user message
    const userMsg = await createMessageAction(conversationId, "user", content)
    if (!userMsg.isSuccess) {
      return { isSuccess: false, message: userMsg.message }
    }

    // Get the active system prompt
    const systemPromptRes = await getActivePromptByTypeAction("system")
    let systemPrompt = DEFAULT_SYSTEM_PROMPT
    if (systemPromptRes.isSuccess) {
      systemPrompt = systemPromptRes.data.content
    }

    // Get conversation history
    const historyRes = await getMessagesByConversationAction(conversationId)
    const history = historyRes.isSuccess ? historyRes.data : []

    // Prepare the message history for OpenAI
    const messageHistory: ChatCompletionMessageParam[] = []

    // Add system prompt as the first message
    messageHistory.push({
      role: "system",
      content: systemPrompt
    })

    // Add previous messages (excluding the most recent user message we just created)
    const previousMessages = history.filter(
      msg => msg.id !== userMsg.data.id
    )
    
    for (const msg of previousMessages) {
      messageHistory.push({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      })
    }

    // Add the current user message, with document content if available
    if (documentContent) {
      // If document content is available, we format it as text content parts
      // Note: We're NOT uploading the document directly to OpenAI, just sending the extracted text
      console.log("Including extracted document text content with the message");
      
      messageHistory.push({
        role: "user",
        content: [
          {
            type: "text",
            text: userMsg.data.content
          },
          {
            type: "text",
            text: documentContent
          }
        ] as ChatCompletionContentPart[]
      });
    } else {
      // If no document, just add the user message as normal
      messageHistory.push({
        role: "user",
        content: userMsg.data.content
      });
    }

    // Make the actual API call to OpenAI
    try {
      console.log("Sending message with extracted document text to OpenAI");
      
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
        message: "Message sent successfully",
        data: {
          userMessageId: userMsg.data.id,
          assistantMessageId: aiMsg.data.id
        }
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error)
      
      // Create a fallback message
      const fallbackMsg = await createMessageAction(
        conversationId,
        "assistant",
        "I'm sorry, I couldn't process your request at this time. Please try again later."
      )
      
      if (!fallbackMsg.isSuccess) {
        return { isSuccess: false, message: "Failed to send message and create fallback" }
      }
      
      return {
        isSuccess: true,
        message: "Created fallback message due to API error",
        data: {
          userMessageId: userMsg.data.id,
          assistantMessageId: fallbackMsg.data.id
        }
      }
    }
  } catch (error) {
    console.error("Error in sendOpenAIMessageAction:", error)
    return { isSuccess: false, message: "Failed to send message" }
  }
}
