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
import { createConversationAction } from "@/actions/db/conversation-actions"
import { getUserTaxDocumentsAction } from "@/actions/db/tax-service-actions"
import { getDocumentContentStorage } from "@/actions/storage/storage-actions"
import { DocumentType } from "@/actions/storage/storage-actions"
import { updatePromptAction } from "@/actions/db/prompts-actions"

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

    // If document content exists, append it to the system prompt
    if (documentContent) {
      systemPrompt = `${systemPrompt}\n\nContext from uploaded document:\n${documentContent}`
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

    // Add the current user message
    messageHistory.push({
      role: "user",
      content: userMsg.data.content
    });

    // Make the actual API call to OpenAI
    try {
      console.log("Sending message to OpenAI:", {
        messageCount: messageHistory.length,
        systemPrompt: messageHistory[0]?.content,
        documentContent: documentContent ? "Included in system prompt" : "None",
        messageHistory: messageHistory.map(msg => ({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content.substring(0, 100) + '...' : 'Content parts included',
          hasMultipleParts: Array.isArray(msg.content)
        }))
      });
    
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
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

/**
 * @function initializeConversationWithTaxDataAction
 * @description
 *  Creates a new conversation and initializes it with the user's tax data.
 *  The tax data is retrieved and added to the first system message for context.
 *  This ensures the AI has access to the tax data without storing it in client state.
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<ActionState<{ conversationId: string }>>}
 */
export async function initializeConversationWithTaxDataAction(
  userId: string
): Promise<ActionState<{ conversationId: string }>> {
  try {
    console.log("[TAX_CHAT] Initializing conversation with tax data for user:", userId)
    
    // Create the conversation
    const convoRes = await createConversationAction(userId)
    if (!convoRes.isSuccess) {
      return { 
        isSuccess: false, 
        message: "Failed to create conversation: " + convoRes.message 
      }
    }
    
    const conversationId = convoRes.data.id
    console.log("[TAX_CHAT] Created conversation:", conversationId)
    
    // Get tax documents for the user
    console.log("[TAX_CHAT] Fetching tax documents...")
    const taxDocsResult = await getUserTaxDocumentsAction(userId)
    
    if (!taxDocsResult.isSuccess || taxDocsResult.data.length === 0) {
      console.log("[TAX_CHAT] No tax documents found")
      // No documents, but conversation created successfully
      return {
        isSuccess: true,
        message: "Conversation initialized (no tax documents)",
        data: { conversationId }
      }
    }
    
    console.log(`[TAX_CHAT] Found ${taxDocsResult.data.length} tax documents`)
    
    // Format tax data from each document
    let taxContexts: string[] = []
    
    for (const taxDoc of taxDocsResult.data) {
      const { taxBase, w2, form1099Misc } = taxDoc
      
      try {
        console.log(`[TAX_CHAT] Processing ${taxBase.docType} document data`)
        
        if (taxBase.docType === "W2" && w2) {
          // Format W2 data according to W2Analysis schema
          const w2Context = `
[W2 Document - Tax Year: ${taxBase.filingYear}]

Employee Information:
${JSON.stringify({
  name: w2.employeeName,
  address: w2.employeeAddress,
  ssn: w2.employeeSsn
}, null, 2)}

Filing Status: ${w2.filingStatus || 'Not provided'}

Employer Information:
${JSON.stringify({
  name: w2.employerName,
  address: w2.employerAddress,
  fed_id_number: w2.employerFedIdNumber,
  state_id_number: w2.employerStateIdNumber
}, null, 2)}

Control Number: ${w2.controlNumber || 'Not provided'}
Verification Code (Box 9): ${w2.verificationCode || 'Not provided'}

Wages Information:
${JSON.stringify({
  box_1_wages_tips_other_comp: w2.wagesBox1,
  box_2_federal_income_tax_withheld: w2.fedIncomeTaxBox2,
  box_3_social_security_wages: w2.socialSecurityWagesBox3,
  box_4_social_security_tax_withheld: w2.socialSecurityTaxBox4,
  box_5_medicare_wages_and_tips: w2.medicareWagesBox5,
  box_6_medicare_tax_withheld: w2.medicareTaxBox6,
  box_7_social_security_tips: w2.socialSecurityTipsBox7,
  box_8_allocated_tips: w2.allocatedTipsBox8,
  box_10_dependent_care_benefits: w2.dependentCareBenefitsBox10,
  box_11_nonqualified_plans: w2.nonqualifiedPlansBox11,
  box_16_state_wages_tips_etc: w2.stateWagesBox16,
  box_17_state_income_tax: w2.stateIncomeTaxBox17,
  box_18_local_wages_tips_etc: w2.localWagesBox18,
  box_19_local_income_tax: w2.localIncomeTaxBox19,
  box_20_locality_name: w2.localityNameBox20
}, null, 2)}

Box 12 Codes: ${w2.box12Codes || '[]'}

Box 13:
${JSON.stringify({
  statutory_employee: w2.statutoryEmployeeBox13,
  retirement_plan: w2.retirementPlanBox13,
  third_party_sick_pay: w2.thirdPartySickPayBox13
}, null, 2)}

Box 14 Items: ${w2.box14Items || '[]'}

State Information: ${w2.stateInformation || '[]'}

Summary:
${JSON.stringify({
  gross_pay: w2.grossPay,
  adjustments: {
    cafe_125: w2.cafe125Adjustments,
    hsa: w2.hsaAdjustments,
    other: w2.otherAdjustments
  },
  reported_w2_wages: w2.reportedW2Wages
}, null, 2)}`

          taxContexts.push(w2Context)
          console.log(`[TAX_CHAT] Added W2 data to context`)
        } else if (taxBase.docType === "1099_MISC" && form1099Misc) {
          // Format 1099-MISC data (you can add this later if needed)
          console.log(`[TAX_CHAT] 1099-MISC processing not yet implemented`)
        }
      } catch (error) {
        console.error(`[TAX_CHAT] Error processing ${taxBase.docType} data:`, error)
        // Continue to the next document
      }
    }
    
    if (taxContexts.length > 0) {
      // Get the active system prompt
      const systemPromptRes = await getActivePromptByTypeAction("system")
      let systemPrompt = DEFAULT_SYSTEM_PROMPT
      let systemPromptId: string | undefined
      
      if (systemPromptRes.isSuccess) {
        systemPrompt = systemPromptRes.data.content
        systemPromptId = systemPromptRes.data.id
      }
      
      // Add tax data to system prompt
      console.log("[TAX_CHAT] Adding tax data to system prompt")
      const enhancedSystemPrompt = `${systemPrompt}\n\nAvailable Tax Document Information:\n${taxContexts.join("\n\n")}\n\nUse this tax information to provide accurate answers about the user's tax documents and financial situation. Be ready to explain specific numbers and calculations from their documents.`
      
      // Update the system prompt in the database if we have an ID
      if (systemPromptId) {
        const updatePromptRes = await updatePromptAction(
          systemPromptId,
          {
            content: enhancedSystemPrompt,
            isActive: true
          }
        )
        
        if (!updatePromptRes.isSuccess) {
          console.error("[TAX_CHAT] Failed to update system prompt with tax data")
        }
      } else {
        console.error("[TAX_CHAT] No active system prompt found to update")
      }
      
      // Create a welcome message
      await createMessageAction(
        conversationId,
        "assistant",
        "I've loaded your tax documents and am ready to help answer any questions you have about them. Ready to get started?"
      )
      
      console.log("[TAX_CHAT] Conversation initialized with tax data in system prompt")
    }
    
    return {
      isSuccess: true,
      message: "Conversation initialized with tax data",
      data: { conversationId }
    }
  } catch (error) {
    console.error("[TAX_CHAT] Error initializing conversation with tax data:", error)
    return { 
      isSuccess: false, 
      message: "Failed to initialize conversation with tax data" 
    }
  }
}
