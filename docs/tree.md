# Choir Scales Directory Structure
## Output of $ tree -I 'venv|node_modules' | pbcopy

.
├── Dockerfile
├── LICENSE
├── README.md
├── api
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-312.pyc
│   │   ├── chorus.cpython-312.pyc
│   │   ├── config.cpython-312.pyc
│   │   ├── database.cpython-312.pyc
│   │   ├── main.cpython-312.pyc
│   │   ├── models.cpython-312.pyc
│   │   ├── stream_response.cpython-312.pyc
│   │   ├── utils.cpython-312.pyc
│   │   └── vowel_loop.cpython-312.pyc
│   ├── chorus.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   └── utils.py
├── docs
│   ├── 1-pager.md
│   ├── AIFormalMethods.md
│   ├── APIPatterns.md
│   ├── AccessibilityPrinciples.md
│   ├── Blueprint.md
│   ├── BusinessModel.md
│   ├── ChoirComprehensive.md
│   ├── ChorusDevPlan.md
│   ├── ConceptualBridges.md
│   ├── ConsistencyModel.md
│   ├── Context.md
│   ├── CoreInvariants.md
│   ├── CoreTypes.md
│   ├── DensityAnalysis.md
│   ├── Diagrams.md
│   ├── DocEvolution.md
│   ├── DocumentNetwork.md
│   ├── EconomicModel.md
│   ├── EmergenceDocumentation.md
│   ├── EmergenceRing.md
│   ├── EmergentAlgebra.md
│   ├── Glossary.md
│   ├── Guide.md
│   ├── ImplementationStrategy.md
│   ├── Index.md
│   ├── IntegrationPatterns.md
│   ├── InversePrivateEquity.md
│   ├── MessageLifecycle.md
│   ├── MetaDocumentation.md
│   ├── MetastableStates.md
│   ├── OwnershipModel.md
│   ├── PrivacyModel.md
│   ├── ProofOfText.md
│   ├── PseudocodeConventions.md
│   ├── Q&A.md
│   ├── QuantumSemantics.md
│   ├── RebasePlan.md
│   ├── RecursiveEmergence.md
│   ├── SecurityModel.md
│   ├── StateAlgebra.md
│   ├── StateAlgebraExplained.md
│   ├── StateMachine.md
│   ├── StateManagement.md
│   ├── StateSpaceTopology.md
│   ├── StateTransitions.md
│   ├── ThreadAssetEvolution.md
│   ├── VersioningAndBestPractices.md
│   ├── VisionStatement.md
│   ├── WebSocketProtocol.md
│   ├── Whitepaper.md
│   └── tree.md
├── jest.config.js
├── jest.setup.js
├── next-env.d.ts
├── next.config.js
├── notebooks
│   └── create_collections.ipynb
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── solanaLogo.png
│   └── vercel.svg
├── scaffold-desktop.png
├── scaffold-mobile.png
├── src
│   ├── components
│   │   ├── AIResponse.tsx
│   │   ├── AppBar.tsx
│   │   ├── ChatThreadList.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── ChorusPanel.tsx
│   │   ├── ChorusStep.tsx
│   │   ├── ContentContainer.tsx
│   │   ├── FinalResponse.tsx
│   │   ├── Footer.tsx
│   │   ├── NetworkSwitcher.tsx
│   │   ├── Notification.tsx
│   │   ├── RequestAirdrop.tsx
│   │   ├── SendTransaction.tsx
│   │   ├── SendVersionedTransaction.tsx
│   │   ├── SignMessage.tsx
│   │   ├── SourceCard.tsx
│   │   ├── SourcesList.tsx
│   │   ├── StreamChat.tsx
│   │   ├── Text
│   │   │   └── index.tsx
│   │   ├── UserInput.tsx
│   │   └── nav-element
│   │       └── index.tsx
│   ├── contexts
│   │   ├── AutoConnectProvider.tsx
│   │   ├── ContextProvider.tsx
│   │   └── NetworkConfigurationProvider.tsx
│   ├── hooks
│   │   ├── useAutoResizeTextarea.ts
│   │   ├── useQueryContext.tsx
│   │   └── useWebSocket.ts
│   ├── models
│   │   └── types.ts
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── api
│   │   │   └── hello.ts
│   │   ├── api-button.tsx
│   │   ├── basics.tsx
│   │   ├── index.tsx
│   │   └── stream.tsx
│   ├── program
│   │   ├── constants.rs
│   │   ├── error.rs
│   │   ├── lib.rs
│   │   ├── thread.rs
│   │   └── validation.rs
│   ├── stores
│   │   ├── useNotificationStore.tsx
│   │   └── useUserSOLBalanceStore.tsx
│   ├── styles
│   │   └── globals.css
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   ├── explorer.ts
│   │   ├── index.tsx
│   │   └── notifications.tsx
│   └── views
│       ├── basics
│       │   └── index.tsx
│       ├── home
│       │   └── index.tsx
│       └── index.tsx
├── tailwind.config.js
├── tests
│   ├── bankrun
│   │   ├── thread_test.rs
│   │   └── token_test.rs
│   ├── common
│   │   ├── fixtures.rs
│   │   └── mod.rs
│   └── thread_operations.rs
├── trident-tests
│   └── fuzz_tests
│       └── thread_fuzzer.rs
└── tsconfig.json

28 directories, 143 files
