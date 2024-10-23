use anchor_lang::prelude::*;
use trident_fuzz::{
    account_state::AccountsSnapshots,
    fuzz_client::{FuzzClient, FuzzClientError},
    instruction::FuzzInstruction,
};

use choir::program::*;

#[derive(AccountsSnapshots)]
pub struct ThreadFuzzState {
    thread: Account<Thread>,
    messages: Vec<Message>,
    specs: Vec<SpecMessage>,
    approvals: Vec<Approval>,
    token_balances: Vec<u64>,
}

#[derive(Default)]
pub struct ThreadFuzzer {
    accounts: FuzzAccounts,
    state: ThreadFuzzState,
}

impl FuzzInstruction for ThreadFuzzer {
    fn get_accounts(&self) -> Result<Vec<AccountMeta>> {
        // Generate random but valid account combinations
        let accounts = match self.random_operation() {
            Operation::InitThread => self.init_thread_accounts(),
            Operation::SubmitMessage => self.submit_message_accounts(),
            Operation::SubmitSpec => self.submit_spec_accounts(),
            Operation::ProcessApproval => self.approval_accounts(),
        }?;

        Ok(accounts)
    }

    fn get_data(&self) -> Result<Vec<u8>> {
        // Generate random but valid instruction data
        let data = match self.random_operation() {
            Operation::InitThread => self.gen_thread_init_data(),
            Operation::SubmitMessage => self.gen_message_data(),
            Operation::SubmitSpec => self.gen_spec_data(),
            Operation::ProcessApproval => self.gen_approval_data(),
        }?;

        Ok(data)
    }

    fn check_invariants(&self, pre: &ThreadFuzzState, post: &ThreadFuzzState) -> Result<()> {
        // Core invariants that must always hold
        self.check_token_conservation(pre, post)?;
        self.check_ownership_invariants(pre, post)?;
        self.check_message_integrity(pre, post)?;
        self.check_approval_consistency(pre, post)?;

        Ok(())
    }
}

impl ThreadFuzzer {
    // Security-focused invariant checks
    fn check_token_conservation(&self, pre: &ThreadFuzzState, post: &ThreadFuzzState) -> Result<()> {
        let pre_total: u64 = pre.token_balances.iter().sum();
        let post_total: u64 = post.token_balances.iter().sum();

        require!(
            pre_total == post_total,
            FuzzClientError::InvariantViolation("Token conservation violated")
        );
        Ok(())
    }

    fn check_ownership_invariants(&self, pre: &ThreadFuzzState, post: &ThreadFuzzState) -> Result<()> {
        // Verify co-author list can only change through valid operations
        for (pre_thread, post_thread) in pre.thread.iter().zip(post.thread.iter()) {
            let valid_change = match self.last_operation {
                Operation::ProcessApproval { approved: true, .. } => true,
                _ => pre_thread.co_authors == post_thread.co_authors,
            };
            require!(
                valid_change,
                FuzzClientError::InvariantViolation("Invalid co-author list modification")
            );
        }
        Ok(())
    }

    // Edge case generators
    fn gen_edge_case_thread(&self) -> Result<Thread> {
        let cases = vec![
            self.gen_max_capacity_thread(),
            self.gen_expired_specs_thread(),
            self.gen_concurrent_approvals_thread(),
            self.gen_duplicate_content_thread(),
        ];
        Ok(cases.choose(&mut thread_rng()).unwrap().clone())
    }

    fn gen_attack_vectors(&self) -> Vec<Box<dyn FuzzAttack>> {
        vec![
            Box::new(DoubleApprovalAttack::new()),
            Box::new(StateManipulationAttack::new()),
            Box::new(TokenDrainAttack::new()),
            Box::new(OwnershipHijackAttack::new()),
        ]
    }
}

// Custom attack patterns
trait FuzzAttack {
    fn execute(&self, client: &mut FuzzClient) -> Result<()>;
    fn verify_defense(&self, state: &ThreadFuzzState) -> Result<()>;
}

struct DoubleApprovalAttack {
    target_message: u32,
    attacker: Keypair,
}

impl FuzzAttack for DoubleApprovalAttack {
    fn execute(&self, client: &mut FuzzClient) -> Result<()> {
        // Attempt double approval
        for _ in 0..2 {
            let _ = client.process_approval(
                self.target_message,
                false,
                true,
                &self.attacker,
            );
        }
        Ok(())
    }

    fn verify_defense(&self, state: &ThreadFuzzState) -> Result<()> {
        // Verify no duplicate approvals exist
        let message = &state.thread.messages[self.target_message as usize];
        let approval_count = message.approvals
            .iter()
            .filter(|a| a.co_author == self.attacker.pubkey())
            .count();

        require!(
            approval_count <= 1,
            FuzzClientError::InvariantViolation("Double approval defense failed")
        );
        Ok(())
    }
}

// Main fuzzing entry point
#[fuzz]
fn fuzz_thread_operations(data: &[u8]) {
    let mut fuzzer = ThreadFuzzer::default();

    // Configure fuzzing parameters
    fuzzer.set_mutation_rate(0.1);
    fuzzer.enable_edge_cases(true);
    fuzzer.set_attack_frequency(0.05);

    // Run fuzzing sequence
    let result = fuzzer.run_sequence(data);

    // Analyze and report results
    if let Err(e) = result {
        if e.is_invariant_violation() {
            panic!("Invariant violation: {:?}", e);
        }
    }
}
