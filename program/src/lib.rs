use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("CHoir1111111111111111111111111111111111111");

#[program]
pub mod choir {
    use super::*;

    /// Initialize a new thread
    ///
    /// STATE TRANSITION:
    /// None -> InitializedThread
    ///
    /// SECURITY INVARIANTS:
    /// 1. thread_id uniqueness
    /// 2. initial_author authority
    /// 3. PDA derivation correctness
    ///
    /// VALUE CONSERVATION:
    /// - No token operations in initialization
    /// - State starts with zero balance
    pub fn initialize_thread(
        ctx: Context<InitializeThread>,
        thread_id: String,
    ) -> Result<()> {
        SEQUENCE initialize:
            1. Validate Parameters
               - thread_id length <= 32
               - thread_id uniqueness
               - PDA derivation

            2. Initialize State
               - Set timestamps (created_at, updated_at)
               - Initialize co_authors with [initial_author]
               - Set token_balance = 0
               - Initialize empty messages and specs

            3. Verify State
               - Check all fields initialized
               - Verify co_author presence
               - Validate timestamps

        PROPERTY post_initialization:
            thread.co_authors.len() == 1 AND
            thread.token_balance == 0 AND
            thread.messages.is_empty()

        Ok(())
    }

    /// Submit a message to a thread
    ///
    /// STATE TRANSITION:
    /// Thread(n messages) -> Thread(n+1 messages)
    ///
    /// SECURITY INVARIANTS:
    /// 1. Author authorization
    /// 2. Thread capacity
    /// 3. Message format validity
    ///
    /// VALUE CONSERVATION:
    /// - Co-author: No token movement
    /// - Non-co-author: Stake locked in escrow
    pub fn submit_message(
        ctx: Context<SubmitMessage>,
        content_hash: [u8; 32],
    ) -> Result<()> {
        SEQUENCE submission:
            1. Verify Authorization
               - Check co-author status
               - Validate thread state
               - Verify capacity

            2. Process Message
               - Create message struct
               - Set timestamp
               - Initialize approval state

            3. Update Thread
               - Add message to vector
               - Increment message count
               - Update timestamp

        PROPERTY post_submission:
            thread.message_count == old_count + 1 AND
            thread.messages.last().author == ctx.accounts.author.key()

        Ok(())
    }

    /// Process message/spec approval
    ///
    /// STATE TRANSITION:
    /// Pending -> (Approved | Denied)
    ///
    /// SECURITY INVARIANTS:
    /// 1. Co-author authority
    /// 2. No duplicate votes
    /// 3. Message/spec existence
    ///
    /// VALUE FLOWS:
    /// - Approve: stake -> thread
    /// - Deny: stake -> deniers
    /// - Mixed: excess -> treasury
    pub fn process_approval(
        ctx: Context<ProcessApproval>,
        message_index: u32,
        is_spec: bool,
        approved: bool,
    ) -> Result<()> {
        SEQUENCE approval:
            1. Verify Authority
               - Check co-author status
               - Verify no duplicate votes
               - Validate message/spec index

            2. Record Approval
               - Create approval record
               - Add to approval set
               - Update timestamp

            3. Check Consensus
               - Count total approvals
               - Verify against co-author count
               - Process outcome if complete

        PROPERTY post_approval:
            message.approvals.contains(co_author) AND
            thread.updated_at > old_updated_at

        Ok(())
    }
}

// Account Structures
#[derive(Accounts)]
pub struct InitializeThread<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = Thread::LEN
    )]
    pub thread: Account<'info, Thread>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SubmitMessage<'info> {
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(mut)]
    pub thread: Account<'info, Thread>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ProcessApproval<'info> {
    #[account(mut)]
    pub co_author: Signer<'info>,
    #[account(mut)]
    pub thread: Account<'info, Thread>,
}

// Error Handling
#[error_code]
pub enum ChoirError {
    #[msg("Not a thread co-author")]
    NotCoAuthor,
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Invalid approval state")]
    InvalidApproval,
    #[msg("Thread operation failed")]
    ThreadOperationFailed,
    #[msg("Token operation failed")]
    TokenOperationFailed,
}
