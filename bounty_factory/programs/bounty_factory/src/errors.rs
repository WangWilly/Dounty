use anchor_lang::prelude::*;

////////////////////////////////////////////////////////////////////////////////
/// https://solana.stackexchange.com/questions/1595/anchor-how-can-i-check-specific-anchor-error-codes-are-caught-in-my-test-script
/// https://anchor.so/errors

#[error_code]
pub enum ErrorCode {
    #[msg("String too long")]
    StringTooLong,
    #[msg("Duplicate commissioners")]
    DuplicateCommissioners,
    #[msg("Too many commissioners")]
    TooManyCommissioners,
    #[msg("Not enough lamports")]
    NotEnoughLamports,
    #[msg("Not enough commission")]
    NotEnoughCommission,
    #[msg("Bounty not assigned")]
    BountyNotAssigned,
    #[msg("No commissioners")]
    NoCommissioners,
    #[msg("Even number of commissioners")]
    EvenCommissioners,
    #[msg("Wrong assignee")]
    WrongAssignee,
    #[msg("Wrong owner")]
    WrongOwner,
    #[msg("Wrong url")]
    WrongUrl,
    #[msg("Illegal close")]
    IllegalClose,
    #[msg("Illegal assignee")]
    IllegalAssignee,
}
