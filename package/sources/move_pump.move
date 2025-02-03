#[allow(lint(coin_field, self_transfer), unused_variable, deprecated_usage)]
module pump_island::move_pump {
    public struct Configuration has store, key {
        id: 0x2::object::UID,
        version: u64,
        admin: address,
        platform_fee: u64,
        graduated_fee: u64,
        initial_virtual_sui_reserves: u64,
        initial_virtual_token_reserves: u64,
        remain_token_reserves: u64,
        token_decimals: u8,
    }
    
    public struct ThresholdConfig has store, key {
        id: 0x2::object::UID,
        threshold: u64,
    }
    
    public struct Pool<phantom T0> has store, key {
        id: 0x2::object::UID,
        real_sui_reserves: 0x2::coin::Coin<0x2::sui::SUI>,
        real_token_reserves: 0x2::coin::Coin<T0>,
        virtual_token_reserves: u64,
        virtual_sui_reserves: u64,
        remain_token_reserves: 0x2::coin::Coin<T0>,
        is_completed: bool,
    }
    
    public struct ConfigChangedEvent has copy, drop, store {
        old_platform_fee: u64,
        new_platform_fee: u64,
        old_graduated_fee: u64,
        new_graduated_fee: u64,
        old_initial_virtual_sui_reserves: u64,
        new_initial_virtual_sui_reserves: u64,
        old_initial_virtual_token_reserves: u64,
        new_initial_virtual_token_reserves: u64,
        old_remain_token_reserves: u64,
        new_remain_token_reserves: u64,
        old_token_decimals: u8,
        new_token_decimals: u8,
        ts: u64,
    }
    
    public struct CreatedEvent has copy, drop, store {
        name: 0x1::ascii::String,
        symbol: 0x1::ascii::String,
        uri: 0x1::ascii::String,
        description: 0x1::ascii::String,
        twitter: 0x1::ascii::String,
        telegram: 0x1::ascii::String,
        website: 0x1::ascii::String,
        token_address: 0x1::ascii::String,
        bonding_curve: 0x1::ascii::String,
        pool_id: 0x2::object::ID,
        created_by: address,
        virtual_sui_reserves: u64,
        virtual_token_reserves: u64,
        ts: u64,
    }
    
    public struct OwnershipTransferredEvent has copy, drop, store {
        old_admin: address,
        new_admin: address,
        ts: u64,
    }
    
    public struct PoolCompletedEvent has copy, drop, store {
        token_address: 0x1::ascii::String,
        lp: 0x1::ascii::String,
        ts: u64,
    }
    
    public struct TradedEvent has copy, drop, store {
        is_buy: bool,
        user: address,
        token_address: 0x1::ascii::String,
        sui_amount: u64,
        token_amount: u64,
        virtual_sui_reserves: u64,
        virtual_token_reserves: u64,
        pool_id: 0x2::object::ID,
        ts: u64,
    }
    
    fun swap<T0>(arg0: &mut Pool<T0>, arg1: 0x2::coin::Coin<T0>, arg2: 0x2::coin::Coin<0x2::sui::SUI>, arg3: u64, arg4: u64, arg5: &mut 0x2::tx_context::TxContext) : (0x2::coin::Coin<T0>, 0x2::coin::Coin<0x2::sui::SUI>) {
        assert!(0x2::coin::value<T0>(&arg1) > 0 || 0x2::coin::value<0x2::sui::SUI>(&arg2) > 0, 2);
        if (0x2::coin::value<T0>(&arg1) > 0) {
            arg0.virtual_token_reserves = arg0.virtual_token_reserves - arg3;
        };
        if (0x2::coin::value<0x2::sui::SUI>(&arg2) > 0) {
            arg0.virtual_sui_reserves = arg0.virtual_sui_reserves - arg4;
        };
        arg0.virtual_token_reserves = arg0.virtual_token_reserves + 0x2::coin::value<T0>(&arg1);
        arg0.virtual_sui_reserves = arg0.virtual_sui_reserves + 0x2::coin::value<0x2::sui::SUI>(&arg2);
        assert_lp_value_is_increased_or_not_changed(arg0.virtual_token_reserves, arg0.virtual_sui_reserves, arg0.virtual_token_reserves, arg0.virtual_sui_reserves);
        0x2::coin::join<T0>(&mut arg0.real_token_reserves, arg1);
        0x2::coin::join<0x2::sui::SUI>(&mut arg0.real_sui_reserves, arg2);
        (0x2::coin::split<T0>(&mut arg0.real_token_reserves, arg3, arg5), 0x2::coin::split<0x2::sui::SUI>(&mut arg0.real_sui_reserves, arg4, arg5))
    }
    
    public fun asert_pool_not_completed<T0>(arg0: &Configuration, arg1: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x1::type_name::get<T0>();
        assert!(0x2::dynamic_object_field::borrow<0x1::ascii::String, Pool<T0>>(&arg0.id, 0x1::type_name::get_address(&v0)).is_completed, 9);
    }
    
    fun assert_lp_value_is_increased_or_not_changed(arg0: u64, arg1: u64, arg2: u64, arg3: u64) {
        assert!((arg0 as u128) * (arg1 as u128) <= (arg2 as u128) * (arg3 as u128), 2);
    }
    
    fun assert_version(arg0: u64) {
        assert!(arg0 == 13, 4);
    }
    
    public entry fun buy<T0>(arg0: &mut Configuration, mut arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg3: u64, arg4: &0x2::clock::Clock, arg5: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg5);
        assert_version(arg0.version);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1));
        assert!(!v2.is_completed, 5);
        assert!(arg3 > 0, 2);
        let v3 = 0x2::coin::value<0x2::sui::SUI>(&arg1);
        let v4 = v2.virtual_token_reserves - 0x2::coin::value<T0>(&v2.remain_token_reserves);
        let v5 = 0x2::math::min(arg3, v4);
        let v6 = pump_island::curves::calculate_add_liquidity_cost(v2.virtual_sui_reserves, v2.virtual_token_reserves, v5) + 1;
        let v7 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v6), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v3 >= v6 + v7, 6);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg1, v7, arg5), arg0.admin);
        let (v8, v9) = swap<T0>(v2, 0x2::coin::zero<T0>(arg5), arg1, v5, v3 - v6 - v7, arg5);
        let v10 = v8;
        v2.virtual_token_reserves = v2.virtual_token_reserves - 0x2::coin::value<T0>(&v10);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(v9, v0);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v10, v0);
        if (v4 == v5 || 0x2::coin::value<0x2::sui::SUI>(&v2.real_sui_reserves) >= 3000000000000) {
            transfer_pool<T0>(v2, arg4, arg5);
        };
        let v11 = TradedEvent{
            is_buy                 : true, 
            user                   : v0, 
            token_address          : 0x1::type_name::into_string(v1), 
            sui_amount             : v6, 
            token_amount           : v5, 
            virtual_sui_reserves   : v2.virtual_sui_reserves, 
            virtual_token_reserves : v2.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v2), 
            ts                     : 0x2::clock::timestamp_ms(arg4),
        };
        0x2::event::emit<TradedEvent>(v11);
    }
    
    fun buy_direct<T0>(mut arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: &mut Pool<T0>, arg3: u64, arg4: u64, arg5: address, arg6: u64, arg7: &0x2::clock::Clock, arg8: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg8);
        assert!(!arg2.is_completed, 5);
        assert!(arg3 > 0, 2);
        let v1 = 0x2::coin::value<0x2::sui::SUI>(&arg1);
        let v2 = arg2.virtual_token_reserves - 0x2::coin::value<T0>(&arg2.remain_token_reserves);
        let v3 = 0x2::math::min(arg3, v2);
        let v4 = pump_island::curves::calculate_add_liquidity_cost(arg2.virtual_sui_reserves, arg2.virtual_token_reserves, v3) + 1;
        let v5 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v4), pump_island::utils::from_u64(arg4)), pump_island::utils::from_u64(10000)));
        assert!(v1 >= v4 + v5, 6);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg1, v5, arg8), arg5);
        let (v6, v7) = swap<T0>(arg2, 0x2::coin::zero<T0>(arg8), arg1, v3, v1 - v4 - v5, arg8);
        let v8 = v6;
        arg2.virtual_token_reserves = arg2.virtual_token_reserves - 0x2::coin::value<T0>(&v8);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(v7, v0);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v8, v0);
        if (v2 == v3 || 0x2::coin::value<0x2::sui::SUI>(&arg2.real_sui_reserves) >= 6000000000000) {
            transfer_pool<T0>(arg2, arg7, arg8);
        };
        let v9 = TradedEvent{
            is_buy                 : true, 
            user                   : v0, 
            token_address          : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            sui_amount             : v4, 
            token_amount           : v3, 
            virtual_sui_reserves   : arg2.virtual_sui_reserves, 
            virtual_token_reserves : arg2.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(arg2), 
            ts                     : 0x2::clock::timestamp_ms(arg7),
        };
        0x2::event::emit<TradedEvent>(v9);
    }
    
    public fun buy_returns<T0>(arg0: &mut Configuration, mut arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg3: u64, arg4: &0x2::clock::Clock, arg5: &mut 0x2::tx_context::TxContext) : (0x2::coin::Coin<0x2::sui::SUI>, 0x2::coin::Coin<T0>) {
        assert_version(arg0.version);
        let v0 = 0x1::type_name::get<T0>();
        let v1 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v0));
        assert!(!v1.is_completed, 5);
        assert!(arg3 > 0, 2);
        let v2 = v1.virtual_token_reserves - 0x2::coin::value<T0>(&v1.remain_token_reserves);
        let v3 = 0x2::math::min(arg3, v2);
        let v4 = 0x2::coin::value<0x2::sui::SUI>(&arg1);
        let v5 = pump_island::curves::calculate_add_liquidity_cost(v1.virtual_sui_reserves, v1.virtual_token_reserves, v3) + 1;
        let v6 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v5), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v4 >= v5 + v6, 6);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg1, v6, arg5), arg0.admin);
        let (v7, v8) = swap<T0>(v1, 0x2::coin::zero<T0>(arg5), arg1, v3, v4 - v5 - v6, arg5);
        let v9 = v7;
        v1.virtual_token_reserves = v1.virtual_token_reserves - 0x2::coin::value<T0>(&v9);
        if (v2 == v3 || 0x2::coin::value<0x2::sui::SUI>(&v1.real_sui_reserves) >= 3000000000000) {
            transfer_pool<T0>(v1, arg4, arg5);
        };
        let v10 = TradedEvent{
            is_buy                 : true, 
            user                   : 0x2::tx_context::sender(arg5), 
            token_address          : 0x1::type_name::into_string(v0), 
            sui_amount             : v5, 
            token_amount           : v3, 
            virtual_sui_reserves   : v1.virtual_sui_reserves, 
            virtual_token_reserves : v1.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v1), 
            ts                     : 0x2::clock::timestamp_ms(arg4),
        };
        0x2::event::emit<TradedEvent>(v10);
        (v8, v9)
    }
    
    
    public fun buy_returns_v2<T0>(arg0: &mut Configuration, arg1: &mut ThresholdConfig, mut arg2: 0x2::coin::Coin<0x2::sui::SUI>, arg4: u64, arg5: &0x2::clock::Clock, arg6: &mut 0x2::tx_context::TxContext) : (0x2::coin::Coin<0x2::sui::SUI>, 0x2::coin::Coin<T0>) {
        assert_version(arg0.version);
        let v0 = 0x1::type_name::get<T0>();
        let v1 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v0));
        assert!(!v1.is_completed, 5);
        assert!(arg4 > 0, 2);
        let v2 = v1.virtual_token_reserves - 0x2::coin::value<T0>(&v1.remain_token_reserves);
        let v3 = 0x2::math::min(arg4, v2);
        let v4 = 0x2::coin::value<0x2::sui::SUI>(&arg2);
        let v5 = pump_island::curves::calculate_add_liquidity_cost(v1.virtual_sui_reserves, v1.virtual_token_reserves, v3) + 1;
        let v6 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v5), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v4 >= v5 + v6, 6);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg2, v6, arg6), arg0.admin);
        let (v7, v8) = swap<T0>(v1, 0x2::coin::zero<T0>(arg6), arg2, v3, v4 - v5 - v6, arg6);
        let v9 = v7;
        v1.virtual_token_reserves = v1.virtual_token_reserves - 0x2::coin::value<T0>(&v9);
        if (v2 == v3 || 0x2::coin::value<0x2::sui::SUI>(&v1.real_sui_reserves) >= arg1.threshold) {
            transfer_pool<T0>(v1, arg5, arg6);
        };
        let v10 = TradedEvent{
            is_buy                 : true, 
            user                   : 0x2::tx_context::sender(arg6), 
            token_address          : 0x1::type_name::into_string(v0), 
            sui_amount             : v5, 
            token_amount           : v3, 
            virtual_sui_reserves   : v1.virtual_sui_reserves, 
            virtual_token_reserves : v1.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v1), 
            ts                     : 0x2::clock::timestamp_ms(arg5),
        };
        0x2::event::emit<TradedEvent>(v10);
        (v8, v9)
    }
    
    public entry fun buy_v2<T0>(arg0: &mut Configuration, arg1: &mut ThresholdConfig, mut arg2: 0x2::coin::Coin<0x2::sui::SUI>, arg4: u64, arg5: &0x2::clock::Clock, arg6: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg6);
        assert_version(arg0.version);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1));
        assert!(!v2.is_completed, 5);
        assert!(arg4 > 0, 2);
        let v3 = 0x2::coin::value<0x2::sui::SUI>(&arg2);
        let v4 = v2.virtual_token_reserves - 0x2::coin::value<T0>(&v2.remain_token_reserves);
        let v5 = 0x2::math::min(arg4, v4);
        let v6 = pump_island::curves::calculate_add_liquidity_cost(v2.virtual_sui_reserves, v2.virtual_token_reserves, v5) + 1;
        let v7 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v6), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v3 >= v6 + v7, 6);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg2, v7, arg6), arg0.admin);
        let (v8, v9) = swap<T0>(v2, 0x2::coin::zero<T0>(arg6), arg2, v5, v3 - v6 - v7, arg6);
        let v10 = v8;
        v2.virtual_token_reserves = v2.virtual_token_reserves - 0x2::coin::value<T0>(&v10);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(v9, v0);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v10, v0);
        if (v4 == v5 || 0x2::coin::value<0x2::sui::SUI>(&v2.real_sui_reserves) >= arg1.threshold) {
            transfer_pool<T0>(v2, arg5, arg6);
        };
        let v11 = TradedEvent{
            is_buy                 : true, 
            user                   : v0, 
            token_address          : 0x1::type_name::into_string(v1), 
            sui_amount             : v6, 
            token_amount           : v5, 
            virtual_sui_reserves   : v2.virtual_sui_reserves, 
            virtual_token_reserves : v2.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v2), 
            ts                     : 0x2::clock::timestamp_ms(arg5),
        };
        0x2::event::emit<TradedEvent>(v11);
    }
    
    public fun check_pool_exist<T0>(arg0: &Configuration, arg1: &mut 0x2::tx_context::TxContext) : bool {
        let v0 = 0x1::type_name::get<T0>();
        0x2::dynamic_object_field::exists_<0x1::ascii::String>(&arg0.id, 0x1::type_name::get_address(&v0))
    }
    
    public entry fun create<T0>(arg0: &mut Configuration, mut arg1: 0x2::coin::TreasuryCap<T0>, arg2: &0x2::clock::Clock, arg3: 0x1::ascii::String, arg4: 0x1::ascii::String, arg5: 0x1::ascii::String, arg6: 0x1::ascii::String, arg7: 0x1::ascii::String, arg8: 0x1::ascii::String, arg9: 0x1::ascii::String, arg10: &mut 0x2::tx_context::TxContext) {
        assert!(0x1::ascii::length(&arg5) <= 300, 2);
        assert!(0x1::ascii::length(&arg6) <= 1000, 2);
        assert!(0x1::ascii::length(&arg7) <= 500, 2);
        assert!(0x1::ascii::length(&arg8) <= 500, 2);
        assert!(0x1::ascii::length(&arg9) <= 500, 2);
        assert_version(arg0.version);
        assert!(0x2::coin::total_supply<T0>(&arg1) == 0, 7);
        let v0 = Pool<T0>{
            id                     : 0x2::object::new(arg10), 
            real_sui_reserves      : 0x2::coin::zero<0x2::sui::SUI>(arg10), 
            real_token_reserves    : 0x2::coin::mint<T0>(&mut arg1, arg0.initial_virtual_token_reserves - arg0.remain_token_reserves, arg10), 
            virtual_token_reserves : arg0.initial_virtual_token_reserves, 
            virtual_sui_reserves   : arg0.initial_virtual_sui_reserves, 
            remain_token_reserves  : 0x2::coin::mint<T0>(&mut arg1, arg0.remain_token_reserves, arg10), 
            is_completed           : false,
        };
        0x2::transfer::public_transfer<0x2::coin::TreasuryCap<T0>>(arg1, @0x0);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x1::type_name::get<Pool<T0>>();
        let v3 = CreatedEvent{
            name                   : arg3, 
            symbol                 : arg4, 
            uri                    : arg5, 
            description            : arg6, 
            twitter                : arg7, 
            telegram               : arg8, 
            website                : arg9, 
            token_address          : 0x1::type_name::into_string(v1), 
            bonding_curve          : 0x1::type_name::get_module(&v2), 
            pool_id                : 0x2::object::id<Pool<T0>>(&v0), 
            created_by             : 0x2::tx_context::sender(arg10), 
            virtual_sui_reserves   : arg0.initial_virtual_sui_reserves, 
            virtual_token_reserves : arg0.initial_virtual_token_reserves, 
            ts                     : 0x2::clock::timestamp_ms(arg2),
        };
        0x2::dynamic_object_field::add<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1), v0);
        0x2::event::emit<CreatedEvent>(v3);
    }
    
    public entry fun create_and_first_buy<T0>(arg0: &mut Configuration, mut arg1: 0x2::coin::TreasuryCap<T0>, arg3: 0x2::coin::Coin<0x2::sui::SUI>, arg4: u64, arg5: &0x2::clock::Clock, arg6: 0x1::ascii::String, arg7: 0x1::ascii::String, arg8: 0x1::ascii::String, arg9: 0x1::ascii::String, arg10: 0x1::ascii::String, arg11: 0x1::ascii::String, arg12: 0x1::ascii::String, arg13: &mut 0x2::tx_context::TxContext) {
        assert!(0x1::ascii::length(&arg8) <= 300, 2);
        assert!(0x1::ascii::length(&arg9) <= 1000, 2);
        assert!(0x1::ascii::length(&arg10) <= 500, 2);
        assert!(0x1::ascii::length(&arg11) <= 500, 2);
        assert!(0x1::ascii::length(&arg12) <= 500, 2);
        assert_version(arg0.version);
        assert!(0x2::coin::total_supply<T0>(&arg1) == 0, 7);
        let mut v0 = Pool<T0>{
            id                     : 0x2::object::new(arg13), 
            real_sui_reserves      : 0x2::coin::zero<0x2::sui::SUI>(arg13), 
            real_token_reserves    : 0x2::coin::mint<T0>(&mut arg1, arg0.initial_virtual_token_reserves - arg0.remain_token_reserves, arg13), 
            virtual_token_reserves : arg0.initial_virtual_token_reserves, 
            virtual_sui_reserves   : arg0.initial_virtual_sui_reserves, 
            remain_token_reserves  : 0x2::coin::mint<T0>(&mut arg1, arg0.remain_token_reserves, arg13), 
            is_completed           : false,
        };
        0x2::transfer::public_transfer<0x2::coin::TreasuryCap<T0>>(arg1, @0x0);
        let v1 = 0x1::type_name::get<T0>();
        if (0x2::coin::value<0x2::sui::SUI>(&arg3) > 0) {
            buy_direct<T0>(arg3, &mut v0, arg4, arg0.platform_fee, arg0.admin, arg0.graduated_fee, arg5, arg13);
        } else {
            0x2::coin::destroy_zero<0x2::sui::SUI>(arg3);
        };
        let v2 = 0x1::type_name::get<Pool<T0>>();
        let v3 = CreatedEvent{
            name                   : arg6, 
            symbol                 : arg7, 
            uri                    : arg8, 
            description            : arg9, 
            twitter                : arg10, 
            telegram               : arg11, 
            website                : arg12, 
            token_address          : 0x1::type_name::into_string(v1), 
            bonding_curve          : 0x1::type_name::get_module(&v2), 
            pool_id                : 0x2::object::id<Pool<T0>>(&v0), 
            created_by             : 0x2::tx_context::sender(arg13), 
            virtual_sui_reserves   : arg0.initial_virtual_sui_reserves, 
            virtual_token_reserves : arg0.initial_virtual_token_reserves, 
            ts                     : 0x2::clock::timestamp_ms(arg5),
        };
        0x2::dynamic_object_field::add<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1), v0);
        0x2::event::emit<CreatedEvent>(v3);
    }
    
    public entry fun create_and_first_buy_v2<T0>(arg0: &mut Configuration, arg1: &mut 0x2::coin::CoinMetadata<T0>, arg2: 0x2::coin::DenyCap<T0>, arg3: 0x2::coin::TreasuryCap<T0>, arg5: 0x2::coin::Coin<0x2::sui::SUI>, arg6: u64, arg7: &0x2::clock::Clock, arg8: 0x1::ascii::String, arg9: 0x1::ascii::String, arg10: 0x1::ascii::String, arg11: 0x1::ascii::String, arg12: 0x1::ascii::String, arg13: 0x1::ascii::String, arg14: 0x1::ascii::String, arg15: &mut 0x2::tx_context::TxContext) {
        abort 1
    }
    
    public entry fun create_threshold_config(arg0: u64, arg1: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::tx_context::sender(arg1) == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        let v0 = ThresholdConfig{
            id        : 0x2::object::new(arg1), 
            threshold : arg0,
        };
        0x2::transfer::public_share_object<ThresholdConfig>(v0);
    }
    
    public entry fun create_v2<T0>(arg0: &mut Configuration, arg1: &mut 0x2::coin::CoinMetadata<T0>, arg2: 0x2::coin::DenyCap<T0>, arg3: 0x2::coin::TreasuryCap<T0>, arg4: &0x2::clock::Clock, arg5: 0x1::ascii::String, arg6: 0x1::ascii::String, arg7: 0x1::ascii::String, arg8: 0x1::ascii::String, arg9: 0x1::ascii::String, arg10: 0x1::ascii::String, arg11: 0x1::ascii::String, arg12: &mut 0x2::tx_context::TxContext) {
        abort 1
    }
    
    public fun early_complete_pool<T0>(arg0: &mut Configuration, arg1: &mut ThresholdConfig, arg2: &0x2::clock::Clock, arg3: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg3);
        assert!(v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1));
        v2.is_completed = true;
        let v3 = 0x2::coin::value<0x2::sui::SUI>(&v2.real_sui_reserves);
        let mut v4 = 0x2::coin::split<0x2::sui::SUI>(&mut v2.real_sui_reserves, v3, arg3);
        let value = 0x2::coin::value<T0>(&v2.real_token_reserves);
        let mut v5 = 0x2::coin::split<T0>(&mut v2.real_token_reserves, value, arg3);
        assert!(v3 >= arg1.threshold, 3);
        let value = 0x2::coin::value<T0>(&v2.remain_token_reserves);
        0x2::coin::join<T0>(&mut v5, 0x2::coin::split<T0>(&mut v2.remain_token_reserves, value, arg3));
        if (v3 >= arg1.threshold) {
            0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut v4, arg1.threshold, arg3), @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b);
            0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(0x2::coin::split<T0>(&mut v5, arg0.remain_token_reserves, arg3), @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b);
        };
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(v4, v0);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v5, v0);
        let v6 = PoolCompletedEvent{
            token_address : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            lp            : 0x1::ascii::string(b"0x0"), 
            ts            : 0x2::clock::timestamp_ms(arg2),
        };
        0x2::event::emit<PoolCompletedEvent>(v6);
    }
    
    public fun estimate_amount_out<T0>(arg0: &mut Configuration, arg1: u64, arg2: u64) : (u64, u64) {
        let v0 = 0x1::type_name::get<T0>();
        let v1 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v0));
        if (arg1 > 0 && arg2 == 0) {
            (0, pump_island::curves::calculate_token_amount_received(v1.virtual_sui_reserves, v1.virtual_token_reserves, arg1 - pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(arg1), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)))))
        } else {
            let (v4, v5) = if (arg1 == 0 && arg2 > 0) {
                let v6 = pump_island::curves::calculate_remove_liquidity_return(v1.virtual_token_reserves, v1.virtual_sui_reserves, arg2);
                (v6 - pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v6), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000))), 0)
            } else {
                (0, 0)
            };
            (v4, v5)
        }
    }
    
    fun init(arg0: &mut 0x2::tx_context::TxContext) {
        let v0 = Configuration{
            id                             : 0x2::object::new(arg0), 
            version                        : 13, 
            admin                          : @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 
            platform_fee                   : 50, 
            graduated_fee                  : 150000000000, 
            initial_virtual_sui_reserves   : 500000000000, 
            initial_virtual_token_reserves : 10000000000000000, 
            remain_token_reserves          : 2000000000000000, 
            token_decimals                 : 6,
        };
        0x2::transfer::public_share_object<Configuration>(v0);
    }
    
    public entry fun migrate_version(arg0: &mut Configuration, arg1: u64, arg2: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg2);
        assert!(arg0.admin == v0 || v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        arg0.version = arg1;
    }
    
    public entry fun sell<T0>(arg0: &mut Configuration, arg1: 0x2::coin::Coin<T0>, arg2: u64, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg4);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1));
        assert_version(arg0.version);
        assert!(!v2.is_completed, 5);
        let v3 = 0x2::coin::value<T0>(&arg1);
        assert!(v3 > 0, 2);
        let v4 = pump_island::curves::calculate_remove_liquidity_return(v2.virtual_token_reserves, v2.virtual_sui_reserves, v3);
        let v5 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v4), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v4 - v5 >= arg2, 2);
        let (v6, v7) = swap<T0>(v2, arg1, 0x2::coin::zero<0x2::sui::SUI>(arg4), 0, v4, arg4);
        let mut v8 = v7;
        v2.virtual_sui_reserves = v2.virtual_sui_reserves - 0x2::coin::value<0x2::sui::SUI>(&v8);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut v8, v5, arg4), arg0.admin);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(v8, v0);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v6, v0);
        let v9 = TradedEvent{
            is_buy                 : false, 
            user                   : v0, 
            token_address          : 0x1::type_name::into_string(v1), 
            sui_amount             : v4, 
            token_amount           : v3, 
            virtual_sui_reserves   : v2.virtual_sui_reserves, 
            virtual_token_reserves : v2.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v2), 
            ts                     : 0x2::clock::timestamp_ms(arg3),
        };
        0x2::event::emit<TradedEvent>(v9);
    }
    
    public fun sell_returns<T0>(arg0: &mut Configuration, arg1: 0x2::coin::Coin<T0>, arg2: u64, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) : (0x2::coin::Coin<0x2::sui::SUI>, 0x2::coin::Coin<T0>) {
        let v0 = 0x1::type_name::get<T0>();
        let v1 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v0));
        assert!(!v1.is_completed, 5);
        assert_version(arg0.version);
        let v2 = 0x2::coin::value<T0>(&arg1);
        assert!(v2 > 0, 2);
        let v3 = pump_island::curves::calculate_remove_liquidity_return(v1.virtual_token_reserves, v1.virtual_sui_reserves, v2);
        let v4 = pump_island::utils::as_u64(pump_island::utils::div(pump_island::utils::mul(pump_island::utils::from_u64(v3), pump_island::utils::from_u64(arg0.platform_fee)), pump_island::utils::from_u64(10000)));
        assert!(v3 - v4 >= arg2, 2);
        let (v5, v6) = swap<T0>(v1, arg1, 0x2::coin::zero<0x2::sui::SUI>(arg4), 0, v3, arg4);
        let mut v7 = v6;
        v1.virtual_sui_reserves = v1.virtual_sui_reserves - 0x2::coin::value<0x2::sui::SUI>(&v7);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut v7, v4, arg4), arg0.admin);
        let v8 = TradedEvent{
            is_buy                 : false, 
            user                   : 0x2::tx_context::sender(arg4), 
            token_address          : 0x1::type_name::into_string(v0), 
            sui_amount             : v3, 
            token_amount           : v2, 
            virtual_sui_reserves   : v1.virtual_sui_reserves, 
            virtual_token_reserves : v1.virtual_token_reserves, 
            pool_id                : 0x2::object::id<Pool<T0>>(v1), 
            ts                     : 0x2::clock::timestamp_ms(arg3),
        };
        0x2::event::emit<TradedEvent>(v8);
        (v7, v5)
    }
    
    public fun skim<T0>(arg0: &mut Configuration, arg1: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg1);
        assert!(v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        let v1 = 0x1::type_name::get<T0>();
        let v2 = 0x2::dynamic_object_field::borrow_mut<0x1::ascii::String, Pool<T0>>(&mut arg0.id, 0x1::type_name::get_address(&v1));
        assert!(v2.is_completed, 5);
        let value = 0x2::coin::value<0x2::sui::SUI>(&v2.real_sui_reserves);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut v2.real_sui_reserves, value, arg1), v0);
        let value1 = 0x2::coin::value<T0>(&v2.real_token_reserves);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(0x2::coin::split<T0>(&mut v2.real_token_reserves, value1, arg1), v0);
    }
    
    public entry fun transfer_admin(arg0: &mut Configuration, arg1: address, arg2: &0x2::clock::Clock, arg3: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg3);
        assert!(arg0.admin == v0 || v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        arg0.admin = arg1;
        let v1 = OwnershipTransferredEvent{
            old_admin : v0, 
            new_admin : arg1, 
            ts        : 0x2::clock::timestamp_ms(arg2),
        };
        0x2::event::emit<OwnershipTransferredEvent>(v1);
    }
    
    fun transfer_pool<T0>(arg0: &mut Pool<T0>, arg1: &0x2::clock::Clock, arg2: &mut 0x2::tx_context::TxContext) {
        arg0.is_completed = true;
        let value = 0x2::coin::value<T0>(&arg0.real_token_reserves);
        let mut v0 = 0x2::coin::split<T0>(&mut arg0.real_token_reserves, value, arg2);
        let value1 = 0x2::coin::value<T0>(&arg0.remain_token_reserves);
        0x2::coin::join<T0>(&mut v0, 0x2::coin::split<T0>(&mut arg0.remain_token_reserves, value1, arg2));
        let value2 = 0x2::coin::value<0x2::sui::SUI>(&arg0.real_sui_reserves);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(0x2::coin::split<0x2::sui::SUI>(&mut arg0.real_sui_reserves, value2, arg2), @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b);
        0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v0, @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b);
        let v1 = PoolCompletedEvent{
            token_address : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            lp            : 0x1::ascii::string(b"0x0"), 
            ts            : 0x2::clock::timestamp_ms(arg1),
        };
        0x2::event::emit<PoolCompletedEvent>(v1);
    }
    
    public entry fun update_config(arg0: &mut Configuration, arg1: u64, arg2: u64, arg3: u64, arg4: u64, arg5: u64, arg6: u8, arg7: &0x2::clock::Clock, arg8: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg8);
        assert!(arg0.admin == v0 || v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        arg0.platform_fee = arg1;
        arg0.graduated_fee = arg2;
        arg0.initial_virtual_sui_reserves = arg3;
        arg0.initial_virtual_token_reserves = arg4;
        arg0.remain_token_reserves = arg5;
        arg0.token_decimals = arg6;
        let v1 = ConfigChangedEvent{
            old_platform_fee                   : arg0.platform_fee, 
            new_platform_fee                   : arg1, 
            old_graduated_fee                  : arg0.graduated_fee, 
            new_graduated_fee                  : arg2, 
            old_initial_virtual_sui_reserves   : arg0.initial_virtual_sui_reserves, 
            new_initial_virtual_sui_reserves   : arg3, 
            old_initial_virtual_token_reserves : arg0.initial_virtual_token_reserves, 
            new_initial_virtual_token_reserves : arg4, 
            old_remain_token_reserves          : arg0.remain_token_reserves, 
            new_remain_token_reserves          : arg5, 
            old_token_decimals                 : arg0.token_decimals, 
            new_token_decimals                 : arg6, 
            ts                                 : 0x2::clock::timestamp_ms(arg7),
        };
        0x2::event::emit<ConfigChangedEvent>(v1);
    }
    
    public entry fun update_threshold_config(arg0: &mut ThresholdConfig, arg1: u64, arg2: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::tx_context::sender(arg2) == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        arg0.threshold = arg1;
    }
}

