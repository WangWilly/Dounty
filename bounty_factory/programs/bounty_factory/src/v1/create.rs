use anchor_lang::prelude::*;

use std::collections::HashSet;

use crate::errors::ErrorCode;
use crate::models::BountyV1;
use super::utils::str_extend::StringExt;

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
        seeds = [b"bounty", owner.key().as_ref(), &url.to_hashed_bytes()],
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
    assignee: Option<Pubkey>,
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
    if let Some(commissioners) = commissioners {
        let unique_commissioners: HashSet<Pubkey> = commissioners.iter().cloned().collect();
        if unique_commissioners.len() != commissioners.len() {
            return Err(ErrorCode::DuplicateCommissioners.into());
        }

        if commissioners.len() > 5 {
            return Err(ErrorCode::TooManyCommissioners.into());
        }
        if bounty.commissioners.len() != 0 && commissioners.len() % 2 == 0 {
            return Err(ErrorCode::EvenCommissioners.into());
        }
        bounty.commissioners = commissioners;
    }
    if let Some(assignee) = assignee {
        if bounty.commissioners.len() == 0 {
            return Err(ErrorCode::NoCommissioners.into());
        }
        if bounty.commissioners.contains(&assignee) {
            return Err(ErrorCode::IllegalAsignee.into());
        }
        bounty.assignee = Some(assignee);
    }
    bounty.bump = ctx.bumps.bounty;

    Ok(())
}
