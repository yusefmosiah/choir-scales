use anchor_lang::prelude::*;
use crate::error::ChoirError;
use crate::thread::*;

/// Validation utilities for thread operations
pub mod validation {
    use super::*;

    /// Validates thread state for message operations
    pub fn validate_thread_state(thread: &Thread) -> Result<()> {
        require!(
            thread.message_count < MAX_MESSAGES as u32,
            ChoirError::ThreadFull
        );

        // Validate no duplicate message hashes
        let mut seen_hashes = std::collections::HashSet::new();
        for msg in &thread.messages {
            require!(
                seen_hashes.insert(msg.content_hash),
                ChoirError::DuplicateContent
            );
        }

        Ok(())
    }

    /// Validates co-author permissions
    pub fn validate_co_author(
        thread: &Thread,
        author: &Pubkey,
        operation: &str,
    ) -> Result<()> {
        require!(
            thread.co_authors.contains(author),
            ChoirError::NotCoAuthor
        );

        msg!("Co-author {} validated for {}", author, operation);
        Ok(())
    }

    /// Validates spec submission requirements
    pub fn validate_spec_submission(
        thread: &Thread,
        author: &Pubkey,
        stake_amount: u64,
    ) -> Result<()> {
        // Author must not be co-author
        require!(
            !thread.co_authors.contains(author),
            ChoirError::AlreadyCoAuthor
        );

        // Check pending specs limit
        require!(
            thread.pending_specs.len() < MAX_PENDING_SPECS,
            ChoirError::TooManyPendingSpecs
        );

        // Validate stake amount
        require!(
            stake_amount >= thread.minimum_stake,
            ChoirError::InsufficientStake
        );

        Ok(())
    }

    /// Validates approval state
    pub fn validate_approval_state(
        thread: &Thread,
        message_index: u32,
        co_author: &Pubkey,
        is_spec: bool,
    ) -> Result<()> {
        if is_spec {
            let spec = thread.pending_specs.get(message_index as usize)
                .ok_or(ChoirError::InvalidMessageIndex)?;

            // Check expiration
            let clock = Clock::get()?;
            require!(
                spec.expires_at > clock.unix_timestamp,
                ChoirError::SpecExpired
            );

            // Check for duplicate votes
            require!(
                !spec.approvals.iter().any(|a| a.co_author == *co_author),
                ChoirError::AlreadyVoted
            );
        } else {
            let message = thread.messages.get(message_index as usize)
                .ok_or(ChoirError::InvalidMessageIndex)?;

            require!(
                !message.approvals.iter().any(|a| a.co_author == *co_author),
                ChoirError::AlreadyVoted
            );
        }

        Ok(())
    }
}
