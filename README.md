2024-09-18T19:07:44-04:00
Yusef Mosiah Nathanson
Creating a Proof of Intersubjective Content Quality
In the evolving landscape of social media, the challenge of maintaining high-quality content while fostering genuine user engagement remains paramount. Traditional platforms often struggle with content moderation, echo chambers, and the monetization paradox, where content creators are incentivized more by quantity than quality. Choir seeks to address these issues by introducing a novel consensus mechanism known as Proof of Intersubjective Content Quality. This essay delves into how Choir's unique approach ensures content integrity, fosters collaboration, and aligns incentives within its socioeconomic ecosystem.

Understanding Intersubjectivity in Content Quality

Intersubjectivity refers to the shared understanding and agreement among multiple subjects (users) about a particular concept or content quality. In the context of Choir, it implies that content is not just created by individuals but is collectively curated and validated by the community. This shared validation process ensures that content meets certain quality standards agreed upon by the majority, thereby enhancing its reliability and value.

Choir's Consensus Mechanism

At the heart of Choir's approach lies the Edit Proposal and Approval Process, which embodies the Proof of Intersubjective Content Quality. This mechanism involves several steps:

Content Creation and Token Minting

Users create content by submitting text, images, or files.

Upon submission, the content is embedded using OpenAI's API and stored in the Qdrant vector database.

Choir tokens are minted and distributed to the content creator and any cited sources, incentivizing original creation and proper referencing.

Proposing Edits

Users can propose edits to existing content by spending a certain amount of Choir tokens.

This cost ensures that edit proposals are meaningful and discourage frivolous changes.

Consensus Building through Approval and Rejection

Unanimous Approval: If all authors of the original content approve the edit, the proposed changes are applied. The tokens spent by the editor are added to the content's token balance, making it more likely to be cited in the future. Additionally, the editor gains veto power, being added to the author set.

Unanimous Rejection: If all authors reject the edit, the tokens spent by the editor are distributed among the rejecting authors, rewarding them for maintaining content quality.

Split Decision: In cases where some authors approve and others reject the edit, the tokens intended for approvers are redirected to the Choir Treasury, while those for rejecters are distributed to the rejecting authors. This ensures that partial consensus still rewards users who contribute to content curation while preventing token inflation.

Auto-Rejection Mechanism

If an edit proposal remains unresolved for a predetermined period (e.g., one week), it is automatically rejected. Tokens are then distributed accordingly, and the rejected edits are hidden from the public, visible only to authors.

Incentive Alignment

The Proof of Intersubjective Content Quality relies heavily on aligning incentives to promote high-quality content and responsible curation:

Content Creators and Citing Authors: Earn tokens for their contributions, encouraging original and well-referenced content.

Editors: Motivated to propose meaningful edits that enhance content quality, as successful edits can accrue tokens to the content and confer veto power.

Rejecting Authors: Rewarded for rejecting low-quality or inappropriate edits, incentivizing vigilance in content curation.

Choir Treasury: Accumulates tokens from split decisions and fees, supporting platform development and governance, ensuring sustainability.

Ensuring Fairness and Decentralization

Choir's consensus mechanism is designed to be fair and decentralized:

Unanimous Approval Requirement: Ensures that edits align with the original intent and quality standards, preventing unilateral changes that could degrade content.

Token Redistribution: By redistributing tokens based on approval outcomes, Choir ensures that users are compensated in proportion to their contributions, whether in approving or rejecting edits.

Veto Power for Editors: Incorporating editors into the author set fosters a collaborative environment where multiple stakeholders have a say in content evolution.

Benefits of Proof of Intersubjective Content Quality

High-Quality Content: Collective curation ensures that only content meeting community standards persists, enhancing the overall quality of the platform.

User Empowerment: Users have a tangible stake in content quality, fostering a sense of ownership and responsibility.

Sustainable Token Economy: Thoughtful token distribution and decay mechanisms prevent inflation and promote long-term engagement.

Decentralized Governance: Future integration of governance protocols empowers the community to influence platform directions and resource allocations, aligning platform growth with user interests.

Challenges and Considerations

While the Proof of Intersubjective Content Quality presents a robust framework, it comes with challenges:

Consensus Bottlenecks: Requiring unanimous approval might slow down content updates, especially in large author sets. Balancing speed and quality is crucial.

Token Distribution Complexity: Ensuring fair and transparent token distribution, especially in split decisions, requires meticulous design to prevent manipulation.

Scalability: As the platform grows, maintaining efficient consensus mechanisms without compromising decentralization or performance is essential.

Conclusion

Choir's Proof of Intersubjective Content Quality represents a pioneering approach to content curation in the social media landscape. By leveraging a consensus-driven edit process anchored in token-based incentives, Choir ensures that content quality is upheld collectively. This mechanism not only fosters a high-quality, collaborative environment but also aligns economic incentives with community-driven governance, paving the way for a sustainable and equitable social media ecosystem.

As Choir progresses, continuous refinement of this consensus mechanism will be vital to address scalability and maintain balance between speed and quality. Nevertheless, Choir stands at the forefront of reimagining social media, where content integrity and user collaboration are seamlessly integrated through innovative blockchain technology.



———

# Solana dApp Scaffold Next

The Solana dApp Scaffold repos are meant to house good starting scaffolds for ecosystem developers to get up and running quickly with a front end client UI that integrates several common features found in dApps with some basic usage examples. Wallet Integration. State management. Components examples. Notifications. Setup recommendations.

Responsive                     |  Desktop
:-------------------------:|:-------------------------:
![](scaffold-mobile.png)  |  ![](scaffold-desktop.png)

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The responsive version for wallets and wallet adapter may not function or work as expected for mobile based on plugin and wallet compatibility. For more code examples and implementations please visit the [Solana Cookbook](https://solanacookbook.com/)

## Installation

```bash
npm install
# or
yarn install
```

## Build and Run

Next, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Features

Each Scaffold will contain at least the following features:

```
Wallet Integration with Auto Connec / Refresh

State Management

Components: One or more components demonstrating state management

Web3 Js: Examples of one or more uses of web3 js including a transaction with a connection provider

Sample navigation and page changing to demonstate state

Clean Simple Styling

Notifications (optional): Example of using a notification system

```

A Solana Components Repo will be released in the near future to house a common components library.


### Structure

The scaffold project structure may vary based on the front end framework being utilized. The below is an example structure for the Next js Scaffold.

```
├── public : publically hosted files
├── src : primary code folders and files
│   ├── components : should house anything considered a resuable UI component
│   ├── contexts` : any context considered reusable and useuful to many compoennts that can be passed down through a component tree
│   ├── hooks` : any functions that let you 'hook' into react state or lifecycle features from function components
│   ├── models` : any data structure that may be reused throughout the project
│   ├── pages` : the pages that host meta data and the intended `View` for the page
│   ├── stores` : stores used in state management
│   ├── styles` : contain any global and reusable styles
│   ├── utils` : any other functionality considered reusable code that can be referenced
│   ├── views` : contains the actual views of the project that include the main content and components within
style, package, configuration, and other project files

```

## Contributing

Anyone is welcome to create an issue to build, discuss or request a new feature or update to the existing code base. Please keep in mind the following when submitting an issue. We consider merging high value features that may be utilized by the majority of scaffold users. If this is not a common feature or fix, consider adding it to the component library or cookbook. Please refer to the project's architecture and style when contributing.

If submitting a feature, please reference the project structure shown above and try to follow the overall architecture and style presented in the existing scaffold.

### Committing

To choose a task or make your own, do the following:

1. [Add an issue](https://github.com/solana-dev-adv/solana-dapp-next/issues/new) for the task and assign it to yourself or comment on the issue
2. Make a draft PR referencing the issue.

The general flow for making a contribution:

1. Fork the repo on GitHub
2. Clone the project to your own machine
3. Commit changes to your own branch
4. Push your work back up to your fork
5. Submit a Pull request so that we can review your changes

**NOTE**: Be sure to merge the latest from "upstream" before making a
pull request!

You can find tasks on the [project board](https://github.com/solana-dev-adv/solana-dapp-next/projects/1)
or create an issue and assign it to yourself.


## Learn More Next Js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
