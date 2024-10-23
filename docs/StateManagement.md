# Choir State Management Model

## Overview

Choir implements a dual-state architecture where:

1. **Solana State (Source of Truth for Ownership)**
   - Thread ownership and co-authorship
   - Token balances and stakes
   - Approval states
   - Content hashes (for verification)

2. **Qdrant State (Content and Search)**
   - Message content
   - Embeddings for search
   - AI training data
   - Optional privacy controls

## State Flow

1. **Message Creation**
   ```mermaid
   graph TD
       A[User Creates Message] -->|Content| B[Qdrant]
       A -->|Hash & Metadata| C[Solana]
       C -->|Ownership & Tokens| D[Thread State]
       B -->|Search & Citations| E[User Queries]
   ```

2. **Privacy Controls**
   - Premium users can opt out of search indexing
   - Content remains in thread but isn't searchable
   - Hash still stored on-chain for verification

3. **State Synchronization**
   - Solana events trigger Qdrant updates
   - Backend validates state consistency
   - Frontend subscribes to both states
