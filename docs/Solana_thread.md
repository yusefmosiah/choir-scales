# Thread State and Behavior

VERSION thread_system:
  invariants: {
    "Thread ownership integrity",
    "Message approval consensus",
    "Value flow clarity"
  }
  assumptions: {
    "Co-author trust",
    "Message meaning",
    "Value recognition"
  }
  implementation: "0.1.0"

## Core Thread State

TYPE Thread = {
  // Identity
  thread_id: String,
  co_authors: Set<PublicKey>,
  created_at: i64,
  updated_at: i64,

  // Content
  messages: Vec<Message>,
  message_count: u32,
  pending_specs: Vec<SpecMessage>,

  // Value
  token_balance: u64,
  minimum_stake: u64
}

## Thread Patterns

1. **Co-author Trust**
   - Group forms through message approval
   - Trust builds through shared decisions
   - Value accumulates with quality content
   - Understanding deepens over time

2. **Message Flow**
   - Messages start as possibilities
   - Co-authors recognize value
   - Agreement brings clarity
   - Meaning becomes fixed

3. **Value Recognition**
   - Stakes show commitment
   - Approvals create worth
   - Quality draws value
   - Patterns emerge naturally

## State Changes

SEQUENCE thread_lifecycle:
  1. Creation
     - Single author starts thread
     - Empty but ready for content
     - No value yet held
     - Trust begins to form

  2. Growth
     - Messages proposed
     - Co-authors gather
     - Value accumulates
     - Understanding builds

  3. Maturity
     - Strong co-author group
     - Clear thread meaning
     - Stable value held
     - Natural patterns set

## Implementation Notes

The thread system maintains several natural properties:

1. Trust Formation
   - Co-authors emerge organically
   - Agreement builds naturally
   - Value flows to quality
   - Patterns self-reinforce

2. Message Clarity
   - Meaning needs agreement
   - Understanding takes time
   - Value shows truth
   - Patterns reveal worth

3. Value Flow
   - Stakes show care
   - Quality draws value
   - Patterns guide flow
   - Worth finds truth

Through these simple patterns, threads provide space for meaning and value to emerge naturally.
