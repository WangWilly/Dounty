use anchor_lang::prelude::*;

use std::collections::HashSet;

use crate::errors::ErrorCode;
use crate::models::BountyV1;
use super::utils::str_extend::StringExt;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct UpdateV1Acc<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"bounty", owner.key().as_ref(), &bounty.url.to_hashed_bytes()],
        bump = bounty.bump,
    )]
    pub bounty: Account<'info, BountyV1>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn update_v1_impl(
    ctx: Context<UpdateV1Acc>,
    title: Option<String>,
    commissioners: Option<Vec<Pubkey>>,
    assignee: Option<Pubkey>,
) -> Result<()> {
    let bounty = &mut ctx.accounts.bounty;
    if let Some(title) = title {
        if title.len() > 50 {
            return Err(ErrorCode::StringTooLong.into());
        }
        bounty.title = title;
    }
    if let Some(commissioners) = commissioners {
        if bounty.assignee.is_some() {
            return Err(ErrorCode::AssigneeRestriction.into());
        }

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
        if bounty.assignee.is_some() {
            return Err(ErrorCode::ChangeAssigneeQuorum.into());
        }

        if bounty.commissioners.len() == 0 {
            return Err(ErrorCode::NoCommissioners.into());
        }
        if bounty.commissioners.contains(&assignee) {
            return Err(ErrorCode::IllegalAssignee.into());
        }
        bounty.assignee = Some(assignee);
    }

    Ok(())
}
