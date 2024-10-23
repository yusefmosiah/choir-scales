use anchor_lang::prelude::*;

// Space calculation for account size
const MAX_COAUTHORS: usize = 10;
const MAX_MESSAGES: usize = 100;
const MAX_PENDING_SPECS: usize = 20;
const THREAD_SPACE: usize = 8 + // discriminator
    32 + // thread_id (string)
    8 + // created_at
    8 + // updated_at
    4 + (32 * MAX_COAUTHORS) + // co_authors vec
    8 + // token_balance
    4 + // message_count
    (MESSAGE_SPACE * MAX_MESSAGES) + // messages vec
    (SPEC_MESSAGE_SPACE * MAX_PENDING_SPECS); // pending_specs vec

#[account]
#[derive(Default)]
pub struct Thread {
    // Thread metadata
    pub thread_id: String,  // Unique identifier
    pub created_at: i64,
    pub updated_at: i64,

    // Ownership and tokens
    pub co_authors: Vec<Pubkey>,
    pub token_balance: u64,

    // Message tracking
    pub message_count: u32,
    pub messages: Vec<Message>,
    pub pending_specs: Vec<SpecMessage>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Message {
    pub author: Pubkey,
    pub content_hash: [u8; 32],
    pub timestamp: i64,
    pub approvals: Vec<Approval>,
    pub is_published: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SpecMessage {
    pub author: Pubkey,
    pub content_hash: [u8; 32],
    pub timestamp: i64,
    pub stake_amount: u64,
    pub approvals: Vec<Approval>,
    pub expires_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Approval {
    pub co_author: Pubkey,
    pub approved: bool,
    pub timestamp: i64,
}

// Modern Anchor account validation
#[derive(Accounts)]
pub struct InitializeThread<'info> {
    #[account(
        init,
        payer = initial_author,
        space = THREAD_SPACE,
        seeds = [b"thread", thread_id.as_bytes()],
        bump
    )]
    pub thread: Account<'info, Thread>,

    #[account(mut)]
    pub initial_author: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitMessage<'info> {
    #[account(mut)]
    pub thread: Account<'info, Thread>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitSpec<'info> {
    #[account(mut)]
    pub thread: Account<'info, Thread>,
    #[account(mut)]
    pub author: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessApproval<'info> {
    #[account(mut)]
    pub thread: Account<'info, Thread>,
    #[account(mut)]
    pub co_author: Signer<'info>,
    pub system_program: Program<'info, System>,
}
