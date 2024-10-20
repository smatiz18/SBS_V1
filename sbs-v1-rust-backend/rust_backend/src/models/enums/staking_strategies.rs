use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(warnings)]
pub enum StakingStrategies {
    KELLY_CRITERION,
    FIXED_STAKE,
    FIXED_PERCENTAGE,
    MARTINGALE_SYSTEM,
    ANTI_MARTINGALE_SYSTEM,
    FIBONACCI_SEQUENCE,
    D_ALEMBERT_SYSTEM,
    PROPORTIONAL_BETTING,
    UNIT_BETTING,
    CONTRA_D_ALEMBERT_SYSTEM,
    MILLER_STRATEGY
}