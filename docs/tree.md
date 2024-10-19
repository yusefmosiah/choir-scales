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
│   ├── Blueprint.md
│   ├── ChorusDevPlan.md
│   ├── Context.md
│   ├── OwnershipModel.md
│   ├── ProofOfText.md
│   ├── Q&A.md
│   ├── RebasePlan.md
│   ├── VisionStatement.md
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
└── tsconfig.json

22 directories, 91 files
