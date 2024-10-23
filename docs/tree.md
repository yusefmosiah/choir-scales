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
│   ├── Core_Blueprint.md
│   ├── Core_Comprehensive.md
│   ├── Core_Consistency.md
│   ├── Core_Context.md
│   ├── Core_Convergence.md
│   ├── Core_Economics.md
│   ├── Core_Invariants.md
│   ├── Core_Moat.md
│   ├── Core_Ownership.md
│   ├── Core_Persuasion.md
│   ├── Core_ProofOfText.md
│   ├── Core_StateTransitions.md
│   ├── Core_Types.md
│   ├── Core_Whitepaper.md
│   ├── Dev_FormalMethods.md
│   ├── Dev_Plan.md
│   ├── Dev_Pseudocode.md
│   ├── Dev_Rebase.md
│   ├── Dev_Strategy.md
│   ├── Dev_Versioning.md
│   ├── Entry_Accessibility.md
│   ├── Entry_Business.md
│   ├── Entry_Glossary.md
│   ├── Entry_Guide.md
│   ├── Entry_InverseEquity.md
│   ├── Entry_Overview.md
│   ├── Entry_QA.md
│   ├── Entry_Vision.md
│   ├── Impl_API.md
│   ├── Impl_ChorusLoop.md
│   ├── Impl_Integration.md
│   ├── Impl_Messages.md
│   ├── Impl_Privacy.md
│   ├── Impl_Security.md
│   ├── Impl_StateMachine.md
│   ├── Impl_StateManagement.md
│   ├── Impl_WebSocket.md
│   ├── Level0_SystemOverview.md
│   ├── Level1_BasicMechanics.md
│   ├── Level2_CoreMechanics.md
│   ├── Level3_ValueCreation.md
│   ├── Level4_MetastableEmergence.md
│   ├── Level5_QuantumSemantics.md
│   ├── Meta_Bridges.md
│   ├── Meta_Density.md
│   ├── Meta_Diagrams.md
│   ├── Meta_Emergence.md
│   ├── Meta_Evolution.md
│   ├── Meta_Experience.md
│   ├── Meta_Index.md
│   ├── Meta_Layers.md
│   ├── Meta_Navigation.md
│   ├── Meta_Network.md
│   ├── Meta_Overview.md
│   ├── Meta_Progression.md
│   ├── Model_Emergency.md
│   ├── Model_Metastability.md
│   ├── Model_Recursion.md
│   ├── Model_Ring.md
│   ├── Model_ThreadEvolution.md
│   ├── Theory_Algebra.md
│   ├── Theory_Semantics.md
│   ├── Theory_StateAlgebra.md
│   ├── Theory_StateAlgebraExplained.md
│   ├── Theory_Topology.md
│   ├── combined
│   │   ├── Combined_Core.md
│   │   ├── Combined_Dev.md
│   │   ├── Combined_Entry.md
│   │   ├── Combined_Impl.md
│   │   ├── Combined_Levels.md
│   │   ├── Combined_Meta.md
│   │   ├── Combined_Model.md
│   │   ├── Combined_Theory.md
│   │   └── combiner.sh
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

29 directories, 167 files
