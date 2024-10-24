# Message and Spec State Management

VERSION message_system:
  invariants: {
    "Message immutability after approval",
    "Spec stake conservation",
    "Approval state consistency"
  }
  assumptions: {
    "7-day spec timeout",
    "Content hash uniqueness",
    "Approval atomicity"
  }
  implementation: "0.1.0"

## Core Message Types

TYPE Message = {
  author: PublicKey,
  content_hash: [u8; 32],
  timestamp: i64,
  approvals: Set<Approval>,
  is_published: bool
}

TYPE SpecMessage = {
  author: PublicKey,
  content_hash: [u8; 32],
  timestamp: i64,
  stake_amount: u64,
  approvals: Set<Approval>,
  expires_at: i64
}

TYPE Approval = {
  co_author: PublicKey,
  approved: bool,
  timestamp: i64
}

## Message State Space

TYPE MessageState =
  | Draft        // Initial creation
  | Pending      // Awaiting approvals
  | Published    // Unanimously approved
  | Rejected     // Any denial
  | Expired      // Past timeout (specs only)

PROPERTY state_transitions:
  Draft -> Pending -> (Published | Rejected)
  Pending -> Expired IF is_spec AND now() > expires_at

## Message Operations

SEQUENCE create_message:
  1. Validation
     - Verify content hash
     - Check author authority
     - Validate timestamp

  2. State Initialization
     - Set initial fields
     - Initialize empty approvals
     - Set draft state

  3. Verification
     - Check field validity
     - Verify state consistency
     - Validate timestamps

PROPERTY post_creation:
  message.approvals.is_empty() AND
  message.timestamp <= now() AND
  message.is_published == false

## Spec Operations

SEQUENCE create_spec:
  1. Stake Verification
     - Check stake amount
     - Verify token account
     - Lock stake in escrow

  2. State Initialization
     - Set spec fields
     - Set expiration (now + 7 days)
     - Initialize approval tracking

  3. Validation
     - Verify non-co-author
     - Check thread capacity
     - Validate expiration

PROPERTY post_spec_creation:
  spec.stake_amount >= minimum_stake AND
  spec.expires_at == now() + 7 days AND
  spec.approvals.is_empty()

## Approval Processing

SEQUENCE process_approval:
  1. Authority Check
     - Verify co-author status
     - Check for duplicates
     - Validate timing

  2. Record Decision
     - Create approval record
     - Add to approval set
     - Update timestamps

  3. Check Consensus
     - Count approvals/denials
     - Compare to co-author count
     - Determine outcome

PROPERTY approval_integrity:
  approvals.no_duplicates() AND
  approvals.all_from_co_authors() AND
  approvals.timestamps_ordered()

## Value Flow Properties

TYPE ApprovalOutcome =
  | Unanimous: stake -> thread_balance
  | Denied: stake -> denier_accounts
  | Mixed: stake -> treasury

PROPERTY stake_conservation:
  FORALL spec IN pending_specs:
    spec.stake_amount == outcome_distribution_sum

## Security Properties

1. **Message Integrity**
   ```
   PROPERTY message_integrity:
     FORALL msg IN messages:
       msg.content_hash.valid() AND
       msg.timestamp <= now() AND
       msg.author.verified()
   ```

2. **Spec Integrity**
   ```
   PROPERTY spec_integrity:
     FORALL spec IN specs:
       spec.stake_amount >= minimum_stake AND
       spec.expires_at > now() AND
       spec.author NOT IN thread.co_authors
   ```

3. **Approval Integrity**
   ```
   PROPERTY approval_integrity:
     FORALL approval IN approvals:
       approval.co_author IN thread.co_authors AND
       approval.timestamp <= now() AND
       no_duplicates(message.approvals)
   ```

## Error Handling

TYPE MessageError =
  | InvalidHash
  | DuplicateApproval
  | InsufficientStake
  | ExpiredSpec
  | UnauthorizedApproval

FUNCTION handle_message_error(error: MessageError) -> Result<()>:
  log_error(error)
  revert_state()
  emit_event(error)
  RETURN Err(error)

## Implementation Notes

The message system maintains several critical invariants:

1. Message Immutability
   - Content hash never changes after creation
   - Approvals can only be added, not modified
   - Published state is permanent

2. Spec Lifecycle
   - 7-day approval window is strict
   - Stake remains locked until resolution
   - Outcomes are deterministic based on approvals

3. Approval Mechanics
   - Only co-authors can approve
   - No duplicate approvals
   - All approvals timestamped and ordered

Through these mechanisms, the message system provides a secure foundation for collaborative content curation and value distribution.
