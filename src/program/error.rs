use anchor_lang::prelude::*;

/// Custom error codes for the Choir program
/// Each error includes a descriptive message and recommended recovery action
#[error_code]
pub enum ChoirError {
    /// Thread ID provided exceeds the maximum allowed length (32 bytes)
    #[msg("Thread ID exceeds maximum length of 32 bytes")]
    ThreadIdTooLong,

    /// Attempted operation by non-co-author
    /// Check co-author status before retrying
    #[msg("Not a co-author of this thread")]
    NotCoAuthor,

    /// Attempted spec submission by existing co-author
    /// Co-authors should use regular message submission
    #[msg("Already a co-author of this thread")]
    AlreadyCoAuthor,

    /// Thread has reached maximum message capacity
    /// Consider creating a new thread
    #[msg("Thread has reached maximum message capacity")]
    ThreadFull,

    /// Too many pending spec messages
    /// Wait for existing specs to be processed
    #[msg("Maximum pending specs limit reached")]
    TooManyPendingSpecs,

    /// Stake amount below required minimum
    /// Check thread's minimum stake requirement
    #[msg("Insufficient stake amount for spec submission")]
    InsufficientStake,

    /// Message index out of bounds
    /// Verify message exists before operation
    #[msg("Invalid message index")]
    InvalidMessageIndex,

    /// Attempted operation on expired spec
    /// Specs must be processed within 7 days
    #[msg("Spec message has expired")]
    SpecExpired,

    /// Co-author attempted duplicate vote
    /// Each co-author may vote only once
    #[msg("Already voted on this message")]
    AlreadyVoted,

    /// Duplicate content hash detected
    #[msg("Content hash already exists in thread")]
    DuplicateContent,

    /// Invalid thread configuration
    #[msg("Thread configuration is invalid")]
    InvalidThreadConfig,

    /// Thread is locked for maintenance
    #[msg("Thread is temporarily locked")]
    ThreadLocked,

    /// Operation timeout
    #[msg("Operation timed out")]
    OperationTimeout,

    /// Invalid token operation
    #[msg("Invalid token operation")]
    InvalidTokenOperation,
}
