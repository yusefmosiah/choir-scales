# Level -1 Documentation




==
combiner.sh
==


#!/bin/bash

# Documentation Combiner Script
# ===========================
#
# This script combines Markdown documentation files in the docs/ directory in two ways:
#
# 1. By Prefix: Combines files sharing common prefixes (e.g., Core_, Theory_) into
#    Combined_{prefix}.md files in docs/combined/
#
# 2. By Abstraction Level: Creates level{0-5}.md files representing different levels
#    of abstraction, from most concrete (0) to most abstract (5):
#
#    - Level 0: Implementation details (code, deployment, technical specs)
#    - Level 1: Getting started guides and development documentation
#    - Level 2: Core system implementation and state management
#    - Level 3: Economic and game theoretical foundations
#    - Level 4: Meta-level system concepts and models
#    - Level 5: Abstract theoretical foundations and quantum semantics
#
# Special handling is implemented for level0.md to ensure critical system files
# (tree.md, combiner.sh, update_tree.sh) appear first.
#
# Usage:
#   ./combiner.sh
#
# Output:
#   - docs/combined/Combined_{prefix}.md files
#   - docs/combined/level{0-5}.md files
#
# Note: This script expects to be run from the project root directory
# and requires the docs/ directory structure to be present.
#
# @abstraction_level: 0 - Implementation/Scripts

# Function to add separator and header
add_separator() {
    echo -e "\n"
    echo "=="
    echo "$1"
    echo "=="
    echo -e "\n"
}

# First phase: Combine by prefix as before
prefixes=$(ls docs/docs/*_*.md | sed 's/docs\/docs\///g' | grep -v 'tree' | cut -d'_' -f1 | sort -u)

for prefix in $prefixes; do
    # Create title from prefix
    title="${prefix} Documentation"
    case $prefix in
        "Core") subtitle="- Fundamental Concepts" ;;
        "Dev") subtitle="- Building Choir" ;;
        "Entry") subtitle="- Getting Started" ;;
        "Impl") subtitle="- Technical Details" ;;
        "Level") subtitle="- Understanding Progression" ;;
        "Meta") subtitle="- Documentation About Documentation" ;;
        "Model") subtitle="- System Patterns" ;;
        "Theory") subtitle="- Mathematical Foundations" ;;
        "Crystallization") subtitle="- Development Milestones" ;;
        "Data") subtitle="- Data Management" ;;
        "Deploy") subtitle="- Deployment Guidelines" ;;
        "Error") subtitle="- Error Handling" ;;
        "Frontend") subtitle="- UI Components" ;;
        "Backend") subtitle="- Server Implementation" ;;
        "Solana") subtitle="- Blockchain Integration" ;;
        "Reward") subtitle="- Incentive Systems" ;;
        "State") subtitle="- State Management" ;;
        "Tech") subtitle="- Technical Architecture" ;;
        "Plan") subtitle="- Project Planning" ;;
        "Harmonic") subtitle="- System Harmony" ;;
        *) subtitle="" ;;
    esac

    # Create combined file
    {
        echo "# ${title} ${subtitle}"
        echo -e "\n"

        # Concatenate all files with this prefix, excluding tree
        for file in docs/docs/${prefix}_*.md; do
            if [ -f "$file" ] && ! grep -q "tree" <<< "$file"; then
                add_separator "$(basename "$file" .md)"
                cat "$file"
            fi
        done
    } > "docs/combined/Combined_${prefix}.md"

    echo "Created Combined_${prefix}.md"
done

# Create a list of all markdown files for verification
all_docs=$(find docs/docs -name "*.md" ! -name "tree.md")

# Base patterns that define the core structure of each level
base_patterns=(
    "Level_0_ tree.md scripts/ Solana_ Frontend_ Backend_ Deploy_ Implementation_ Data_ Error_ Reward_"  # Most concrete
    "Level_1_ Entry_ Dev_ Plan_ Tech_ Crystallization_"                                                  # Getting started
    "Level_2_ Core_State Core_Types Core_Blueprint Impl_ State_"                                        # System structure
    "Level_3_ Core_Economics Theory_Game Theory_Implementation V10_ V12_"                               # Game theory
    "Level_4_ Core_Convergence Theory_Stake Model_ Meta_Overview"                                       # System concepts
    "Level_5_ Theory_Quantum Theory_Semantic Harmonic_ Meta_"                                           # Most abstract
)

# Additional patterns for each level that follow the concrete->abstract progression
core_patterns=(
    ""  # Level 0 has no Core_ docs
    ""  # Level 1 has no Core_ docs
    "Core_Proof Core_Comprehensive Core_Context Core_Consistency Core_Invariants Core_Ownership Core_Persuasion Core_ProofOfText Core_StateTransitions Core_Whitepaper"
    "Core_Economics Core_Moat"
    "Core_Convergence"
    ""  # Level 5 has no Core_ docs
)

theory_patterns=(
    ""  # Level 0 has no Theory_ docs
    ""  # Level 1 has no Theory_ docs
    ""  # Level 2 has no Theory_ docs
    "Theory_Game Theory_Implementation Theory_Integration Theory_StakeEntanglement Theory_StateAlgebra Theory_Topology"
    "Theory_Stake"
    "Theory_Quantum Theory_Semantic Theory_Algebra Theory_ApprovalMeasurement Theory_ChorusQuantum Theory_SemanticGameTopology Theory_SemanticsExplained Theory_StateAlgebraExplained Theory_TopologyExplained"
)

meta_patterns=(
    ""  # Level 0 has no Meta_ docs
    ""  # Level 1 has no Meta_ docs
    ""  # Level 2 has no Meta_ docs
    ""  # Level 3 has no Meta_ docs
    "Meta_Overview Meta_Index Meta_Navigation Meta_Network Meta_Progression"
    "Meta_Bridges Meta_Density Meta_Diagrams Meta_Emergence Meta_Evolution Meta_Experience Meta_Layers"
)

# Function to combine patterns for a level
get_level_patterns() {
    level=$1
    echo "${base_patterns[$level]} ${core_patterns[$level]} ${theory_patterns[$level]} ${meta_patterns[$level]}"
}

# Function to process files for a level
process_level() {
    level=$1
    patterns=$2

    # Handle negative level number in filename
    if [ "$level" -eq -1 ]; then
        output_file="docs/levels/level-1.md"
    else
        output_file="docs/levels/level${level}.md"
    fi

    echo "# Level ${level} Documentation" > "$output_file"
    echo -e "\n" >> "$output_file"

    # Special handling for level -1 (system files)
    if [ "$level" -eq -1 ]; then
        for special_file in "docs/scripts/combiner.sh" "docs/scripts/update_tree.sh" "docs/docs/tree.md"; do
            if [ -f "$special_file" ]; then
                add_separator "$(basename "$special_file")" >> "$output_file"
                cat "$special_file" >> "$output_file"
            fi
        done
        echo "Created level-1.md"
        return
    fi

    # Process patterns (now only for levels 0-5)
    for pattern in $patterns; do
        for file in docs/docs/*${pattern}*.md; do
            if [ -f "$file" ]; then
                add_separator "$(basename "$file" .md)" >> "$output_file"
                cat "$file" >> "$output_file"
                echo "$file" >> "/tmp/processed_files.txt"
            fi
        done
    done

    echo "Created level${level}.md"
}

# Clear processed files tracking
> "/tmp/processed_files.txt"

# Process level -1 first for system files
process_level -1 ""

# Process levels 0-5
for level in {0..5}; do
    process_level $level "$(get_level_patterns $level)"
done

# Verify all files were processed
echo -e "\nVerifying document coverage:"
uncategorized=0
for doc in $all_docs; do
    if ! grep -q "^$doc$" "/tmp/processed_files.txt"; then
        echo "Warning: $doc was not categorized into any level"
        uncategorized=$((uncategorized + 1))
    fi
done

if [ "$uncategorized" -gt 0 ]; then
    echo "Warning: $uncategorized files were not categorized into any level"
    echo "Please update level patterns to include these files"
fi

# Cleanup
rm -f "/tmp/processed_files.txt"

echo "Documentation combination complete"


==
update_tree.sh
==


#!/bin/bash

# Get the tree output, excluding venv and node_modules
tree_output=$(tree -I 'venv|node_modules')

# Create a temporary file with the new content
cat > docs/docs/tree.md.tmp << EOL
# Choir Scales Directory Structure
## Output of $ tree -I 'venv|node_modules' | pbcopy

$tree_output
EOL

# Replace the old file with the new one
mv docs/docs/tree.md.tmp docs/docs/tree.md


==
tree.md
==


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
│   ├── combined
│   │   ├── Combined_Backend.md
│   │   ├── Combined_Core.md
│   │   ├── Combined_Crystallization.md
│   │   ├── Combined_Data.md
│   │   ├── Combined_Deploy.md
│   │   ├── Combined_Dev.md
│   │   ├── Combined_Entry.md
│   │   ├── Combined_Error.md
│   │   ├── Combined_Frontend.md
│   │   ├── Combined_Harmonic.md
│   │   ├── Combined_Impl.md
│   │   ├── Combined_Implementation.md
│   │   ├── Combined_Level.md
│   │   ├── Combined_Meta.md
│   │   ├── Combined_Model.md
│   │   ├── Combined_Plan.md
│   │   ├── Combined_Reward.md
│   │   ├── Combined_Solana.md
│   │   ├── Combined_State.md
│   │   ├── Combined_Tech.md
│   │   ├── Combined_Theory.md
│   │   ├── Combined_V10.md
│   │   └── Combined_V12.md
│   ├── docs
│   │   ├── Backend_Chorus.md
│   │   ├── Backend_Database.md
│   │   ├── Backend_Main.md
│   │   ├── Backend_Models.md
│   │   ├── Core_Blueprint.md
│   │   ├── Core_Comprehensive.md
│   │   ├── Core_Consistency.md
│   │   ├── Core_Context.md
│   │   ├── Core_Convergence.md
│   │   ├── Core_Economics.md
│   │   ├── Core_Invariants.md
│   │   ├── Core_Moat.md
│   │   ├── Core_Ownership.md
│   │   ├── Core_Persuasion.md
│   │   ├── Core_ProofOfText.md
│   │   ├── Core_StateTransitions.md
│   │   ├── Core_Types.md
│   │   ├── Core_Whitepaper.md
│   │   ├── Crystallization_Checklist.md
│   │   ├── Data_Engine_Vision.md
│   │   ├── Deploy_Render_Checklist.md
│   │   ├── Deploy_Report.md
│   │   ├── Dev_Crystallization.md
│   │   ├── Dev_FormalMethods.md
│   │   ├── Dev_Plan.md
│   │   ├── Dev_Pseudocode.md
│   │   ├── Dev_Strategy.md
│   │   ├── Dev_Versioning.md
│   │   ├── Entry_Accessibility.md
│   │   ├── Entry_Business.md
│   │   ├── Entry_Glossary.md
│   │   ├── Entry_Guide.md
│   │   ├── Entry_InverseEquity.md
│   │   ├── Entry_Overview.md
│   │   ├── Entry_QA.md
│   │   ├── Entry_Vision.md
│   │   ├── Error_Correction_Layers.md
│   │   ├── Frontend_AIResponse.md
│   │   ├── Frontend_ChoirChat.md
│   │   ├── Frontend_ChoirChat_UI.md
│   │   ├── Frontend_ChorusPanel.md
│   │   ├── Frontend_UserInput.md
│   │   ├── Harmonic_Theory.md
│   │   ├── Impl_API.md
│   │   ├── Impl_ChorusLoop.md
│   │   ├── Impl_Integration.md
│   │   ├── Impl_Messages.md
│   │   ├── Impl_Privacy.md
│   │   ├── Impl_Security.md
│   │   ├── Impl_StateMachine.md
│   │   ├── Impl_StateManagement.md
│   │   ├── Impl_WebSocket.md
│   │   ├── Implementation_Dependencies.md
│   │   ├── Level_0_SystemOverview.md
│   │   ├── Level_1_BasicMechanics.md
│   │   ├── Level_2_CoreMechanics.md
│   │   ├── Level_3_ValueCreation.md
│   │   ├── Level_4_MetastableEmergence.md
│   │   ├── Level_5_QuantumSemantics.md
│   │   ├── Meta_Bridges.md
│   │   ├── Meta_Density.md
│   │   ├── Meta_Diagrams.md
│   │   ├── Meta_Emergence.md
│   │   ├── Meta_Evolution.md
│   │   ├── Meta_Experience.md
│   │   ├── Meta_Index.md
│   │   ├── Meta_Layers.md
│   │   ├── Meta_Navigation.md
│   │   ├── Meta_Network.md
│   │   ├── Meta_Overview.md
│   │   ├── Meta_Progression.md
│   │   ├── Model_Emergency.md
│   │   ├── Model_Metastability.md
│   │   ├── Model_Recursion.md
│   │   ├── Model_Ring.md
│   │   ├── Model_ThreadEvolution.md
│   │   ├── Plan_Hyperconverge.md
│   │   ├── Reward_Service.md
│   │   ├── Solana_lib.md
│   │   ├── Solana_message.md
│   │   ├── Solana_settlement.md
│   │   ├── Solana_thread.md
│   │   ├── Solana_thread_fuzzer.md
│   │   ├── Solana_thread_test.md
│   │   ├── Solana_validation.md
│   │   ├── State_Boundaries.md
│   │   ├── State_Transitions.md
│   │   ├── Tech_Arts_Intersection.md
│   │   ├── Theory_Algebra.md
│   │   ├── Theory_ApprovalMeasurement.md
│   │   ├── Theory_ChorusQuantum.md
│   │   ├── Theory_GameMechanics.md
│   │   ├── Theory_GameMechanicsAdversarial.md
│   │   ├── Theory_GameMechanicsSparsity.md
│   │   ├── Theory_Implementation.md
│   │   ├── Theory_Implementation_Bridge.md
│   │   ├── Theory_Integration.md
│   │   ├── Theory_QuantumProtocol.md
│   │   ├── Theory_SemanticGameTopology.md
│   │   ├── Theory_Semantics.md
│   │   ├── Theory_SemanticsExplained.md
│   │   ├── Theory_StakeEntanglement.md
│   │   ├── Theory_StateAlgebra.md
│   │   ├── Theory_StateAlgebraExplained.md
│   │   ├── Theory_Topology.md
│   │   ├── Theory_TopologyExplained.md
│   │   ├── V10_Loop_Theory.md
│   │   ├── V10_Prompt_Engineering.md
│   │   ├── V12_Data_Engines.md
│   │   └── tree.md
│   ├── levels
│   │   ├── level-1.md
│   │   ├── level0.md
│   │   ├── level1.md
│   │   ├── level2.md
│   │   ├── level3.md
│   │   ├── level4.md
│   │   └── level5.md
│   └── scripts
│       ├── combiner.sh
│       └── update_tree.sh
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

61 directories, 280 files
