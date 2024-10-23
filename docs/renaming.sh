#!/bin/bash

# Create rename.sh for Choir documentation

cat > docs/rename.sh << 'EOF'
#!/bin/bash

# Level docs (core progression)
mv docs/SystemLevels.md docs/Level0_SystemOverview.md
mv docs/BasicMechanics.md docs/Level1_BasicMechanics.md
mv docs/CoreMechanics.md docs/Level2_CoreMechanics.md
mv docs/ValueCreationPatterns.md docs/Level3_ValueCreation.md
mv docs/MetastableEmergence.md docs/Level4_MetastableEmergence.md
mv docs/DeepestLevel.md docs/Level5_QuantumSemantics.md

# Meta docs
mv docs/MetaDocumentation.md docs/Meta_Overview.md
mv docs/DocumentNetwork.md docs/Meta_Network.md
mv docs/DensityAnalysis.md docs/Meta_Density.md
mv docs/DocumentationLayers.md docs/Meta_Layers.md
mv docs/ConceptualBridges.md docs/Meta_Bridges.md
mv docs/NavigationPatterns.md docs/Meta_Navigation.md
mv docs/ConceptualProgression.md docs/Meta_Progression.md
mv docs/EmergenceDocumentation.md docs/Meta_Emergence.md

# Core concepts
mv docs/QuantumSemantics.md docs/Core_Semantics.md
mv docs/StateAlgebra.md docs/Core_StateAlgebra.md
mv docs/StateSpaceTopology.md docs/Core_Topology.md
mv docs/EmergentAlgebra.md docs/Core_Algebra.md
mv docs/EconomicModel.md docs/Core_Economics.md
mv docs/OwnershipModel.md docs/Core_Ownership.md
mv docs/IdeologicalMoat.md docs/Core_Moat.md
mv docs/EmergenceRing.md docs/Core_Ring.md
mv docs/MetastableStates.md docs/Core_Metastability.md
mv docs/RecursiveEmergence.md docs/Core_Recursion.md

# Implementation details
mv docs/APIPatterns.md docs/Impl_API.md
mv docs/ChorusLoop.md docs/Impl_ChorusLoop.md
mv docs/WebSocketProtocol.md docs/Impl_WebSocket.md
mv docs/MessageLifecycle.md docs/Impl_Messages.md
mv docs/SecurityModel.md docs/Impl_Security.md
mv docs/PrivacyModel.md docs/Impl_Privacy.md
mv docs/StateMachine.md docs/Impl_StateMachine.md
mv docs/StateManagement.md docs/Impl_StateManagement.md
mv docs/IntegrationPatterns.md docs/Impl_Integration.md

# Entry points and guides
mv docs/1-pager.md docs/Entry_Overview.md
mv docs/VisionStatement.md docs/Entry_Vision.md
mv docs/Guide.md docs/Entry_Guide.md
mv docs/Q\&A.md docs/Entry_QA.md
mv docs/Glossary.md docs/Entry_Glossary.md
mv docs/BusinessModel.md docs/Entry_Business.md
mv docs/InversePrivateEquity.md docs/Entry_InverseEquity.md
mv docs/AccessibilityPrinciples.md docs/Entry_Accessibility.md

# Development docs
mv docs/ImplementationStrategy.md docs/Dev_Strategy.md
mv docs/PseudocodeConventions.md docs/Dev_Pseudocode.md
mv docs/AIFormalMethods.md docs/Dev_FormalMethods.md
mv docs/ChorusDevPlan.md docs/Dev_Plan.md
mv docs/RebasePlan.md docs/Dev_Rebase.md
mv docs/VersioningAndBestPractices.md docs/Dev_Versioning.md

# Other core docs
mv docs/ThreadAssetEvolution.md docs/Core_ThreadEvolution.md
mv docs/ConvergentContexts.md docs/Core_Convergence.md
mv docs/EmergencyPatterns.md docs/Core_Emergency.md
mv docs/PersuasionPatterns.md docs/Core_Persuasion.md

# Make script executable
chmod +x docs/rename.sh

echo "Created rename script at docs/rename.sh"
EOF

chmod +x docs/rename.sh
echo "Created rename script at docs/rename.sh"
