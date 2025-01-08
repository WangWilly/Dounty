use anchor_lang::prelude::*;

pub mod errors;
pub mod models;

pub mod v1;
use v1::*;

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
        create_v1_impl(ctx, title, url, commissioners, asignee)
    }

    pub fn update_v1(
        ctx: Context<UpdateV1Acc>,
        title: Option<String>,
        commissioners: Option<Vec<Pubkey>>,
        asignee: Option<Pubkey>,
    ) -> Result<()> {
        update_v1_impl(ctx, title, commissioners, asignee)
    }

    pub fn issue_v1(ctx: Context<IssueV1Acc>) -> Result<()> {
        issue_v1_impl(ctx)
    }

    pub fn close_v1(_ctx: Context<CloseV1Acc>) -> Result<()> {
        Ok(())
    }

    pub fn create_doner_v1(
        ctx: Context<CreateDonerV1Acc>,
        donation: u64,
        message: String,
    ) -> Result<()> {
        create_doner_v1_impl(ctx, donation, message)
    }
}
