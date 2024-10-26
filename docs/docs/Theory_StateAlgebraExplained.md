# Understanding Choir's State Algebra in Plain English

## What is State?

Think of State as a snapshot of everything important in the system at any moment. In Choir, it's made up of three main parts:

1. **Thread Information**

   - Who are the co-authors?
   - When was it created?
   - What messages belong to it?

2. **Token Information**

   - How many tokens are in the thread?
   - What stakes are being held?
   - How are tokens being distributed?

3. **Content Information**
   - What's the actual message content?
   - How is it embedded (for AI)?
   - Is it public or private?

## Core Operations (What Can Happen)

1. **Creating a Thread**

   - Input: Someone wants to create a thread
   - What Happens:
     - They become the first co-author
     - Thread starts with zero tokens
     - Content starts empty
     - Everything is marked with a timestamp

2. **Submitting Content**

   - Input: Someone wants to add a message
   - What Happens:
     - If they're a co-author: Direct addition
     - If they're not: Creates a spec with stake
     - Content gets stored with its embedding

3. **Processing Approvals**
   - Input: Co-authors voting on content
   - What Happens:
     - Counts the votes
     - If everyone approves: Content gets added
     - If anyone denies: Stake gets distributed
     - If mixed: Nothing happens (stake to treasury)

## State Changes (How Things Transform)

Every operation must:

1. Keep tokens balanced (nothing created or destroyed)
2. Maintain ownership rules (only co-authors can approve)
3. Keep time moving forward (no backdating)
4. Keep everything consistent (no orphaned content)

## Privacy Rules

1. **Who Can See What**

   - Co-authors see everything in their threads
   - Others see only public summaries
   - Premium users can hide their content from search

2. **How Views Change**
   - Different users see different versions of the same thread
   - Token information hidden from non-co-authors
   - Content filtered based on permissions

## Token Distribution

1. **How Tokens Move**

   - Tokens split equally among recipients
   - No tokens can disappear
   - Every movement tracked and verified

2. **Approval Results**
   - Approve: Tokens go to thread
   - Deny: Tokens go to deniers
   - Mixed: Excess to treasury

## System Properties (What We Guarantee)

1. **Completeness**

   - You can always get from any valid state to any other valid state
   - Nothing gets stuck
   - Everything that should happen can happen

2. **Safety**

   - Tokens always add up correctly
   - Only owners can modify their stuff
   - Time always moves forward

3. **Liveness**
   - Messages always get processed eventually
   - Approvals always get resolved
   - System keeps moving forward

Think of it like a very strict accounting system where:

- Every change must balance
- Every action must be authorized
- Everything must happen in order
- Nothing can get lost or duplicated
