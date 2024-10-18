# Choir Ownership Model

## Current State

The Choir platform implements a unique ownership model that emphasizes collaborative content creation and curation. This document outlines the current state of ownership within Choir and provides guidelines for future development.

### Key Concepts

1. **Message Ownership**
   - Each message is owned by its creator.
   - Messages are the fundamental units of content within Choir.

2. **Thread Ownership**
   - Threads are owned collectively by the creators of the messages within them (co-authors).
   - The initial thread creator is the first co-author.

3. **Co-authorship**
   - Co-authors have full read-write access to the thread.
   - New co-authors are added when their messages are approved and published in the thread.

4. **Thread Accessibility**
   - All chat threads are accessible at `choir.chat/stream/<thread_id>`.
   - Co-authors have full read-write access to the thread.
   - Non-co-authors can view AI-generated summaries of the thread.

5. **Speculative Responses ("Specs")**
   - Non-co-authors can pay CHOIR tokens to submit a speculative response ("spec") to a thread.
   - Co-authors have a 7-day window to approve or deny the spec.
   - If approved unanimously, the spec is published, and the contributor becomes a co-author.
   - If denied, the spec is rejected, and rejecting co-authors split the staked tokens.

6. **Token Mechanics**
   - Threads have Solana accounts that store CHOIR tokens.
   - When a new message is approved, staked tokens go to the thread's token balance.
   - When a message is denied:
     - Rejecting co-authors split the staked tokens.
     - Any approvers get nothing.
     - Remaining tokens go to the Choir Treasury.

7. **Divestment**
   - Co-authors can divest their token share from a thread at any time.
   - Upon divestment, they receive a (1 / n - 1) share of the thread's CHOIR tokens.

8. **AI-Generated Summaries**
   - Non-co-authors can access AI-generated summaries of threads.
   - Summaries are designed to create interest and stimulate engagement.
   - They compress content to tease the full discussion.

## Path Forward

To fully implement and support this ownership model in the Choir codebase, the following steps should be taken:

1. **Update Message Model**
   - Add a `user_id` field to the `Message` model in `api/models.py`.
   - Ensure that every message creation includes the `user_id` of its creator.

2. **Implement Thread Ownership**
   - Create a `ThreadOwnership` model that links threads to their co-authors.
   - Update the `ChatThread` model to include a reference to the `ThreadOwnership` model.

3. **Develop Co-authorship Management**
   - Implement functions to add and remove co-authors from threads.
   - Create a mechanism to track and update co-authorship status.

4. **Integrate Solana Accounts for Threads**
   - Develop functionality to create and manage Solana accounts for each thread.
   - Implement token storage and management within these accounts.

5. **Implement Speculative Response Mechanism**
   - Create a `SpeculativeResponse` model to handle specs.
   - Develop the approval/denial process for specs, including token staking and distribution.

6. **Enhance Access Control**
   - Implement access control mechanisms based on co-authorship status.
   - Develop the AI-generated summary feature for non-co-authors.

7. **Token Distribution System**
   - Create a robust system for distributing tokens to threads and co-authors.
   - Implement the token split mechanism for denied messages.

8. **Divestment Functionality**
   - Develop a secure process for co-authors to divest their token share from a thread.
   - Ensure accurate calculation and distribution of tokens during divestment.

9. **Update Frontend Components**
   - Modify `StreamChat.tsx` and other relevant components to reflect the ownership model.
   - Implement UI elements for co-authorship management, spec submission, and divestment.

10. **Testing and Security**
    - Develop comprehensive tests for all new functionality.
    - Conduct security audits, especially for token-related operations.

11. **Documentation**
    - Update all relevant documentation to reflect the new ownership model.
    - Create user guides explaining the co-authorship and spec submission processes.

By following these steps, Choir can fully realize its unique ownership model, fostering a collaborative environment where high-quality content creation is incentivized and rewarded.

