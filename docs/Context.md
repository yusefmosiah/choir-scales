# Choir Project Context

## Overview

**Choir** is an innovative socioeconomic media network that leverages blockchain technology to redefine collaborative communication and content curation. The platform has transitioned to a chat-based application, **choir.chat**, where users engage in collaborative discussions, and co-authors collectively manage the approval of messages. This approach aims to create the world's highest signal human dataset, serving as the foundation for training AI models that excel in both technical prowess and qualitative, stylistic, and artistic dimensions.

## Current State

### Core Components

1. **Chorus AI System**
   - Implemented in `chorus.py`
   - Uses a multi-step process: Action, Experience, Intention, Observation, Update, and Yield
   - Integrates with Qdrant vector database for semantic search
   - Enhancements:
     - Inclusion of inline citations
     - Revision of the "objective" step to cite sources
     - Update of the final response to display citations as links

2. **Chat-Based Interface**
   - Users write chat messages/responses within threads.
   - Co-authors of a thread collectively decide to approve or deny messages.
     - **Approved messages**: Published and visible within the thread.
     - **Denied messages**: Not published; rejecting co-authors split the tokens staked on the message.
   - Users must stake CHOIR tokens to contribute to threads they are not co-authors of.
     - If approved, tokens go to the thread's token balance.
     - If rejected, staked tokens are distributed among rejecting co-authors.
     - In split decisions, tokens intended for approving co-authors are returned to the Choir Treasury.

3. **Thread Accessibility**
   - All chat threads are accessible at `choir.chat/stream/<thread_id>`.
   - **Co-authors**: See the full content of the thread.
   - **Other users**: See AI-generated summaries of the thread.
   - When messages are cited as sources elsewhere:
     - Include a link to the original chat thread.
     - A special message appears in the original thread indicating the citation.

4. **Frontend Components**
   - React-based components for user interaction
   - Key components include StreamChat, ChorusStep, ChorusPanel, SourcesList, UserInput, and AIResponse
   - Enhancements:
     - Integration into v0 (AI Frontend Generator)
     - UI bug fixes and warnings addressed
     - Components refactored into self-documenting abstractions
     - Homepage built using AI to select and generate content
     - Calculations of vectors for chat threads and users (eigenvectors)

5. **Blockchain Integration**
   - Solana wallet integration (functional)
   - User accounts defined by Solana wallet public keys
   - Token transactions managed through smart contracts
   - Users stake and receive CHOIR tokens as part of message approval mechanics

### Database and Configuration

- Qdrant vector database integration for storing and retrieving chat messages
- Users own chat threads containing messages, all stored on Qdrant
- Configuration management using environment variables and Pydantic
- Utility functions for embeddings and chat completions using Azure OpenAI

### Tokenomics

- CHOIR token defined with a total supply of 10 billion
- Token mechanics:
  - Users stake tokens to contribute to threads they are not co-authors of.
  - Approved messages result in tokens being added to the thread's token balance.
  - Denied messages result in staked tokens being distributed among rejecting co-authors.
  - Split decisions return tokens intended for approvers to the Choir Treasury.
- Co-authorship dynamics:
  - Authors of approved messages become co-authors of the thread.
  - Co-authors share in the thread's token balance and have approval rights.

### AI Model Development

- Target date for the first AI model release: April 2025
- Plan to use Reinforcement Learning with the token-scored dataset
- Focus on enhancing qualitative aspects such as stylistic nuance and artistic expression

## Development Status

- **Solana Wallet Integration**: Functional
- **Qdrant Integration**: Implemented for chat message storage and retrieval
- **UI/UX**: Redesigned to reflect the chat-based interface
- **Chorus AI**:
  - Enhanced with inline citations
  - Revised steps to include source citations
  - Final responses display citations as links
- **CHOIR Token Mechanics**:
  - Staking and distribution integrated into message approval process
  - Token flow aligns with the chat-based interaction model
- **Message Approval Mechanism**: Implemented
- **Citation Notifications**: Special messages appear when a message is cited elsewhere
- **Email Notifications**: Implementation in progress
- **Thirdweb Embedded Wallet**: Integration planned
- **Testing**: Comprehensive testing ongoing

## Next Steps

1. **Finalize Tokenomics Integration**
   - Ensure all token mechanics are robust and secure
   - Implement divestment mechanisms for co-authors

2. **Develop and Deploy Solana Programs (Smart Contracts)**
   - Complete development of secure smart contracts for token transactions
   - Deploy contracts to the Solana mainnet

3. **Implement Email Notification System**
   - Integrate with an email service provider
   - Design responsive email templates for notifications

4. **Integrate Thirdweb Embedded Wallet**
   - Assess compatibility and implement integration

5. **Produce Media Assets and Publish Documentation**
   - Update documentation to reflect the chat-based model
   - Design logos, icons, and promotional materials

## Key Challenges and Considerations

- **User Onboarding**: Simplifying the process for new users to join and understand the platform
- **Co-author Coordination**: Ensuring efficient communication among co-authors for message approvals
- **Scalability**: Optimizing the platform to handle increased user activity and data volume
- **Security**: Maintaining robust security measures for token transactions and message integrity
- **AI Summarization**: Implementing accurate and meaningful AI-generated summaries for public threads

## Testing Strategy

- **Unit and Integration Tests**:
  - Python backend components
  - TypeScript frontend components
- **Solana Program Testing**:
  - Utilize Ackee Trident for fuzz testing of Solana smart contracts
- **End-to-End Testing**:
  - Simulate user interactions with message approvals and token transactions
  - Validate AI summarization and citation features

## Corporate Structure and Fundraising Plans

- **Dual Structure**: Choir operates both as a corporate entity with stock and a decentralized community with the CHOIR token
- **Fundraising Initiative**:
  - **Target Date**: December
  - **Purpose**:
    - Hire talent across various domains
    - Invest in AI model training and platform infrastructure
  - **Strategic Goals**:
    - Corporate ownership of CHOIR tokens
    - Choir Treasury to eventually hold tokenized corporate stock

---

## Choir Project Questions and Discussion Points

### 1. Implementation of Message Approval Mechanism

- **Question**: How should the approval process be streamlined to ensure timely publishing of messages?
  - **Discussion Points**:
    - Setting reasonable time frames for co-authors to approve or deny messages
    - Implementing notifications to prompt co-authors to take action
  - **Resolution**:
    - Establish a 24-hour window for approvals
    - Implement email and in-app notifications for pending approvals

### 2. Token Staking Requirements

- **Question**: What is the appropriate amount of CHOIR tokens required to stake when contributing to threads?
  - **Discussion Points**:
    - Balancing accessibility for users and discouraging spam
    - Adjusting staking amounts based on thread activity or importance
  - **Resolution**:
    - Define a base staking amount with potential adjustments for high-traffic threads
    - Implement dynamic staking requirements as the platform evolves

### 3. AI-Generated Summaries

- **Question**: How can we ensure that AI-generated summaries of threads are accurate and respectful of user privacy?
  - **Discussion Points**:
    - Using summarization models that emphasize key points without disclosing sensitive information
    - Allowing co-authors to approve AI summaries before publication
  - **Resolution**:
    - Implement an AI summarization process with co-author oversight
    - Provide options for co-authors to exclude certain messages from summaries

---

## Conclusion

By transitioning to a chat-based platform with collaborative message approvals and integrated tokenomics, Choir enhances user engagement and maintains its goal of fostering high-quality content creation. This shift aligns with the original vision while adapting to a more interactive and accessible format. Continued development will focus on refining these mechanics, ensuring scalability, and preparing for the AI model release in April 2025.
