use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::models::BountyV1;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
#[instruction(title:String,url:String)]
pub struct CreateV1Acc<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = BountyV1::INIT_SPACE,
        seeds = [b"bounty", owner.key().as_ref(), url.as_bytes()],
        bump,
    )]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn create_v1_impl(
    ctx: Context<CreateV1Acc>,
    title: String,
    url: String,
    commissioners: Option<Vec<Pubkey>>,
    asignee: Option<Pubkey>,
) -> Result<()> {
    if title.len() > 50 {
        return Err(ErrorCode::StringTooLong.into());
    }
    if url.len() > 280 {
        return Err(ErrorCode::StringTooLong.into());
    }

    let bounty = &mut ctx.accounts.bounty;
    bounty.owner = *ctx.accounts.owner.key;
    let clock: Clock = Clock::get().unwrap();
    bounty.timestamp = clock.unix_timestamp;
    bounty.donation = 0;
    bounty.title = title;
    bounty.url = url;
    bounty.commissioners = commissioners.unwrap_or_default();
    bounty.asignee = asignee;
    bounty.bump = ctx.bumps.bounty;

    Ok(())
}
