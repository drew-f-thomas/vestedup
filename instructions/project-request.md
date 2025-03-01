# Project Name
EquiChat: AI-Powered Equity Guidance Chatbot

## Project Description
EquiChat is an AI-driven chatbot designed for startup employees to navigate their equity compensation. Users can manually import their equity data via CSV or provide credentials for automated data retrieval via web scraping (e.g., Selenium). The chatbot leverages a multi-modal AI model to process text, PDFs, and images, allowing users to upload contracts and Carta screenshots for analysis. User authentication is required to store conversation history and manage data securely.

Initially, PDF uploads will serve as conversation context using GPT-4o’s built-in capabilities, with full document parsing and advanced insights planned for future iterations. 

## Target Audience
- Startup employees with stock options or RSUs
- Early-stage founders looking to understand equity structures
- Employees transitioning jobs who need to decide on exercising options
- Financial advisors working with startup clients

## Desired Features

### Core Chatbot Functionality
- [ ] AI-powered chat experience for answering equity-related questions
    - [ ] Conversational guidance tailored to user-provided data
    - [ ] Scenario-based insights (e.g., "What happens if I leave before my options vest?")
- [ ] Equity Data Import & Retrieval
    - [ ] Manual data input for non-Carta users
    - [ ] CSV upload for structured equity data
    - [ ] User credential submission & automated Selenium-based web scraping from Carta
    - [ ] Ability to upload PDFs (contracts, Carta screenshots) for added conversation context 
- [ ] Actionable Insights & Recommendations
    - [ ] Guidance on exercising options based on user's vesting schedule
    - [ ] Tax considerations (AMT, capital gains, etc.)
    - [ ] Expiration reminders and planning
- [ ] Personalized Simulations
    - [ ] "What if" scenarios based on company valuation changes
    - [ ] Modeling future liquidity events

### AI & Model Strategy
- [ ] Start with a standard model like GPT-4o-mini, optimized via prompt engineering
- [ ] Multi-modal LLM to process and extract insights from PDFs & images (limited to out-of-the-box context usage for MVP)
- [ ] Future roadmap includes fine-tuning for specialized equity guidance
- [ ] Admin tooling for:
    - [ ] Prompt iteration and improvement
    - [ ] Conversation reviews with thumbs up/down ratings
    - [ ] Free-text critique submission for feedback
    - [ ] Storage and analysis of user-uploaded PDFs/images for quality review

### User Experience & Interface
- [ ] **Authentication using Clerk** (Google login & email/password support)
- [ ] **Hosting on Vercel with Supabase as the database**
- [ ] **User authentication required for saved conversations**
- [ ] Clean, intuitive chatbot interface (web and mobile-friendly)
- [ ] Message history and session management
- [ ] Dynamic UI elements for data visualization (e.g., charts for tax impact)
- [ ] Interactive inputs (e.g., sliders for stock price estimations)

### Security & Compliance
- [ ] Secure handling of sensitive financial data
- [ ] Data encryption at rest and in transit
- [ ] User credential handling for Carta scraping in a secure environment
- [ ] Compliance with future financial data protection regulations (e.g., SOC-2 readiness plan)

### Admin Tooling
- [ ] **All admins can review conversations, provide feedback, and iterate on prompts**
- [ ] Admin dashboard to monitor chatbot performance
- [ ] Analytics on user queries and feedback
- [ ] Ability to flag inaccurate or unclear responses for improvement

### Additional Features (Future Considerations)
- [ ] Full document parsing for deeper contract insights beyond chat context
- [ ] Integration with financial advisors for human review
- [ ] Community Q&A section for users to discuss equity topics
- [ ] Premium tier where real human lawyers review uploaded contracts

## Design Requests
- [ ] Modern and minimal UI with financial app aesthetics
- [ ] Responsive web design for mobile accessibility
- [ ] Option to toggle between light and dark mode

## Other Notes
- [ ] Legal disclaimers to be added in later stages; initial focus is exploratory
- [ ] Equity-focused for now, with potential for broader financial guidance in the future
