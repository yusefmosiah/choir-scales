# **Choir Tokenomics Whitepaper**

---

## **Abstract**

Choir presents an innovative socioeconomic media network that leverages blockchain technology to redefine content creation, curation, and collaboration. Central to Choir's ecosystem is the Choir Token (CHOIR), a cryptocurrency meticulously designed to incentivize meaningful contributions, foster high-quality content, and promote collaborative editing. This whitepaper delineates the comprehensive tokenomics of Choir, elucidating the mechanisms of token distribution, circulation, and economic incentives that underpin user engagement and platform sustainability.

---

## **Introduction**

In the digital landscape, the proliferation of content has democratized information sharing but has also introduced challenges related to content quality, credibility, and meaningful collaboration. Traditional social media platforms often rely on centralized algorithms that prioritize engagement over substance, leading to issues like misinformation and low-quality content proliferation.

Choir addresses these challenges by creating a decentralized platform where content and its metadata are treated as valuable assets. By integrating blockchain technology and a thoughtfully designed token economy, Choir incentivizes users to produce original, high-quality content, engage in collaborative editing, and invest in the platform's growth. This approach not only enhances content quality but also fosters a vibrant, engaged community.

---

## **Token Overview**

- **Token Name**: Choir Token
- **Token Symbol**: CHOIR
- **Total Supply**: 10,000,000,000 (10 billion) tokens (Hard Cap)
- **Token Standard**: Solana Program Library (SPL) Token
- **Initial Allocation**: All 10 billion tokens minted to the Choir Treasury at genesis

---

## **Key Entities in the Choir Ecosystem**

1. **Choir Treasury**
   - **Description**: The central repository holding the entire initial supply of CHOIR tokens.
   - **Functionality**:
     - Distributes tokens to users as rewards for content creation and automatic citations.
     - Recaptures tokens from specific protocol mechanisms, such as split edit decisions.
     - Maintains the economic balance of the platform by controlling token flow.

2. **Users**
   - **Description**: Participants who create content, propose edits, and engage in the collaborative ecosystem.
   - **Functionality**:
     - Receive tokens from the Choir Treasury based on their contributions.
     - Invest tokens into content through collaborative editing.
     - Can divest their share of tokens from content accounts, relinquishing authorship.

3. **Edit Escrow Contracts**
   - **Description**: Smart contracts that temporarily hold tokens while an edit proposal is under consideration.
   - **Functionality**:
     - Manage the staking and distribution of tokens based on edit approval outcomes.
     - Ensure secure and transparent handling of tokens during the edit lifecycle.

4. **Content Accounts**
   - **Description**: Blockchain accounts representing individual pieces of content.
   - **Functionality**:
     - Store the token score of the content, reflecting its accumulated value.
     - Maintain records of co-authors and their respective token shares.
     - Facilitate token accumulation and investment within the content.

---

## **Token Distribution Mechanisms**

### **1. Initial Token Allocation**

- **Total Tokens**: 10 billion CHOIR tokens.
- **Allocation**: Entirely minted to the Choir Treasury at platform inception.
- **Purpose**: Serves as the foundational economic resource for rewarding user activities and maintaining platform operations.

### **2. Content Creation Rewards**

- **Mechanism**: Users earn tokens by creating original content.
- **Variable Reward System**:
  - **Semantic Sparsity Factor**: The reward for content creation is inversely proportional to the density of similar content in the semantic space.
  - **High-Entropy Content Incentivization**: Unique, high-quality, and innovative content receives higher rewards, promoting diversity and originality.

- **Formula**:

  \[
  \text{Reward} = T_c \times \left(1 + \frac{S_{\text{max}} - S_{\text{content}}}{S_{\text{max}}} \right)
  \]

  - \( T_c \): Base token reward per content creation.
  - \( S_{\text{content}} \): Semantic similarity score of the new content to existing content.
  - \( S_{\text{max}} \): Maximum possible similarity score.

- **Token Allocation**:
  - **Creators**: Receive a portion of the minted tokens based on content uniqueness.
  - **Content's Token Balance**: Accumulates tokens, enhancing content visibility and ranking.

### **3. Automatic Citation Rewards**

- **Mechanism**: When new content is created, the system automatically cites relevant existing content using a reranking algorithm.
- **Token Distribution**:
  - **Cited Authors**: Receive tokens as a reward for their content being referenced.
  - **Allocation Ratio**: A predefined fraction of the content creation reward is allocated for citations.

- **Example**:
  - If 50% of the content creation reward is designated for citations, this portion is distributed among all cited authors proportionally based on relevance.

### **4. Collaborative Editing and Token Investment**

- **Edit Proposals**:
  - **Process**: Users propose edits to existing content by staking tokens in an edit escrow contract.
  - **Staking Requirement**: A fixed number of tokens must be staked to initiate an edit proposal, representing an investment in the content's improvement.

- **Approval Process**:
  - **Review Window**: Co-authors have a 7-day period to approve or reject the proposed edit.
  - **Abstention Rule**: If co-authors neither approve nor reject within 7 days, their abstention is treated as an implicit approval.

- **Token Distribution Based on Outcomes**:
  - **Approval (Explicit or Implicit)**:
    - **Content's Token Balance**: Receives the staked tokens, enhancing content's visibility and ranking.
    - **Editor**: Becomes a co-author, gaining veto power over future edits.

  - **Denial**:
    - **Rejecting Authors**: Receive a portion of the staked tokens as a reward for maintaining content integrity.
    - **Editor**: Loses the staked tokens.

- **Divestment Mechanism**:
  - **Process**: Authors can divest their share of tokens from a content account, relinquishing authorship.
  - **Token Retrieval**:
    - **Formula**: An author can divest and receive \(\frac{\text{Content Account Tokens}}{n - 1}\) tokens, where \(n\) is the total number of authors.
    - **Example**:
      - If there are 7 authors, an author divesting receives \(\frac{\text{Content Tokens}}{6}\).
      - If there are 2 authors, the divesting author receives all tokens, leaving the remaining author with an empty account.

- **Economic Gamification**:
  - **Buyable Assets**: Content can be invested in through collaborative editing, representing shared ownership.
  - **Sellable Assets**: Authors can divest their share, transferring control to those who value the content's future.
  - **Hot Potato Nature**: Encourages active investment and discourages passive ownership, promoting a dynamic content ecosystem.

### **5. Token Recapture from Split Edit Decisions**

- **Mechanism**: In scenarios where there is no unanimous decision on edit proposals, a portion of the staked tokens is recaptured by the Choir Treasury.
- **Purpose**: Maintains the economic balance by ensuring the Treasury remains a central node in token distribution.

---

## **Token Flow Summary**

1. **Initial Allocation**:
   - 10 billion CHOIR tokens are minted to the Choir Treasury.

2. **From Treasury to Users**:
   - Tokens are distributed as rewards for content creation and automatic citations.

3. **From Users to Content Accounts**:
   - Users invest tokens into content through proposing edits, which upon approval, are transferred to the content's token balance.

4. **Within Content Accounts**:
   - Accumulated tokens enhance content visibility and ranking.
   - Tokens represent the collective investment in the content's quality and relevance.

5. **Divestment**:
   - Authors can divest their share of tokens from content accounts, receiving a proportional amount based on the total number of co-authors.

6. **Recapture by Treasury**:
   - Tokens from split edit decisions are returned to the Choir Treasury for future distribution.

---

## **Economic Incentives and Benefits**

### **1. Encouraging Original and High-Quality Content**

- **Semantic Sparsity Rewards**: Users are incentivized to create unique content that occupies sparse regions in the semantic space, promoting originality and discouraging redundancy.
- **High-Entropy Content Support**: Innovative and AI-generated content that enriches the platform's diversity is rewarded, fostering creativity.

### **2. Promoting Collaborative Editing**

- **Shared Ownership**: Editors who successfully propose edits become co-authors, fostering a sense of ownership and responsibility for content quality.
- **Veto Power**: Co-authors gain the ability to veto future edits, ensuring that content remains aligned with collective standards.

### **3. Ensuring Content Visibility and Ranking**

- **Token Accumulation**: Content with higher token balances is more visible on the platform, encouraging continuous improvement and investment.
- **Reranking Algorithm**: Automatically surfaces high-quality content based on token scores and semantic relevance, enhancing user experience.

### **4. Sustainable Token Economy**

- **Hard Cap**: The total supply of 10 billion CHOIR tokens ensures scarcity and potential value appreciation.
- **No In-Protocol Burning**: Tokens remain within the ecosystem, maintaining a stable token economy while allowing users to manage their tokens freely.
- **Token Recapture Mechanism**: Ensures the Choir Treasury sustains token distribution over time, preventing inflation.

### **5. Dynamic and Engaged Community**

- **Hot Potato Divestment**: Encourages active participation and investment in content, as authors who do not believe in a content's future value can divest, transferring control to those who do.
- **Economic Gamification**: Treating content as buyable and sellable assets creates a dynamic marketplace that rewards meaningful contributions and active engagement.

---

## **Token Supply Management**

### **Hard Cap**

- **Total Supply**: 10 billion CHOIR tokens.
- **Enforcement**: A hard cap ensures that no more than 10 billion tokens can ever exist, preserving scarcity and value.

### **Initial Allocation**

- **Choir Treasury**: All 10 billion tokens are minted to the Choir Treasury at genesis, serving as the primary source for distributing tokens to users.

### **No In-Protocol Burning**

- **Policy**: The Choir protocol does not include mechanisms for burning tokens.
- **User Freedom**: Users retain the ability to send tokens to any address, including inactive or "burn" addresses, but the protocol itself does not facilitate or enforce burning.

### **Token Recapture**

- **Mechanism**: Tokens from split edit decisions are returned to the Choir Treasury.
- **Purpose**: Maintains the Treasury's role in sustaining token distribution and managing the ecosystem's economic balance.

---

## **Incentive Alignment**

### **Content Creators**

- **Rewards**: Receive tokens upon content creation and when their content is cited.
- **Incentive**: Produce original, high-quality content to maximize token rewards and content visibility.

### **Editors**

- **Cost**: Stake tokens to propose edits, representing an investment in content quality.
- **Rewards**:
  - **Approval**: Gain co-authorship and enhance the content's token balance.
  - **Denial**: Receive tokens from rejecting authors, compensating for maintaining content integrity.
- **Incentive**: Propose valuable edits that are likely to be approved to gain rewards and co-authorship.

### **Authors**

- **Rewards**: Earn tokens from content citations and edit denials.
- **Incentive**: Maintain content quality by approving beneficial edits and rejecting harmful ones, ensuring the content remains valuable and relevant.

---

## **Divestment and Token Extraction**

### **Divestment Mechanism**

- **Process**:
  - **Unilateral Action**: Authors can choose to divest their share of tokens from a content account at any time.
  - **Token Retrieval**: Upon divestment, an author receives \(\frac{\text{Content Account Tokens}}{n - 1}\) tokens, where \(n\) is the total number of co-authors.

- **Examples**:
  - **7 Authors**: An author divesting receives \(\frac{\text{Content Tokens}}{6}\).
  - **2 Authors**: A divesting author receives all tokens in the content account, leaving the remaining author with an empty account.

### **Economic Implications**

- **Fair Token Distribution**: Ensures that tokens are fairly redistributed among remaining authors when one author divests.
- **Hot Potato Dynamics**: Encourages active investment in content by allowing authors who no longer believe in its value to divest, transferring control to those who do.
- **Content as an Asset**: Reinforces the notion of content being a valuable, buyable, and sellable asset within the platform.

### **Incentive Structures**

- **Encourages Commitment**: Authors are motivated to contribute meaningfully to content to maintain their share of tokens.
- **Prevents Token Hoarding**: By allowing token retrieval through divestment, the system discourages users from passively holding tokens without contributing.

---

## **Preventing Token Inflation and Ensuring Sustainability**

### **Fixed Token Supply**

- **Hard Cap**: The total supply of 10 billion CHOIR tokens ensures that the ecosystem remains deflationary, preserving token value over time.

### **Dynamic Reward Adjustment**

- **Content Creation Rewards**: Adjusted based on semantic sparsity to balance token distribution and reward originality.
- **Token Recapture**: Ensures that tokens from unsuccessful edit proposals are reintegrated into the Treasury, maintaining a steady token flow.

### **No In-Protocol Burning**

- **Policy**: By not incorporating burning mechanisms, the protocol maintains a predictable token supply.
- **User-Controlled Burning**: Users retain the freedom to burn tokens by sending them to inactive addresses, but this is not a feature managed by the protocol itself.

### **Token Decay Mechanism**

- **Controlled Inflation**: A token decay rate ensures that tokens do not accumulate excessively, maintaining economic balance.

---

## **Token Flow Diagram**

1. **Initial Allocation**:
   - 10 billion CHOIR tokens minted to the Choir Treasury.

2. **From Treasury to Users**:
   - Tokens distributed as rewards for content creation and automatic citations.

3. **From Users to Content Accounts**:
   - Users invest tokens into content through proposing edits.

4. **Within Content Accounts**:
   - Accumulated tokens enhance content visibility and ranking.
   - Tokens represent collective investment in content quality.

5. **Divestment**:
   - Authors divest their share of tokens from content accounts, receiving a proportional amount based on the number of co-authors.

6. **Recapture by Treasury**:
   - Tokens from split edit decisions are returned to the Choir Treasury.

---

## **Security and Compliance**

### **Smart Contract Audits**

- **Regular Audits**: Conduct thorough audits of all smart contracts to identify and mitigate vulnerabilities.
- **Best Practices**: Adhere to industry standards in smart contract development to ensure security and reliability.

### **Regulatory Compliance**

- **Legal Framework**: Comply with relevant laws and regulations pertaining to cryptocurrency issuance and transactions.
- **Transparency**: Maintain transparent token distribution and economic policies to build trust and ensure compliance.

### **User Education**

- **Documentation**: Provide comprehensive guides and resources to help users understand Choir's tokenomics and their roles within the ecosystem.
- **Support**: Offer support channels for users to seek assistance and clarify doubts related to token management and platform usage.

---

## **Conclusion**

Choir's tokenomics are meticulously crafted to create a sustainable, decentralized, and collaborative ecosystem that values high-quality content and active user engagement. By treating content as valuable assets and integrating a robust token distribution mechanism, Choir incentivizes meaningful contributions and fosters a vibrant community.

The fixed token supply, combined with dynamic reward adjustments and a fair divestment mechanism, ensures economic stability and aligns user incentives with platform goals. As users create, cite, and collaboratively edit content, they actively participate in shaping the platform's content landscape, promoting a culture of quality, originality, and collaboration.

Choir stands as a transformative platform in the social media landscape, offering a fair, transparent, and incentive-aligned environment where content quality and user contributions are genuinely valued and rewarded.

---

Chorus AI Appendix

The Chorus AI is a decision-making model used in Choir to process user prompts and generate refined responses. It consists of several iterative steps that help in refining content and making informed decisions. Here’s a detailed breakdown of each step in the Chorus AI:

- Action:

- Description: This is the initial step where an initial response to the user's prompt is generated.

- Process: The system acts with a "beginner's mind" and provides an initial response based on the user's input.

- Example: A user submits a prompt, and the system generates a preliminary response.

- Experience:

- Description: In this step, the system searches for relevant context to refine the initial response.

- Process: The system searches its memory (using embeddings and a vector database) for relevant information that could help improve the initial response. During this step, content creation rewards and citation rewards are distributed.

- Example: The system retrieves similar past responses or related content to provide a more informed answer. Both the content creator and the cited sources earn Choir tokens for their contributions.

- Intention:

- Description: This step involves reflecting on the user's intention and whether the query can be satisfactorily responded to based on the retrieved context.

- Process: The system reflects on the goal of the user's query and assesses if the response meets the user's needs.

- Example: The system evaluates if the retrieved context and initial response align with the user's intended query.

- Observation:

- Description: Key insights from the iteration are noted to improve future responses.

- Process: The system notes any key insights or learnings from the current iteration and saves them to a global vector database.

- Example: The system saves useful information that could help in future similar queries.

- Update:

- Description: This step decides whether to perform another round of the loop or to provide a final answer.

- Process: The system decides whether to loop again to further refine the response or to finalize the answer.

- Example: The system may decide to loop again if the response is not satisfactory or finalize the response if it meets the user's needs.

- Yield:

- Description: This is the final step where the accumulated context from all iterations is synthesized to provide a comprehensive final response.

- Process: The system synthesizes all the gathered information and iterations to provide a final, refined response.

- Example: The system provides a final, well-informed response to the user's query.

### Example Workflow in Choir

When a user makes content in Choir, the Chorus AI can be used to refine and improve the content before it is stored and cited. Here’s how the Chorus AI might be applied:

- User Prompt: A user inputs text or uploads content.

- Action: The system generates an initial response or embedding for the content.

- Experience: The system searches for similar content or context to refine the initial response. During this step, content creation rewards and citation rewards are distributed to the content creator and cited sources, respectively.

- Intention: The system reflects on the user's intention and assesses if the response meets the user's needs.

- Observation: Key insights from the iteration are noted and saved for future use.

- Update: The system decides whether to loop again or finalize the response.

- Yield: The system synthesizes all gathered information to provide a final, refined response.

By following the Chorus AI, Choir ensures that the content is well-refined and contextually relevant, enhancing the overall quality and reliability of the platform. Additionally, the Experience step incentivizes content creation and citation by distributing rewards, fostering a collaborative and rewarding environment.

### Reranking Sub-Appendix

The current Chorus AI uses similarity search to find relevant content. However, the Choir reranking system should consider multiple dimensions to provide a more comprehensive and meaningful ranking. The reranking should be based on the following five dimensions:

- Highest Token Count:

- Description: Content with the highest number of tokens staked.

- Purpose: Prioritizes content that has received significant support from the community.

- Highest Raw Similarity:

- Description: Content that is most similar to the user's input based on embeddings.

- Purpose: Ensures that the most contextually relevant content is considered.

- Oldest Relevant:

- Description: The oldest content that is still relevant to the user's input.

- Purpose: Highlights content that has stood the test of time and remains relevant.

- Newest Relevant:

- Description: The most recent content that is relevant to the user's input.

- Purpose: Brings attention to the latest contributions and updates.

- Most Coauthors:

- Description: Content that has the highest number of coauthors.

- Purpose: Emphasizes collaborative efforts and diverse perspectives.

### Reranking Process

- Initial Retrieval: Pull approximately 200 similar files based on the initial similarity search.

- Reranking: Rerank the retrieved files along the five dimensions mentioned above.

- Top Selection: Select the top 20 files in each category.

- Final List: Combine and present the final list of top-ranked content to the user.

By incorporating these dimensions into the reranking process, Choir can provide a more nuanced and valuable set of content recommendations, enhancing the user experience and fostering a richer, more collaborative environment.

## **Disclaimer**

This whitepaper is for informational purposes only and does not constitute investment advice or a solicitation to buy or sell any tokens or securities. The details provided herein are subject to change as the platform develops. Users and participants should conduct their own research and exercise caution when engaging with blockchain technologies and cryptocurrencies.

---
