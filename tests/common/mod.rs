use anchor_lang::prelude::*;
use solana_program_test::*;
use solana_sdk::{signature::Keypair, signer::Signer};
use choir::program::*;

pub fn program_test() -> ProgramTest {
    ProgramTest::new(
        "choir",
        choir::ID,
        processor!(choir::entry),
    )
}

pub async fn create_test_thread(
    context: &mut ProgramTestContext,
    author: &Keypair,
) -> Thread {
    // Implementation details...
}

pub async fn submit_message(
    context: &mut ProgramTestContext,
    thread: &Pubkey,
    author: &Keypair,
    content_hash: [u8; 32],
) -> Result<()> {
    // Implementation details...
}

pub async fn get_thread_account(
    context: &mut ProgramTestContext,
    thread: &Pubkey,
) -> Thread {
    // Implementation details...
}
