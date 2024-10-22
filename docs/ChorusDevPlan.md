# Chorus Development Plan

## Overview

This document outlines the development plan for enhancing the Chorus loop, focusing on improving source handling, integration, and presentation throughout the process. The plan maintains the AEIOU(Y) structure (Action, Experience, Intention, Observation, Update, Yield) while introducing more interactive and context-aware ways of presenting sources to users, aligning with Choir's ownership model and token mechanics.

## Chorus Loop Steps

### 1. Action Step
- User input initiates the process
- Provide an initial response with "beginner's mind"/emptiness

### 2. Experience Step
- Retrieve the full list of sources from the database
- Pass the complete source list to the LLM along with the user's input
- LLM processes this information for subsequent steps
- Include user's co-authorship status for relevant threads

### 3. Intention Step
- Receive full source list and user input from the Experience step
- For each source, determine relevance and flag as "relevant" or "not relevant"
- Return a list of sources with their relevance flags
- Consider co-authorship status when determining relevance

### 4. Observation Step
- Select the most valuable sources from the set of relevant sources identified in the Intention step
- Determine which sources will be used in the final response
- Ensure selected sources align with the user's access rights based on co-authorship

### 5. Update Step
- Decide whether to proceed with the current plan or loop back for further refinement
- Include token staking mechanism for non-co-authors submitting speculative responses ("specs")

### 6. Yield Step
- Compose the final response, weaving in valuable sources identified in the Observation step
- Create source references as links to original chat threads
- For non-co-authors of a source thread, display source content between two short AI-generated summaries of the content before and after it
- Include information about token distribution for approved messages and specs

## Implementation Timeline

### Week 1 (Oct 20-26): Basic Chorus Loop
- Implement Action and Experience steps
- Set up basic source retrieval

### Week 2 (Oct 27-Nov 2): Enhanced Chorus Loop
- Implement Intention, Observation, and Update steps
- Integrate with ownership model

### Week 3 (Nov 3-9): Yield Step and Tokenomics
- Implement Yield step with source weaving
- Integrate mock token system

### Week 4 (Nov 10-16): Refinement and Testing
- Comprehensive testing of entire Chorus loop
- Refinement based on test results

## Future Enhancements
- Implement caching for frequently accessed sources
- Develop more sophisticated AI summarization techniques
- Integrate full Solana token system

## Implementation Details

### Data Models

1. Update Message Type:
   - Add a "sources" field to store valuable sources used in the yield step
   - Remove "top_sources" field if it exists
   - Add "user_id" field to track message ownership

2. Create ThreadOwnership Model:
   - Link threads to their co-authors
   - Include fields for token balance and Solana account address

### Components

1. AIResponse Component (src/components/AIResponse.tsx):
   - Update to display sources as links within the yield step content
   - Implement logic to show source content with surrounding summaries for non-co-authors
   - Include token distribution information for approved messages

2. StreamChat Component (src/components/StreamChat.tsx):
   - Modify to handle the new message structure with sources
   - Implement logic for retrieving and displaying source content when a user clicks a source link
   - Add functionality for submitting and managing speculative responses

3. ChatThreadList Component (src/components/ChatThreadList.tsx):
   - Update to reflect changes in thread structure due to new source handling
   - Include co-authorship information and token balances

### Backend

1. Chorus.py (api/chorus.py):
   - Update each step of the Chorus loop to implement new logic:
     - Experience: Retrieve and pass full source list, including co-authorship data
     - Intention: Implement source relevance flagging, considering co-authorship
     - Observation: Implement valuable source selection, respecting access rights
     - Yield: Modify to weave sources into response text, including token information
   - Implement AI summary generation for content before and after sources

2. Database:
   - Ensure efficient retrieval of the full list of sources for the Experience step
   - Implement efficient querying for retrieving source content and surrounding context for non-co-authors
   - Add support for storing and managing thread ownership and token balances

3. API/WebSocket:
   - Update to handle requests for source content when a user clicks a source link
   - Implement logic to determine if a user is a co-author of a source thread and return appropriate content
   - Add endpoints for submitting and managing speculative responses

4. Token Management:
   - Implement Solana program for managing thread token accounts
   - Create functions for token staking, distribution, and divestment

### Documentation

1. Update OwnershipModel.md (docs/OwnershipModel.md):
   - Reflect changes in how sources are handled and presented
   - Clarify co-authorship rules and their impact on source viewing

2. Update other relevant documentation to reflect changes in the Chorus loop and source handling

## Testing

1. Develop unit tests for each updated component and function
2. Implement integration tests to ensure proper flow through the entire Chorus loop
3. Conduct user testing to verify the effectiveness of the new source presentation method
4. Test token staking, distribution, and divestment processes

## Deployment

1. Update database schema to support new ownership and token models
2. Deploy backend changes, including Solana programs
3. Deploy frontend changes
4. Monitor system performance, token economics, and user feedback after deployment

## Future Considerations

1. Implement caching mechanisms for frequently accessed sources to improve performance
2. Explore AI-driven summarization improvements for non-co-author source viewing
3. Consider implementing a user feedback system for source relevance and usefulness
4. Develop governance mechanisms for adjusting token economics and platform rules

## Deployment Strategy

We are using a containerized approach for deploying both the frontend and backend:

- The application is containerized using Docker, combining the Next.js frontend and FastAPI backend in a single image.
- The container is built and pushed to Azure Container Registry (choir.azurecr.io).
- Deployment is managed through GitHub Actions, which builds the container and deploys it to Azure Container Instances.
- This approach ensures consistency between development and production environments and simplifies the deployment process.
