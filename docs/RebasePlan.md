# Rebase Plan for Choir Scales

## Objective
Rebase the Choir Scales project using create-solana-dapp as the new foundation, with a focus on rapid development and deployment of an MVP within 30 days.

## Timeline
- Start Date: October 20, 2023
- Launch Date: November 17, 2023

## Steps

1. New Project Setup (Day 1-2)
   - Run `npx create-solana-dapp@latest choir-scales-new`
   - Choose Next.js as the frontend framework
   - Select Tailwind CSS for styling
   - Set up FastAPI backend in the new project structure

2. Core Functionality Development (Day 3-7)
   - Port essential components from the old project
   - Implement basic chat functionality and WebSocket connections
   - Develop simplified Chorus loop in Python backend
   - Deploy to Azure and set up DNS

3. Ownership Model Implementation (Day 8-13)
   - Develop co-authorship system
   - Implement thread ownership
   - Enhance Chorus loop with all steps (Action, Experience, Intention, Observation, Update, Final)

4. Tokenomics and Solana Integration (Day 14-21)
   - Implement mock CHOIR token system
   - Set up token staking for message submissions
   - Develop token distribution for approvals/denials
   - Begin Solana wallet integration

5. Testing and Refinement (Day 22-28)
   - Develop and run comprehensive test suites
   - Refine UI/UX, including AI-generated summaries
   - Update all project documentation

6. Final Deployment and Launch Preparation (Day 29-30)
   - Conduct final deployment
   - Prepare launch materials and marketing assets

## Key Focus Areas
- Rapid development of core features
- Simplified implementation of ownership model and tokenomics
- Basic Solana integration, with room for post-MVP enhancements
- Continuous testing and refinement throughout the process

## Post-Launch Plans
- Gather user feedback and iterate on features
- Enhance Solana integration and tokenomics
- Explore advanced features like governance and expanded AI capabilities

## Notes
- Maintain frequent commits and version control
- Prioritize essential features for MVP, deferring complex implementations for post-launch
- Ensure clear communication of MVP limitations and future plans to users and stakeholders
