# Choir Tokenomics Whitepaper

## Abstract

Choir presents an innovative socioeconomic media network that leverages blockchain technology to redefine content creation, curation, and collaboration. Central to Choir's ecosystem is the Choir Token (CHOIR), a cryptocurrency meticulously designed to incentivize meaningful contributions, foster high-quality content, and promote collaborative editing. This whitepaper delineates the comprehensive tokenomics of Choir, elucidating the mechanisms of token distribution, circulation, and economic incentives that underpin user engagement and platform sustainability. A key feature of Choir is the integration of an interactive Authors Chat during the edit proposal process, enhancing collaborative decision-making and content quality through a user-friendly interface.

## Introduction

In the digital landscape, the proliferation of content has democratized information sharing but has also introduced challenges related to content quality, credibility, and meaningful collaboration. Traditional social media platforms often rely on centralized algorithms that prioritize engagement over substance, leading to issues like misinformation and low-quality content proliferation.

Choir addresses these challenges by creating a decentralized platform where content and its metadata are treated as valuable assets. By integrating blockchain technology and a thoughtfully designed token economy, Choir incentivizes users to produce original, high-quality content, engage in collaborative editing, and invest in the platform's growth. The introduction of an interactive Authors Chat during edit proposals further enhances collaboration, allowing authors and editors to discuss, refine, and reach consensus on content improvements through a seamless user interface. This approach not only enhances content quality but also fosters a vibrant, engaged community.

## Token Overview

- **Token Name**: Choir Token
- **Token Symbol**: CHOIR
- **Total Supply**: 10,000,000,000 (10 billion) tokens (Hard Cap)
- **Token Standard**: Solana Program Library (SPL) Token
- **Initial Allocation**: All 10 billion tokens minted to the Choir Treasury at genesis

## Key Entities in the Choir Ecosystem

### 1. Choir Treasury

- **Description**: The central repository holding the entire initial supply of CHOIR tokens.
- **Functionality**:
  - Distributes tokens to users as rewards for content creation and automatic citations.
  - Recaptures tokens from specific protocol mechanisms, such as split edit decisions.
  - Maintains the economic balance of the platform by controlling token flow.

### 2. Users

- **Description**: Participants who create content, propose edits, and engage in the collaborative ecosystem.
- **Functionality**:
  - Receive tokens from the Choir Treasury based on their contributions.
  - Invest tokens into content through collaborative editing.
  - Can divest their share of tokens from content accounts, relinquishing authorship.

### 3. Edit Escrow Contracts

- **Description**: Smart contracts that temporarily hold tokens while an edit proposal is under consideration.
- **Functionality**:
  - Lock staked tokens during the edit proposal period.
  - Distribute tokens based on the outcome of the edit proposal (approval or denial).

### 4. Content Accounts

- **Description**: Blockchain accounts representing individual pieces of content.
- **Functionality**:
  - Store the token score of content.
  - Maintain records of co-authors and their token shares.
  - Accumulate tokens to enhance content visibility and ranking.

### 5. Chorus AI System

- **Description**: Core AI system for content analysis and generation.
- **Functionality**:
  - Implements a multi-step process: Action, Experience, Intention, Observation, Update, and Yield.
  - Integrates with Qdrant vector database for semantic search and efficient content management.

## Token Flow Mechanics

### 1. Initial Token Allocation

- **Minting**: 10 billion CHOIR tokens are minted to the Choir Treasury at platform inception.
- **Purpose**: Serves as the foundational economic resource for rewarding user activities and maintaining platform operations.

### 2. Content Creation Rewards

- **Mechanism**: Users earn tokens by creating original content.
- **Variable Reward System**:
  - **Semantic Sparsity Factor**: The reward for content creation is inversely proportional to the density of similar content in the semantic space.
  - **High-Entropy Content Incentivization**: Unique, high-quality, and innovative content receives higher rewards, promoting diversity and originality.
- **Formula**:

  [ \text{Reward} = T_c \times \left(1 + \frac{S_{\text{max}} - S_{\text{content}}}{S_{\text{max}}} \right) ]

  - ( T_c ): Base token reward per content creation.
  - ( S_{\text{content}} ): Semantic similarity score of the new content to existing content.
  - ( S_{\text{max}} ): Maximum possible similarity score.

- **Token Allocation**:
  - **Creators**: Receive a portion of the minted tokens based on content uniqueness.
  - **Content's Token Balance**: Accumulates tokens, enhancing content visibility and ranking.

### 3. Automatic Citation Rewards

- **Mechanism**: When new content is created, the system automatically cites relevant existing content using a reranking algorithm.
- **User Interface Integration**:
  - **Chat Threads**: Citations appear as new messages in the chat thread of the cited content.
  - **Notification Indicators**: Tabs or chat threads change color or display badges to indicate new unread citation messages.
- **Token Distribution**:
  - **Cited Authors**: Receive tokens as a reward for their content being referenced.
  - **Allocation Ratio**: A predefined fraction of the content creation reward is allocated for citations.

### 4. Collaborative Editing and Token Investment

- **Edit Proposals**:
  - **Process**: Users propose edits to existing content by staking tokens in an edit escrow contract.
  - **Staking Requirement**: A fixed number of tokens must be staked to initiate an edit proposal, representing an investment in the content's improvement.
- **User Interface and Authors Chat**:
  - **Edit Requests as Chat Messages**:
    - **Appearance**: Edit requests appear as new messages in the chat thread of the content being edited.
    - **Interactive Elements**: Messages include discrete options or buttons for authors to tap/click, such as approve or reject.
  - **Notification System**:
    - **Visual Indicators**: Tabs or chat threads highlight new edit requests through color changes or notification badges.
    - **Email/App Notifications**: Authors receive notifications about new edit requests and messages.
  - **Communication and Collaboration**:
    - **Responses**: Authors can respond to edit requests within the chat thread, engaging in discussion.
    - **Cross-Thread Updates**: Responses are mirrored in the chat threads of all involved parties, ensuring synchronized communication.
    - **Iterative Editing**: Editors can revise their proposals based on feedback received in the Authors Chat until consensus is reached.
- **Approval Process**:
  - **Review Window**: Co-authors have a 7-day period to approve or reject the proposed edit.
  - **Abstention Rule**: If co-authors neither approve nor reject within 7 days, their abstention is treated as an implicit approval.
  - **Unanimous Approval**: If all co-authors approve (or abstain), the edit is implemented, and the editor becomes a co-author.
  - **Token Distribution on Approval**:
    - **Content Account**: Receives the staked tokens, increasing its token balance.
    - **Editor**: Gains co-authorship status and a share of the content's token balance.
  - **Rejection and Token Distribution**:
    - **Single Rejection**: If any co-author rejects the edit, it is denied.
    - **Token Distribution on Denial**: Staked tokens are distributed among rejecting authors.

### 5. Divestment and Token Extraction

- **Divestment Mechanism**:
  - **Process**: Authors can choose to divest their share of tokens from a content account at any time.
  - **Token Retrieval**: Upon divestment, an author receives (\frac{\text{Content Account Tokens}}{n - 1}) tokens, where (n) is the total number of co-authors.
- **Examples**:
  - **7 Authors**: An author divesting receives (\frac{\text{Content Tokens}}{6}).
  - **2 Authors**: A divesting author receives all tokens in the content account, leaving the remaining author with an empty account.
- **Economic Implications**:
  - **Fair Token Distribution**: Ensures that tokens are fairly redistributed among remaining authors when one author divests.
  - **Hot Potato Dynamics**: Encourages active investment in content by allowing authors who no longer believe in its value to divest, transferring control to those who do.
  - **Content as an Asset**: Reinforces the notion of content being a valuable, buyable, and sellable asset within the platform.

## Incentive Structures

### Content Creators

- **Rewards**: Receive tokens upon content creation and when their content is cited.
- **Incentive**: Produce original, high-quality content to maximize token rewards and content visibility.
- **Engagement**: Stay responsive to citations and engage with other users through chat threads.

### Editors

- **Cost**: Stake tokens to propose edits, representing an investment in content quality.
- **Access to Authors Chat**:
  - **Benefit**: Can collaborate with authors to refine edit proposals, increasing chances of approval.
  - **Incentive**: Engage in constructive dialogue to improve content and gain co-authorship.
- **Rewards**:
  - **Approval**: Gain co-authorship and enhance the content's token balance.
  - **Denial**: Lose staked tokens, encouraging editors to propose valuable edits.

### Authors

- **Rewards**: Earn tokens from content citations and edit denials.
- **Incentive**:
  - **Quality Maintenance**: Use the Authors Chat to discuss and refine edits, ensuring content integrity.
  - **Collaboration**: Work with editors to improve content, benefiting from enhanced content value.
  - **Engagement**: Respond to citations and edit requests promptly through chat threads and notifications.

## Preventing Token Inflation and Ensuring Sustainability

### Fixed Token Supply

- **Hard Cap**: The total supply of 10 billion CHOIR tokens ensures that the ecosystem remains deflationary, preserving token value over time.

### Dynamic Reward Adjustment

- **Content Creation Rewards**: Adjusted based on semantic sparsity to balance token distribution and reward originality.
- **Token Recapture**: Ensures that tokens from unsuccessful edit proposals are reintegrated into the Treasury, maintaining a steady token flow.

### No In-Protocol Burning

- **Policy**: By not incorporating burning mechanisms, the protocol maintains a predictable token supply.
- **User-Controlled Burning**: Users retain the freedom to burn tokens by sending them to inactive addresses, but this is not a feature managed by the protocol itself.

## Conclusion

Choir's tokenomics model is designed to create a self-sustaining ecosystem that rewards quality content creation, fosters collaboration, and drives the accumulation of a high-signal dataset. By aligning economic incentives with platform goals, Choir aims to revolutionize content curation and pave the way for advanced AI models that excel in both technical and qualitative aspects of content generation.

The integration of blockchain technology, innovative token mechanics, and the Authors Chat feature creates a unique environment where content is treated as a valuable, evolving asset. This approach not only incentivizes users to contribute meaningfully but also ensures that the platform continually improves and adapts to the needs of its community.

As Choir progresses towards its goal of launching an AI model by April 27, 2025, the tokenomics outlined in this whitepaper will play a crucial role in accumulating the world's highest signal human dataset. This dataset, enriched by token-scored content and collaborative curation, will serve as the foundation for training AI models that can generate content with unparalleled quality, relevance, and artistic merit.
