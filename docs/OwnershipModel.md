# Choir Ownership Model

## Current State

The Choir platform implements a unique ownership model that emphasizes collaborative content creation and curation. This document outlines the current state of ownership within Choir and provides guidelines for implementation in the accelerated MVP launch (October 31st, 2023).

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

To implement and support this ownership model in the Choir codebase by October 31st, the following steps will be taken:

1. **Solana Program Development (Oct 24)**
   - Implement Thread account structure
   - Develop message and spec handling
   - Create token management system

2. **Backend Integration (Oct 25)**
   - Update Message Model with ownership fields
   - Implement ThreadOwnership handling
   - Integrate with Solana program

3. **Frontend Implementation (Oct 26)**
   - Update UI components for ownership display
   - Implement co-authorship management interface
   - Add token balance visualization

4. **Testing and Refinement (Oct 27-30)**
   - Comprehensive testing of ownership mechanics
   - Security audit of token operations
   - User feedback integration

By following these steps, Choir can fully realize its unique ownership model, fostering a collaborative environment where high-quality content creation is incentivized and rewarded.
