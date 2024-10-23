use anchor_lang::prelude::*;
use choir::program::*;
use solana_program_test::*;
use solana_sdk::{signature::Keypair, signer::Signer};

mod common;
use common::program_test;

#[tokio::test]
async fn test_initialize_thread() {
    // Initialize test context
    let mut context = program_test().start_with_context().await;
    let payer = Keypair::new();

    // Test data
    let thread_id = "test_thread".to_string();

    // Derive PDA for thread account
    let (thread_pda, bump) = Pubkey::find_program_address(
        &[b"thread", thread_id.as_bytes()],
        &choir::ID,
    );

    // Build transaction
    let ix = choir::instruction::initialize_thread(
        choir::ID,
        thread_pda,
        payer.pubkey(),
        thread_id.clone(),
    );

    // Sign and send transaction
    let tx = Transaction::new_signed_with_payer(
        &[ix],
        Some(&payer.pubkey()),
        &[&payer],
        context.last_blockhash,
    );

    // Submit and verify transaction
    let result = context.banks_client
        .process_transaction(tx)
        .await;

    assert!(result.is_ok(), "Failed to initialize thread: {:?}", result);

    // Verify thread state
    let thread_account = context.banks_client
        .get_account(thread_pda)
        .await
        .expect("Failed to fetch thread account")
        .expect("Thread account not found");

    let thread: Thread = Thread::try_deserialize(&mut thread_account.data.as_ref())
        .expect("Failed to deserialize thread account");

    assert_eq!(thread.thread_id, thread_id);
    assert_eq!(thread.co_authors, vec![payer.pubkey()]);
    assert_eq!(thread.message_count, 0);
}

#[tokio::test]
async fn test_submit_message() {
    let mut context = program_test().start_with_context().await;
    let author = Keypair::new();

    // Initialize thread first
    let thread = common::create_test_thread(&mut context, &author).await;

    // Test message submission
    let content_hash = [1u8; 32];
    let result = common::submit_message(
        &mut context,
        &thread.pubkey(),
        &author,
        content_hash,
    ).await;

    assert!(result.is_ok(), "Failed to submit message: {:?}", result);

    // Verify message state
    let thread_account = common::get_thread_account(&mut context, &thread.pubkey()).await;
    assert_eq!(thread_account.message_count, 1);
    assert_eq!(thread_account.messages[0].content_hash, content_hash);
    assert_eq!(thread_account.messages[0].author, author.pubkey());
}

#[tokio::test]
async fn test_security_constraints() {
    let mut context = program_test().start_with_context().await;
    let author = Keypair::new();
    let malicious_user = Keypair::new();

    // Initialize thread
    let thread = common::create_test_thread(&mut context, &author).await;

    // Attempt unauthorized message submission
    let result = common::submit_message(
        &mut context,
        &thread.pubkey(),
        &malicious_user,
        [1u8; 32],
    ).await;

    assert!(result.is_err(), "Expected error for unauthorized submission");
    assert_eq!(
        result.unwrap_err().to_string(),
        ChoirError::NotCoAuthor.to_string()
    );
}
