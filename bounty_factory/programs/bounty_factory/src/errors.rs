use anchor_lang::prelude::*;

////////////////////////////////////////////////////////////////////////////////

#[error_code]
pub enum ErrorCode {
    #[msg("String too long")]
    StringTooLong,
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
    #[msg("Illegal asignee")]
    IllegalAsignee,
}
