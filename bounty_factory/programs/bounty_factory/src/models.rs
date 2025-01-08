use anchor_lang::prelude::*;

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
