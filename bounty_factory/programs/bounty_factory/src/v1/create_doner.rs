use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction;

use crate::errors::ErrorCode;
use crate::models::{BountyV1, DonerV1};

////////////////////////////////////////////////////////////////////////////////

#[derive(Accounts)]
pub struct CreateDonerV1Acc<'info> {
    #[account(mut)]
    pub doner: Signer<'info>,
    #[account(
        init,
        payer = doner,
        space = DonerV1::INIT_SPACE,
        seeds = [b"doner", doner.key().as_ref(), bounty.key().as_ref()],
        bump,
    )]
    pub doner_account: Account<'info, DonerV1>,
    #[account(
        mut,
        seeds = [b"bounty", bounty.owner.key().as_ref(), bounty.url.as_bytes()],
        bump = bounty.bump,
    )]
    pub bounty: Account<'info, BountyV1>,
    pub system_program: Program<'info, System>,
}

////////////////////////////////////////////////////////////////////////////////

pub fn create_doner_v1_impl(
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

    ////////////////////////////////////////////////////////////////////////////
    // Spent from the balance of an account it does not own
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
