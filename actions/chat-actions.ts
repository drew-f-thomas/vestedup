"use server"
/**
 * @description
 * Server actions for handling the chat flow. We originally had sendMessageAction
 * which mocked an AI response. Now we add sendOpenAIMessageAction for a real GPT-4o call.
 *
 * Key Features:
 * - createMessageAction from conversation-actions to store messages
 * - openAI call stub. If real, we'd do fetch("https://api.openai.com/v1/chat/...") or similar.
 *
 * @notes
 * - This is a partial demonstration. You must provide your own API key in .env
 *   and handle token usage or streaming if you want a streaming response.
 */

import { ActionState } from "@/types"
import { createMessageAction } from "@/actions/db/conversation-actions"

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
  try {
    const { conversationId, userId, content } = props

    // 1. Create user message
    const userMsg = await createMessageAction(conversationId, "user", content)
    if (!userMsg.isSuccess) {
      return { isSuccess: false, message: userMsg.message }
    }

    // 2. Mock response
    const mockAssistantResponse = `This is a stub GPT-4o reply to: "${content}"`

    // 3. Create assistant message
    const aiMsg = await createMessageAction(
      conversationId,
      "assistant",
      mockAssistantResponse
    )
    if (!aiMsg.isSuccess) {
      return { isSuccess: false, message: aiMsg.message }
    }

    return {
      isSuccess: true,
      message: "Message sent and AI responded (mock).",
      data: {
        userMessageId: userMsg.data.id,
        assistantMessageId: aiMsg.data.id
      }
    }
  } catch (error) {
    console.error("Error in sendMessageAction:", error)
    return { isSuccess: false, message: "Failed to send message" }
  }
}

/**
 * @function sendOpenAIMessageAction
 * @description
 *  Example action that would call OpenAI's GPT-4o. If you have a real key,
 *  you can do a fetch call here. We'll store both user and assistant messages in the DB.
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

    // In a real scenario, call OpenAI here:
    // Example:
    // const response = await fetch("https://api.openai.com/v1/...", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4",
    //     messages: [{ role: "user", content }],
    //     temperature: 0.7
    //   })
    // })
    // const data = await response.json()
    // const assistantText = data.choices?.[0]?.message?.content || "No response"

    // For now, we'll mock the GPT reply:
    const assistantText = `GPT-4o says: (Pretend we called the API) - about: "${content}"`

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
    console.error("Error in sendOpenAIMessageAction:", error)
    return { isSuccess: false, message: "Failed to call GPT-4o" }
  }
}
