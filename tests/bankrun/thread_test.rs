use anchor_lang::prelude::*;
use anchor_bankrun::{
    bankrun_program::program_test,
    ProgramTestBanksClient, ProgramTestContext,
};
use solana_program_test::tokio;
use solana_sdk::{signature::Keypair, signer::Signer};

use choir::program::*;

mod common;
use common::{program_test, create_thread_accounts};

#[tokio::test]
async fn test_thread_lifecycle() {
    // Initialize test context with Bankrun
    let mut context = program_test().start_with_context().await;
    let payer = Keypair::new();

    // Test data
    let thread_id = "test_thread".to_string();
    let content_hash = [1u8; 32];

    // Create thread
    let (thread_pda, thread_bump) = create_thread_accounts(
        &mut context,
        &payer,
        &thread_id,
    ).await;

    // Submit message
    let message_result = submit_test_message(
        &mut context,
        &thread_pda,
        &payer,
        content_hash,
    ).await;
    assert!(message_result.is_ok());

    // Verify thread state
    let thread = get_thread_state(&mut context, &thread_pda).await;
    assert_eq!(thread.message_count, 1);
    assert_eq!(thread.messages[0].content_hash, content_hash);

    // Test approval flow
    let approval_result = approve_message(
        &mut context,
        &thread_pda,
        &payer,
        0,
        true,
    ).await;
    assert!(approval_result.is_ok());

    // Verify final state
    let final_thread = get_thread_state(&mut context, &thread_pda).await;
    assert!(final_thread.messages[0].is_published);
}

#[tokio::test]
async fn test_concurrent_approvals() {
    let mut context = program_test().start_with_context().await;
    let authors = (0..3).map(|_| Keypair::new()).collect::<Vec<_>>();

    // Create thread with multiple co-authors
    let thread = create_multi_author_thread(
        &mut context,
        &authors,
    ).await;

    // Submit message requiring multiple approvals
    let message_hash = [2u8; 32];
    submit_test_message(
        &mut context,
        &thread.pubkey(),
        &authors[0],
        message_hash,
    ).await.unwrap();

    // Test concurrent approvals
    let mut approval_handles = vec![];
    for author in &authors[1..] {
        let handle = tokio::spawn(approve_message(
            &mut context.clone(),
            &thread.pubkey(),
            author,
            0,
            true,
        ));
        approval_handles.push(handle);
    }

    // Wait for all approvals
    for handle in approval_handles {
        handle.await.unwrap().unwrap();
    }

    // Verify final state
    let final_thread = get_thread_state(&mut context, &thread.pubkey()).await;
    assert_eq!(final_thread.messages[0].approvals.len(), authors.len() - 1);
}

#[tokio::test]
async fn test_security_boundaries() {
    let mut context = program_test().start_with_context().await;
    let owner = Keypair::new();
    let attacker = Keypair::new();

    // Create thread
    let thread = create_test_thread(&mut context, &owner).await;

    // Test security scenarios
    let security_tests = vec![
        // Test 1: Non-co-author message submission
        test_unauthorized_message(&mut context, &thread, &attacker),

        // Test 2: Duplicate approval
        test_duplicate_approval(&mut context, &thread, &owner),

        // Test 3: Invalid message index
        test_invalid_message_index(&mut context, &thread, &owner),

        // Test 4: Expired spec approval
        test_expired_spec(&mut context, &thread, &owner),
    ];

    for test in security_tests {
        assert!(test.await.is_err());
    }
}

// Helper functions
async fn create_multi_author_thread(
    context: &mut ProgramTestContext,
    authors: &[Keypair],
) -> Thread {
    // Implementation
}

async fn test_unauthorized_message(
    context: &mut ProgramTestContext,
    thread: &Thread,
    attacker: &Keypair,
) -> Result<()> {
    // Implementation
}

async fn test_duplicate_approval(
    context: &mut ProgramTestContext,
    thread: &Thread,
    author: &Keypair,
) -> Result<()> {
    // Implementation
}

// ... additional test helpers
