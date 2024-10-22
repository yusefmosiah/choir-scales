# Rebase Plan for Choir Scales

## Objective
Rebase the current Choir Scales project from the outdated solana-dapp-scaffold to the more stable and up-to-date create-solana-dapp foundation.

## Steps

1. Create New Project
   - Run `npx create-solana-dapp@latest choir-scales-new`
   - Choose Next.js as the frontend framework
   - Select Tailwind CSS for styling
   - Opt for Anchor if using it for Solana programs

2. Review New Project Structure
   - Compare the new structure with the current one (refer to `tree.md`)
   - Identify differences and plan for necessary adjustments

3. Port Next.js Code
   - Copy custom components from `src/components` to the new project
   - Update imports and paths as needed
   - Special attention to `StreamChat.tsx` and other complex components
   - Ensure all TypeScript types are correctly transferred or updated

4. Port Python Backend
   - Create an `api` directory in the new project root
   - Copy all Python files from the current `api` directory
   - Transfer `requirements.txt` to the new `api` directory

5. Update Configuration Files
   - Merge `next.config.js` contents, keeping new project's base configuration
   - Update `package.json`:
     - Add scripts for running Python backend
     - Include `concurrently` for running frontend and backend simultaneously
   - Transfer and update `tsconfig.json` as needed

6. Update Dockerfile
   - Copy the existing Dockerfile to the new project
   - Update paths and commands based on the new structure
   - Ensure it includes steps for both frontend and backend builds

7. Update GitHub Actions
   - Copy `.github/workflows/deploy.yml` and `.github/workflows/frontend.yml`
   - Update steps in `deploy.yml` for the new project structure:
     - Adjust build and push commands
     - Update Azure deployment steps if necessary
   - Modify `frontend.yml`:
     - Update Node.js version to 20
     - Adjust cache paths and build commands

8. Transfer Additional Files
   - Copy `docs` directory to maintain project documentation
   - Transfer `public` directory contents
   - Move any custom hooks from `src/hooks`
   - Copy and update context providers from `src/contexts`

9. Update Dependencies
   - Review `package.json` and update dependencies as needed
   - Ensure compatibility with the new create-solana-dapp structure

10. Testing
    - Thoroughly test all ported components and functionality
    - Pay special attention to Solana wallet integration and WebSocket connections
    - Verify that the Python backend works correctly with the new frontend

11. Documentation Update
    - Update `README.md` with new setup instructions
    - Revise any project-specific documentation in the `docs` folder
    - Update `tree.md` to reflect the new project structure

12. Clean Up
    - Remove any unused files or dependencies from the new project
    - Ensure all imports are correctly updated across the project

13. Version Control
    - Initialize a new git repository in the new project
    - Commit the initial state of the new project
    - Carefully merge in changes from the old repository, resolving conflicts

14. Final Testing and Deployment
    - Conduct a final round of testing on all features
    - Update deployment scripts or configurations if necessary
    - Deploy the new version and verify functionality in the production environment

## Notes
- Throughout the process, maintain frequent commits to easily track changes and revert if necessary.
- Consider setting up a staging environment to test the rebased application before full deployment.
- Keep the old project accessible for reference until the rebase is complete and verified.
