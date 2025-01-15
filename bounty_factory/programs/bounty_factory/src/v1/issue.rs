use anchor_lang::prelude::*;

use std::collections::HashSet;

use crate::errors::ErrorCode;
use crate::models::BountyV1;
use super::utils::str_extend::StringExt;

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct IssueV1Acc<'info> {
    #[account(mut)]
    pub commissioner1: Signer<'info>,
    pub commissioner2: Option<Signer<'info>>,
    pub commissioner3: Option<Signer<'info>>,
    pub commissioner4: Option<Signer<'info>>,
    pub commissioner5: Option<Signer<'info>>,
    #[account(
        mut,
        seeds = [
            b"bounty",
            bounty.owner.key().as_ref(),
            &bounty.url.to_hashed_bytes(),
        ],
        bump = bounty.bump,
    )]
    pub bounty: Account<'info, BountyV1>,
    #[account(mut)]
    pub assignee: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn issue_v1_impl(ctx: Context<IssueV1Acc>) -> Result<()> {
    let bounty = &ctx.accounts.bounty;

    if bounty.assignee.is_none() {
        return Err(ErrorCode::BountyNotAssigned.into());
    }
    if bounty.assignee.unwrap() != *ctx.accounts.assignee.key {
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
        return Err(ErrorCode::IllegalAsignee.into());
    }
    let mut agreed_num: usize = 0;
    if commissioners.contains(&ctx.accounts.commissioner1.key) {
        agreed_num += 1;
    }
    in_commission(&ctx.accounts.commissioner2, &commissioners, &mut agreed_num);
    in_commission(&ctx.accounts.commissioner3, &commissioners, &mut agreed_num);
    in_commission(&ctx.accounts.commissioner4, &commissioners, &mut agreed_num);
    in_commission(&ctx.accounts.commissioner5, &commissioners, &mut agreed_num);
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

////////////////////////////////////////////////////////////////////////////////

fn in_commission<'info>(examee: &Option<Signer<'info>>, commissioners: &HashSet<Pubkey>, agreed_num: &mut usize) {
    if let Some(examee) = examee {
        if commissioners.contains(&examee.key) {
            *agreed_num += 1;
        }
    }
}
