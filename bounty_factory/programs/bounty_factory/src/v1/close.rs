use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::models::BountyV1;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct CloseV1Acc<'info> {
    #[account(mut, constraint = owner.key() == bounty.owner.key())]
    pub owner: Signer<'info>,
    #[account(
        mut @ ErrorCode::WrongOwner,
        seeds = [b"bounty", bounty.owner.key().as_ref(), bounty.url.as_bytes()],
        bump = bounty.bump,
        constraint = bounty.donation == 0,
        close = owner,
    )]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////
