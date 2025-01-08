use anchor_lang::prelude::*;

use std::collections::HashSet;

pub mod errors;
use crate::errors::ErrorCode;
use anchor_lang::solana_program::system_instruction;

////////////////////////////////////////////////////////////////////////////////

declare_id!("HvZ9DweFNYWqV4WNf83cCWogUXmabZHsDNT29DaRUXvm");

#[program]
pub mod bounty_factory {
    use super::*;

    pub fn create_v1(
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

    pub fn update_v1(
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

    pub fn issue_v1(ctx: Context<IssueV1Acc>) -> Result<()> {
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

        let comminssioners: HashSet<Pubkey> =
            bounty.commissioners.iter().cloned().collect();
        if comminssioners.contains(&ctx.accounts.assignee.key) {
            return Err(ErrorCode::WrongAssignee.into());
        }

        let mut agreed_num = 0;
        if comminssioners.contains(&ctx.accounts.comminssioner1.key) {
            agreed_num += 1;
        }
        if let Some(comminssioner2) = &ctx.accounts.comminssioner2 {
            if comminssioners.contains(&comminssioner2.key) {
                agreed_num += 1;
            }
        }
        if let Some(comminssioner3) = &ctx.accounts.comminssioner3 {
            if comminssioners.contains(&comminssioner3.key) {
                agreed_num += 1;
            }
        }
        if let Some(comminssioner4) = &ctx.accounts.comminssioner4 {
            if comminssioners.contains(&comminssioner4.key) {
                agreed_num += 1;
            }
        }
        if let Some(comminssioner5) = &ctx.accounts.comminssioner5 {
            if comminssioners.contains(&comminssioner5.key) {
                agreed_num += 1;
            }
        }

        if agreed_num < commissioner_num / 2 + 1 {
            return Err(ErrorCode::NotEnoughCommission.into());
        }

        let donation = ctx
            .accounts
            .bounty
            .donation;
        if **ctx.accounts.bounty.to_account_info().try_borrow_lamports()? < donation {
            return Err(ErrorCode::NotEnoughLamports.into());
        }

        ctx.accounts.bounty.sub_lamports(donation)?;
        ctx.accounts.assignee.add_lamports(donation)?;
        ctx.accounts.bounty.donation = 0;

        Ok(())
    }

    pub fn create_doner_v1(
        ctx: Context<CreateDonerV1Acc>,
        donation: u64,
        message: String,
    ) -> Result<()> {
        if message.len() > 280 {
            return Err(ErrorCode::StringTooLong.into());
        }
        if **ctx.accounts.doner.try_borrow_lamports()? < donation {
            return Err(ErrorCode::NotEnoughLamports.into());
        }

        let doner_account = &mut ctx.accounts.doner_account;
        doner_account.doner = *ctx.accounts.doner.key;
        let clock: Clock = Clock::get().unwrap();
        doner_account.timestamp = clock.unix_timestamp;
        doner_account.donation = donation;
        doner_account.bounty = ctx.accounts.bounty.key();
        doner_account.message = message;
        doner_account.bump = ctx.bumps.doner_account;

        // Create the transfer instruction
        let from_account = ctx.accounts.doner.to_account_info();
        let to_account = ctx.accounts.bounty.to_account_info();
        let transfer_instruction =
            system_instruction::transfer(from_account.key, to_account.key, donation);

        // Invoke the transfer instruction
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                from_account.clone(),
                to_account.clone(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        let bounty = &mut ctx.accounts.bounty;
        bounty.donation += donation;

        Ok(())
    }
}

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
#[instruction(title:String,url:String)]
pub struct CreateV1Acc<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = BountyV1::INIT_SPACE, seeds = [b"bounty", owner.key().as_ref(), url.as_bytes()], bump)]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateV1Acc<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"bounty", owner.key().as_ref(), bounty.url.as_bytes()], bump = bounty.bump)]
    pub bounty: Account<'info, BountyV1>,
}

#[derive(Accounts)]
pub struct IssueV1Acc<'info> {
    #[account(mut)]
    pub comminssioner1: Signer<'info>,
    pub comminssioner2: Option<Signer<'info>>,
    pub comminssioner3: Option<Signer<'info>>,
    pub comminssioner4: Option<Signer<'info>>,
    pub comminssioner5: Option<Signer<'info>>,
    #[account(mut, seeds = [b"bounty", bounty.owner.key().as_ref(), bounty.url.as_bytes()], bump = bounty.bump)]
    pub bounty: Account<'info, BountyV1>,
    #[account(mut)]
    /// CHECK: The assignee should be the same as the bounty asignee
    pub assignee: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateDonerV1Acc<'info> {
    #[account(mut)]
    pub doner: Signer<'info>,
    #[account(init, payer = doner, space = DonerV1::INIT_SPACE, seeds = [b"doner", doner.key().as_ref(), bounty.key().as_ref()], bump)]
    pub doner_account: Account<'info, DonerV1>,
    #[account(mut, seeds = [b"bounty", bounty.owner.key().as_ref(), bounty.url.as_bytes()], bump = bounty.bump)]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////

#[account]
#[derive(InitSpace)]
pub struct BountyV1 {
    pub owner: Pubkey,
    pub timestamp: i64,
    pub donation: u64,
    pub asignee: Option<Pubkey>,
    #[max_len(5)]
    pub commissioners: Vec<Pubkey>,
    #[max_len(50)]
    pub title: String,
    #[max_len(280)]
    pub url: String,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct DonerV1 {
    pub doner: Pubkey,
    pub timestamp: i64,
    pub bounty: Pubkey,
    pub donation: u64,
    #[max_len(280)]
    pub message: String,
    pub bump: u8,
}
