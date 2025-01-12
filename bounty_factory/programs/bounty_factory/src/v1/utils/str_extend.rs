use anchor_lang::solana_program::hash::hash;

////////////////////////////////////////////////////////////////////////////////

pub trait StringExt {
    fn to_hashed_bytes(&self) -> [u8; 32];
}

impl StringExt for String {
    fn to_hashed_bytes(&self) -> [u8; 32] {
        let hash = hash(self.as_bytes());
        hash.to_bytes()
    }
}
