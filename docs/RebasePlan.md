# Choir Rebase Plan

## Objective
Rebase the current Choir project to a new foundation using create-solana-dapp, implementing core features for the MVP launch on November 17th.

## Development Roadmap

### Week 1 (Oct 20-26): New Project Setup and Core Functionality
- Set up new project with create-solana-dapp
- Implement basic chat functionality and WebSocket connections
- Implement basic Chorus loop in Python backend
- Deploy to Azure and set up DNS

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

## Key Steps

1. Create New Project
   - Run `npx create-solana-dapp@latest choir-new`
   - Choose Next.js as the frontend framework
   - Select Tailwind CSS for styling

2. Port Essential Components
   - Transfer and adapt key components like StreamChat.tsx
   - Update imports and paths as needed

3. Implement Backend
   - Set up FastAPI backend with WebSocket support
   - Integrate Qdrant for vector storage
   - Implement basic Chorus loop functionality

4. Solana Integration
   - Set up Solana wallet connection in frontend
   - Implement mock token system initially

5. Testing and Refinement
   - Develop comprehensive test suites
   - Conduct thorough testing of all features
   - Refine UI/UX based on testing feedback

6. Documentation and Deployment
   - Update all project documentation
   - Prepare for MVP launch
   - Deploy to production environment

## Notes
- Prioritize core features essential for MVP
- Use rapid prototyping techniques
- Implement a simplified version of the ownership model initially
- Focus on a manageable set of features for the initial release
