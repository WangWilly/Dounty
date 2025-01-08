use anchor_lang::prelude::*;

use std::collections::HashSet;

use crate::errors::ErrorCode;
use crate::models::BountyV1;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct IssueV1Acc<'info> {
    #[account(mut)]
    pub commissioner1: Signer<'info>,
    pub commissioner2: Option<Signer<'info>>,
    pub commissioner3: Option<Signer<'info>>,
    pub commissioner4: Option<Signer<'info>>,
    pub commissioner5: Option<Signer<'info>>,
    #[account(mut, seeds = [b"bounty", bounty.owner.key().as_ref(), bounty.url.as_bytes()], bump = bounty.bump)]
    pub bounty: Account<'info, BountyV1>,
    #[account(mut)]
    pub assignee: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn issue_v1_impl(ctx: Context<IssueV1Acc>) -> Result<()> {
    let bounty = &ctx.accounts.bounty;

    if bounty.asignee.is_none() {
        return Err(ErrorCode::BountyNotAssigned.into());
    }
    if bounty.asignee.unwrap() != *ctx.accounts.assignee.key {
        return Err(ErrorCode::WrongAssignee.into());
    }

    let commissioner_num = bounty.commissioners.len();
    if commissioner_num < 1 {
        return Err(ErrorCode::NoCommissioners.into());
    }
    if commissioner_num % 2 == 0 {
        return Err(ErrorCode::EvenCommissioners.into());
    }

    let commissioners: HashSet<Pubkey> = bounty.commissioners.iter().cloned().collect();
    if commissioners.contains(&ctx.accounts.assignee.key) {
        return Err(ErrorCode::WrongAssignee.into());
    }

    let mut agreed_num = 0;
    if commissioners.contains(&ctx.accounts.commissioner1.key) {
        agreed_num += 1;
    }
    if let Some(commissioner2) = &ctx.accounts.commissioner2 {
        if commissioners.contains(&commissioner2.key) {
            agreed_num += 1;
        }
    }
    if let Some(commissioner3) = &ctx.accounts.commissioner3 {
        if commissioners.contains(&commissioner3.key) {
            agreed_num += 1;
        }
    }
    if let Some(commissioner4) = &ctx.accounts.commissioner4 {
        if commissioners.contains(&commissioner4.key) {
            agreed_num += 1;
        }
    }
    if let Some(commissioner5) = &ctx.accounts.commissioner5 {
        if commissioners.contains(&commissioner5.key) {
            agreed_num += 1;
        }
    }

    if agreed_num < commissioner_num / 2 + 1 {
        return Err(ErrorCode::NotEnoughCommission.into());
    }

    let donation = ctx.accounts.bounty.donation;
    if **ctx
        .accounts
        .bounty
        .to_account_info()
        .try_borrow_lamports()?
        < donation
    {
        return Err(ErrorCode::NotEnoughLamports.into());
    }

    ctx.accounts.bounty.sub_lamports(donation)?;
    ctx.accounts.assignee.add_lamports(donation)?;
    ctx.accounts.bounty.donation = 0;

    Ok(())
}
