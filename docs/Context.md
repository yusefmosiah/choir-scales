# Choir Project Context

## Overview

**Choir** is an innovative socioeconomic media network that leverages blockchain technology to redefine collaborative communication and content curation. The platform has transitioned to a chat-based application, **choir.chat**, where users engage in collaborative discussions, and co-authors collectively manage the approval of messages. This approach aims to create the world's highest signal human dataset, serving as the foundation for training AI models that excel in both technical prowess and qualitative, stylistic, and artistic dimensions.

## Current State

### Core Components

1. **Ownership and Co-authorship**
   - Users own the messages they submit.
   - Threads are owned collectively by the creators of the messages within them (co-authors).
   - The initial thread creator is the first co-author.

2. **Chat-Based Interface**
   - Users write chat messages/responses within threads.
   - Co-authors of a thread collectively decide to approve or deny messages.
   - Non-co-authors can submit speculative responses ("specs") by staking CHOIR tokens.
   - **Approved specs**: Published and the contributor becomes a co-author.
   - **Denied specs**: Not published; rejecting co-authors split the staked tokens.

3. **Thread Accessibility**
   - All chat threads are accessible at `choir.chat/stream/<thread_id>`.
   - **Co-authors**: Have full read-write access to the thread.
   - **Other users**: See AI-generated summaries of the thread.
   - When messages are cited as sources elsewhere:
     - Include a link to the original chat thread.
     - A special message appears in the original thread indicating the citation.

4. **Token Mechanics**
   - CHOIR tokens are used for staking and rewards.
   - Threads have Solana accounts that store CHOIR tokens.
   - When a new message is approved, staked tokens go to the thread's token balance.
   - When a message is denied:
     - Rejecting co-authors split the staked tokens.
     - Any approvers get nothing.
     - Remaining tokens go to the Choir Treasury.

5. **AI-Generated Summaries**
   - Designed to create interest and stimulate engagement.
   - Compress content to tease the full discussion.
   - Will improve over time but are not intended as strict privacy measures.

### Database and Configuration

- Qdrant vector database integration for storing and retrieving chat messages
- Users own chat threads containing messages, all stored on Qdrant
- Configuration management using environment variables and Pydantic
- Utility functions for embeddings and chat completions using Azure OpenAI

### Tokenomics

- CHOIR token defined with a total supply of 10 billion
- Token mechanics integrated into message approval and thread economics
- Co-authorship dynamics:
  - Authors of approved messages become co-authors of the thread.
  - Co-authors share in the thread's token balance and have approval rights.
  - Co-authors can divest their token share at any time, taking a (1 / n - 1) share of the thread's tokens.

### AI Model Development

- Target date for the first AI model release: April 2025
- Plan to use Reinforcement Learning with the token-scored dataset
- Focus on enhancing qualitative aspects such as stylistic nuance and artistic expression

## Development Status

- **Solana Wallet Integration**: Functional
- **Qdrant Integration**: Implemented for chat message storage and retrieval
- **UI/UX**: Redesigned to reflect the chat-based interface and ownership model
- **Chorus AI**:
  - Enhanced with inline citations
  - Revised steps to include source citations and co-authorship considerations
  - Final responses display citations as links
- **CHOIR Token Mechanics**:
  - Staking and distribution integrated into message approval process
  - Token flow aligns with the chat-based interaction model and thread ownership
- **Message Approval Mechanism**: Implemented as "spec" submission and approval process
- **Citation Notifications**: Special messages appear when a message is cited elsewhere
- **Email Notifications**: Implementation in progress for co-author notifications
- **Thirdweb Embedded Wallet**: Integration planned
- **Testing**: Comprehensive testing ongoing, including ownership and token mechanics

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

## Conclusion

By transitioning to a chat-based platform with collaborative message approvals and integrated tokenomics, Choir enhances user engagement and maintains its goal of fostering high-quality content creation. This shift aligns with the original vision while adapting to a more interactive and accessible format. Continued development will focus on refining these mechanics, ensuring scalability, and preparing for the AI model release in April 2025.
