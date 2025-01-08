use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::models::BountyV1;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct UpdateV1Acc<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bounty", owner.key().as_ref(), bounty.url.as_bytes()],
        bump = bounty.bump,
    )]
    pub bounty: Account<'info, BountyV1>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn update_v1_impl(
    ctx: Context<UpdateV1Acc>,
    title: Option<String>,
    commissioners: Option<Vec<Pubkey>>,
    asignee: Option<Pubkey>,
) -> Result<()> {
    let bounty = &mut ctx.accounts.bounty;
    if let Some(title) = title {
        if title.len() > 50 {
            return Err(ErrorCode::StringTooLong.into());
        }
        bounty.title = title;
    }
    if let Some(commissioners) = commissioners {
        bounty.commissioners = commissioners;
    }
    if let Some(asignee) = asignee {
        bounty.asignee = Some(asignee);
    }

    Ok(())
}
