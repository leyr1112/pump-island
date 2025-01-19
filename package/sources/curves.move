module pump_island::curves {
    public fun calculate_add_liquidity_cost(arg0: u64, arg1: u64, arg2: u64) : u64 {
        let v0 = pump_island::utils::as_u64(pump_island::utils::sub(pump_island::utils::from_u64(arg1), pump_island::utils::from_u64(arg2)));
        assert!(v0 > 0, 100);
        pump_island::utils::as_u64(pump_island::utils::sub(pump_island::utils::from_u64(pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(arg0), pump_island::utils::from_u64(arg1)), pump_island::utils::from_u64(v0)))), pump_island::utils::from_u64(arg0)))
    }
    
    public fun calculate_remove_liquidity_return(arg0: u64, arg1: u64, arg2: u64) : u64 {
        pump_island::utils::as_u64(pump_island::utils::sub(pump_island::utils::from_u64(arg1), pump_island::utils::from_u64(pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(arg1), pump_island::utils::from_u64(arg0)), pump_island::utils::from_u64(pump_island::utils::as_u64(pump_island::utils::add(pump_island::utils::from_u64(arg0), pump_island::utils::from_u64(arg2)))))))))
    }
    
    public fun calculate_token_amount_received(arg0: u64, arg1: u64, arg2: u64) : u64 {
        pump_island::utils::as_u64(pump_island::utils::sub(pump_island::utils::from_u64(arg1), pump_island::utils::from_u64(pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(arg0), pump_island::utils::from_u64(arg1)), pump_island::utils::from_u64(pump_island::utils::as_u64(pump_island::utils::add(pump_island::utils::from_u64(arg0), pump_island::utils::from_u64(arg2)))))))))
    }
}