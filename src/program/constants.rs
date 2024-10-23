//! Program-wide constants and configuration

/// Maximum length for thread IDs
pub const MAX_THREAD_ID_LENGTH: usize = 32;

/// Maximum number of co-authors per thread
pub const MAX_COAUTHORS: usize = 10;

/// Maximum number of messages per thread
pub const MAX_MESSAGES: usize = 100;

/// Maximum number of pending specs
pub const MAX_PENDING_SPECS: usize = 20;

/// Minimum stake amount in lamports
pub const MIN_STAKE_AMOUNT: u64 = 1_000_000;

/// Spec expiration time in seconds (7 days)
pub const SPEC_EXPIRATION_TIME: i64 = 7 * 24 * 60 * 60;

/// Thread seed prefix for PDA derivation
pub const THREAD_SEED_PREFIX: &[u8] = b"thread";

/// Message seed prefix for PDA derivation
pub const MESSAGE_SEED_PREFIX: &[u8] = b"message";
