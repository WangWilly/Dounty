use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::models::BountyV1;
use super::utils::str_extend::StringExt;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct CloseV1Acc<'info> {
    #[account(
        mut,
        constraint = owner.key() == bounty.owner.key() @ ErrorCode::WrongOwner,
    )]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bounty", bounty.owner.key().as_ref(), &bounty.url.to_hashed_bytes()],
        bump = bounty.bump,
        constraint = bounty.donation == 0 @ ErrorCode::IllegalClose,
        close = owner,
    )]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}
