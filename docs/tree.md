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
├── choir-new
│   ├── LICENSE
│   ├── README.md
│   ├── anchor
│   │   ├── Anchor.toml
│   │   ├── Cargo.lock
│   │   ├── Cargo.toml
│   │   ├── migrations
│   │   │   └── deploy.ts
│   │   ├── programs
│   │   │   └── basic
│   │   │       ├── Cargo.toml
│   │   │       ├── Xargo.toml
│   │   │       └── src
│   │   │           └── lib.rs
│   │   ├── src
│   │   │   ├── basic-exports.ts
│   │   │   └── index.ts
│   │   ├── target
│   │   │   ├── idl
│   │   │   │   └── basic.json
│   │   │   └── types
│   │   │       └── basic.ts
│   │   ├── tests
│   │   │   └── basic.spec.ts
│   │   └── tsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.mjs
│   ├── public
│   │   └── logo.png
│   ├── src
│   │   ├── app
│   │   │   ├── account
│   │   │   │   ├── [address]
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── api
│   │   │   │   └── hello
│   │   │   │       └── route.ts
│   │   │   ├── basic
│   │   │   │   └── page.tsx
│   │   │   ├── clusters
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── react-query-provider.tsx
│   │   └── components
│   │       ├── account
│   │       │   ├── account-data-access.tsx
│   │       │   ├── account-detail-feature.tsx
│   │       │   ├── account-list-feature.tsx
│   │       │   └── account-ui.tsx
│   │       ├── basic
│   │       │   ├── basic-data-access.tsx
│   │       │   ├── basic-feature.tsx
│   │       │   └── basic-ui.tsx
│   │       ├── cluster
│   │       │   ├── cluster-data-access.tsx
│   │       │   ├── cluster-feature.tsx
│   │       │   └── cluster-ui.tsx
│   │       ├── dashboard
│   │       │   └── dashboard-feature.tsx
│   │       ├── solana
│   │       │   └── solana-provider.tsx
│   │       └── ui
│   │           └── ui-layout.tsx
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docs
│   ├── Backend_Chorus.md
│   ├── Backend_Database.md
│   ├── Backend_Main.md
│   ├── Backend_Models.md
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
│   ├── Crystallization_Checklist.md
│   ├── Data_Engine_Vision.md
│   ├── Deploy_Render_Checklist.md
│   ├── Deploy_Report.md
│   ├── Dev_Crystallization.md
│   ├── Dev_FormalMethods.md
│   ├── Dev_Plan.md
│   ├── Dev_Pseudocode.md
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
│   ├── Error_Correction_Layers.md
│   ├── Frontend_AIResponse.md
│   ├── Frontend_ChoirChat.md
│   ├── Frontend_ChoirChat_UI.md
│   ├── Frontend_ChorusPanel.md
│   ├── Frontend_UserInput.md
│   ├── Impl_API.md
│   ├── Impl_ChorusLoop.md
│   ├── Impl_Integration.md
│   ├── Impl_Messages.md
│   ├── Impl_Privacy.md
│   ├── Impl_Security.md
│   ├── Impl_StateMachine.md
│   ├── Impl_StateManagement.md
│   ├── Impl_WebSocket.md
│   ├── Implementation_Dependencies.md
│   ├── Level_0_SystemOverview.md
│   ├── Level_1_BasicMechanics.md
│   ├── Level_2_CoreMechanics.md
│   ├── Level_3_ValueCreation.md
│   ├── Level_4_MetastableEmergence.md
│   ├── Level_5_QuantumSemantics.md
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
│   ├── Plan_Hyperconverge.md
│   ├── Reward_Service.md
│   ├── Solana_lib.md
│   ├── Solana_message.md
│   ├── Solana_settlement.md
│   ├── Solana_thread.md
│   ├── Solana_thread_fuzzer.md
│   ├── Solana_thread_test.md
│   ├── Solana_validation.md
│   ├── State_Boundaries.md
│   ├── State_Transitions.md
│   ├── Tech_Arts_Intersection.md
│   ├── Theory_Algebra.md
│   ├── Theory_ApprovalMeasurement.md
│   ├── Theory_ChorusQuantum.md
│   ├── Theory_GameMechanics.md
│   ├── Theory_GameMechanicsAdversarial.md
│   ├── Theory_GameMechanicsSparsity.md
│   ├── Theory_Implementation.md
│   ├── Theory_Implementation_Bridge.md
│   ├── Theory_Integration.md
│   ├── Theory_QuantumProtocol.md
│   ├── Theory_SemanticGameTopology.md
│   ├── Theory_Semantics.md
│   ├── Theory_SemanticsExplained.md
│   ├── Theory_StakeEntanglement.md
│   ├── Theory_StateAlgebra.md
│   ├── Theory_StateAlgebraExplained.md
│   ├── Theory_Topology.md
│   ├── Theory_TopologyExplained.md
│   ├── V12_Data_Engines.md
│   ├── combined
│   ├── scripts
│   │   ├── combiner.sh
│   │   └── update_tree.sh
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
├── program
│   └── src
│       └── lib.rs
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

59 directories, 247 files
