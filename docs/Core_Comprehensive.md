# Choir: Comprehensive Project Overview

VERSION comprehensive_system:
  invariants: {
    "Token-driven quality control",
    "Collaborative ownership model",
    "Dual-state architecture"
  }
  assumptions: {
    "Development timeline",
    "Integration patterns",
    "Scaling approach"
  }
  implementation: "0.1.0"

## Vision and Mission

ASSUMPTION platform_evolution:
  "Initial focus on text-based chat"
  "May expand to other content types"
  "Must maintain quality-first approach"

Choir envisions a future where artificial intelligence seamlessly integrates the nuanced, creative, and contextual aspects of human communication. Our mission is to create the world's highest signal human dataset by leveraging a decentralized, token-driven chat platform, ultimately developing AI models that excel in qualitative, stylistic, and artistic dimensions.

## Core Concept and Problem Statement

ASSUMPTION quality_metrics:
  "Implicit quality through stake/approval"
  "May introduce explicit metrics"
  "Must maintain organic curation"

Traditional AI models demonstrate impressive technical capabilities but lack the qualitative nuances that characterize human expression. Content generated by these models often fails to capture stylistic nuance, artistic flair, and meaningful context, resulting in a disconnect with human audiences.

Choir addresses these challenges by creating a decentralized, chat-based platform where users engage in collaborative discussions. Messages are curated through a collective approval mechanism, ensuring only high-quality content is published. By integrating blockchain technology and innovative tokenomics, Choir incentivizes users to produce valuable content, fostering an ecosystem that prioritizes quality over quantity.

## Key Features and Mechanics

ASSUMPTION feature_set:
  "Core ownership and approval features"
  "May add advanced governance"
  "Must maintain simplicity of use"

### 1. Collaborative Message Ownership and Approval
- Users own the messages they submit.
- Threads are owned collectively by the creators of the messages within them (co-authors).
- Messages require unanimous approval from co-authors to be published.
- The initial thread creator is the first co-author.

### 2. Speculative Responses ("Specs")
- Non-co-authors can pay CHOIR tokens to submit a speculative response ("spec") to a thread.
- Co-authors have a 7-day window to approve or deny the spec.
- If approved unanimously, the spec is published, and the contributor becomes a co-author.
- If denied, the spec is rejected, and rejecting co-authors split the staked tokens.

### 3. Access Control and Incentivization
- Co-authors have full read-write access to their threads.
- Non-co-authors can view AI-generated summaries of threads.
- All chat threads are accessible at `choir.chat/stream/<thread_id>`.
- Ownership enables access control and distribution of CHOIR token rewards.

### 4. CHOIR Token Mechanics
- Total Supply: 10 billion CHOIR tokens (fixed supply)
- Used for staking, rewarding contributions, and aligning incentives
- Threads have Solana accounts that store CHOIR tokens
- Token distribution based on message approvals and denials
- When a new message is approved, staked tokens go to the thread's token balance
- When a message is denied:
  - Rejecting co-authors split the staked tokens
  - Any approvers get nothing
  - Remaining tokens go to the Choir Treasury

### 5. AI-Generated Summaries
- Non-co-authors access AI-generated summaries of threads
- Summaries designed to create interest and stimulate engagement
- Compress content to tease the full discussion
- Will improve over time but are not intended as strict privacy measures

## Proof of Text Mechanism

Choir introduces a novel consensus mechanism known as **Proof of Text** to ensure content integrity, foster collaboration, and align incentives within its decentralized ecosystem.

### Key Components of Proof of Text

1. **Message Contribution and Staking**
   - Users stake a predefined amount of CHOIR tokens to submit messages or specs to threads where they are not co-authors.
   - Purpose: Discourages spam and ensures contributors have a vested interest in the thread's quality.

2. **Collaborative Message Approval**
   - Co-author Review: Co-authors have a 7-day window to approve or deny the submitted message or spec.
   - Unanimous Approval: All co-authors approve, the message is published, and the contributor becomes a co-author.
   - Denial: Any co-author rejects, the message is denied, and staked tokens are distributed among rejecting co-authors.
   - Split Decision: Mixed approvals result in the message being denied, with tokens intended for approvers returning to the Choir Treasury.

3. **Co-authorship Dynamics**
   - Rights and Responsibilities: Co-authors share in the thread's token balance and participate in future approvals.
   - Divestment Option: Co-authors can choose to divest their token share from a thread at any time, receiving a proportional share of the thread's tokens.

## Technical Architecture

### 1. Frontend
- Next.js-based web application
- React components for UI elements
- Solana wallet integration
- Tailwind CSS for styling

### 2. Backend
- FastAPI (Python) for API endpoints
- WebSocket support for real-time chat
- Integration with Qdrant for vector storage

### 3. Blockchain Layer
- Solana blockchain for token transactions and storage
- Custom smart contracts for thread token management

### 4. AI Layer
- Azure OpenAI for embeddings and completions
- Custom AI model development (target: April 2025)

## Chorus Loop

The Chorus Loop is a decision-making model implemented in the platform:

1. **Action**: Provide an initial response to the user's prompt with "beginner's mind"/emptiness.
2. **Experience**: Search memory for relevant context to refine the initial response.
3. **Intention**: Analyze planned actions and consider potential consequences.
4. **Observation**: Reflect on the analysis and intentions, identifying gaps in knowledge or potential biases.
5. **Update**: Decide whether to proceed with the current plan or loop back for further refinement.
6. **Yield**: Synthesize the accumulated context from all iterations and provide a final response.

## Ownership Model

1. **Message Ownership**: Each message is owned by its creator.
2. **Thread Ownership**: Threads are owned collectively by co-authors (creators of the messages within them).
3. **Co-authorship**:
   - Co-authors have full read-write access to the thread.
   - New co-authors are added when their messages are approved and published in the thread.
   - No limitations on the number of co-authors a thread can have.

## Token Flow Mechanics

1. **Message Contribution and Staking**: Users stake CHOIR tokens to submit messages or specs.
2. **Approval Process**:
   - Unanimous Approval: Staked tokens added to thread's balance.
   - Denial: Rejecting co-authors split staked tokens.
3. **Divestment**: Co-authors can divest their token share from a thread at any time, taking a (1 / n - 1) share of the thread's CHOIR tokens.

## Development Roadmap

### Week 1 (Oct 20-26): New Project Setup and Core Functionality
- Set up new project with create-solana-dapp
- Implement basic chat functionality and WebSocket connections
- Implement basic Chorus loop in Python backend
- Deploy to Render and set up DNS

### Week 2 (Oct 27-Nov 2): Ownership Model and Enhanced Chorus Loop
- Implement core ownership model features
- Enhance Chorus loop with all steps
- Integrate frontend with enhanced backend features

### Week 3 (Nov 3-9): Tokenomics and Solana Integration
- Implement mock CHOIR token system
- Begin Solana integration
- Refine UI/UX for token-related features

### Week 4 (Nov 10-16): Testing, Refinement, and Pre-launch
- Comprehensive testing
- UI/UX refinement
- Documentation and final touches
- Final deployment and pre-launch checks

### Launch Day (Nov 17): MVP Release

## Future Considerations

1. Implement caching mechanisms for frequently accessed sources
2. Explore AI-driven summarization improvements
3. Develop user feedback system for source relevance
4. Implement governance mechanisms for platform rules and token economics
5. Explore applications in education, creative writing, and professional communication
6. Consider allowing threads to hold SOL, stablecoins, or DeFi assets
7. Develop AI-enabled group chats to manage thread assets

## Business Model and Financial Sustainability

### Revenue Generation Strategies
1. **Membership Plans**: Offer premium features or enhanced services for subscribers.
2. **Transaction Fees**: Apply minimal fees on token transactions or message staking.
3. **Enterprise Solutions**: Offer customized versions of the platform for organizations.

### Fundraising Initiatives
- **Target Date**: December
- **Use of Funds**:
  - Expand the development team
  - Invest in AI technologies and infrastructure
  - Enhance platform features and scalability
- **Corporate Integration**:
  - Choir Inc. aims to own CHOIR tokens
  - The Choir Treasury may hold tokenized corporate stock in the future

## Conclusion

Choir represents a paradigm shift in collaborative content creation and AI development. By combining blockchain technology, innovative tokenomics, and advanced AI, Choir aims to create a platform that not only produces high-quality content but also serves as a foundation for developing more nuanced and contextually aware AI models. The Proof of Text mechanism ensures content quality while incentivizing meaningful contributions, setting a new standard for decentralized platforms and content generation.
