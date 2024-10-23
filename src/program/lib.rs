use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

mod error;
mod thread;
mod message;
mod settlement;

use error::ChoirError;
use thread::*;

declare_id!("CHoir1111111111111111111111111111111111111");

#[program]
pub mod choir {
    use super::*;

    /// Initialize a new thread
    ///
    /// # Arguments
    /// * `ctx` - Initialize thread context
    /// * `thread_id` - Unique identifier for the thread
    ///
    /// # Security Considerations
    /// - Validates thread_id length
    /// - Ensures initial_author is signer
    /// - Verifies PDA derivation
    pub fn initialize_thread(
        ctx: Context<InitializeThread>,
        thread_id: String,
    ) -> Result<()> {
        // Validate thread_id length
        require!(
            thread_id.len() <= 32,
            ChoirError::ThreadIdTooLong
        );

        let thread = &mut ctx.accounts.thread;
        let clock = Clock::get()?;

        // Initialize thread state
        thread.thread_id = thread_id;
        thread.created_at = clock.unix_timestamp;
        thread.updated_at = clock.unix_timestamp;
        thread.co_authors = vec![ctx.accounts.initial_author.key()];
        thread.token_balance = 0;
        thread.message_count = 0;
        thread.messages = vec![];
        thread.pending_specs = vec![];

        Ok(())
    }

    /// Submit a new message to a thread
    ///
    /// # Arguments
    /// * `ctx` - Submit message context
    /// * `content_hash` - Hash of the message content
    ///
    /// # Security Considerations
    /// - Verifies author is co-author
    /// - Checks thread capacity
    /// - Validates message format
    pub fn submit_message(
        ctx: Context<SubmitMessage>,
        content_hash: [u8; 32],
    ) -> Result<()> {
        let thread = &mut ctx.accounts.thread;
        let author = &ctx.accounts.author;
        let clock = Clock::get()?;

        // Security checks
        require!(
            thread.co_authors.contains(&author.key()),
            ChoirError::NotCoAuthor
        );

        require!(
            thread.message_count < MAX_MESSAGES as u32,
            ChoirError::ThreadFull
        );

        // Create new message
        let message = Message {
            author: author.key(),
            content_hash,
            timestamp: clock.unix_timestamp,
            approvals: vec![],
            is_published: false,
        };

        // Update thread state
        thread.messages.push(message);
        thread.message_count += 1;
        thread.updated_at = clock.unix_timestamp;

        Ok(())
    }

    /// Submit a spec (speculative message) to a thread
    ///
    /// # Arguments
    /// * `ctx` - Submit spec context
    /// * `content_hash` - Hash of the spec content
    /// * `stake_amount` - Amount of tokens to stake
    ///
    /// # Security Considerations
    /// - Verifies author is not co-author
    /// - Validates stake amount
    /// - Checks spec capacity
    pub fn submit_spec(
        ctx: Context<SubmitSpec>,
        content_hash: [u8; 32],
        stake_amount: u64,
    ) -> Result<()> {
        let thread = &mut ctx.accounts.thread;
        let author = &ctx.accounts.author;
        let clock = Clock::get()?;

        // Security checks
        require!(
            !thread.co_authors.contains(&author.key()),
            ChoirError::AlreadyCoAuthor
        );

        require!(
            thread.pending_specs.len() < MAX_PENDING_SPECS,
            ChoirError::TooManyPendingSpecs
        );

        require!(
            stake_amount >= thread.minimum_stake,
            ChoirError::InsufficientStake
        );

        // Create new spec
        let spec = SpecMessage {
            author: author.key(),
            content_hash,
            timestamp: clock.unix_timestamp,
            stake_amount,
            approvals: vec![],
            expires_at: clock.unix_timestamp + 7 * 24 * 60 * 60, // 7 days
        };

        // Update thread state
        thread.pending_specs.push(spec);
        thread.updated_at = clock.unix_timestamp;

        Ok(())
    }

    /// Process an approval or denial for a message/spec
    ///
    /// # Arguments
    /// * `ctx` - Process approval context
    /// * `message_index` - Index of message/spec
    /// * `is_spec` - Whether processing a spec message
    /// * `approved` - Approval decision
    ///
    /// # Security Considerations
    /// - Verifies co-author status
    /// - Checks for duplicate votes
    /// - Validates message/spec exists
    pub fn process_approval(
        ctx: Context<ProcessApproval>,
        message_index: u32,
        is_spec: bool,
        approved: bool,
    ) -> Result<()> {
        let thread = &mut ctx.accounts.thread;
        let co_author = &ctx.accounts.co_author;
        let clock = Clock::get()?;

        // Security checks
        require!(
            thread.co_authors.contains(&co_author.key()),
            ChoirError::NotCoAuthor
        );

        let approval = Approval {
            co_author: co_author.key(),
            approved,
            timestamp: clock.unix_timestamp,
        };

        if is_spec {
            process_spec_approval(thread, message_index, approval)?;
        } else {
            process_message_approval(thread, message_index, approval)?;
        }

        thread.updated_at = clock.unix_timestamp;
        Ok(())
    }
}

// Helper functions
fn process_spec_approval(
    thread: &mut Thread,
    spec_index: u32,
    approval: Approval,
) -> Result<()> {
    let spec = &mut thread.pending_specs.get_mut(spec_index as usize)
        .ok_or(ChoirError::InvalidMessageIndex)?;

    // Check for duplicate votes
    require!(
        !spec.approvals.iter().any(|a| a.co_author == approval.co_author),
        ChoirError::AlreadyVoted
    );

    // Check expiration
    let clock = Clock::get()?;
    require!(
        spec.expires_at > clock.unix_timestamp,
        ChoirError::SpecExpired
    );

    spec.approvals.push(approval);
    Ok(())
}

fn process_message_approval(
    thread: &mut Thread,
    message_index: u32,
    approval: Approval,
) -> Result<()> {
    let message = &mut thread.messages.get_mut(message_index as usize)
        .ok_or(ChoirError::InvalidMessageIndex)?;

    // Check for duplicate votes
    require!(
        !message.approvals.iter().any(|a| a.co_author == approval.co_author),
        ChoirError::AlreadyVoted
    );

    message.approvals.push(approval);
    Ok(())
}
