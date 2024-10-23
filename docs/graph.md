# graph.md


graph TD
    A[Program State] --> B[Account Model]
    B --> C[Fixed Size]
    B --> D[PDA Derivation]
    B --> E[Ownership]

    F[Data Flow] --> G[Instructions]
    G --> H[State Transitions]
    G --> I[Cross-Program]


    sequenceDiagram
    participant F as Frontend
    participant S as Solana
    participant B as Backend
    participant D as Database

    F->>S: Submit Transaction
    S->>S: Process Instruction
    S-->>F: Transaction Success
    F->>B: Notify Update
    B->>S: Verify State
    B->>D: Update Database
    B-->>F: Confirmation
