module pump_island::boost_payement {
    use pop_coin::pop::POP;

    public struct Config has store, key {
        id: 0x2::object::UID,
        setter: address,
        pay_to: address,
        boost_option: 0x2::vec_map::VecMap<u64, BoostOption>,
    }
    
    public struct ManageConfig has store, key {
        id: 0x2::object::UID,
        pay_to: address,
        fee: u64,
        is_live: bool,
    }
    
    public struct BoostOption has copy, drop, store {
        index: u64,
        duration: u64,
        boost: u64,
        amount_sui: u64,
        amount_pop: u64,
    }
    
    public struct PaymentEvent has copy, drop, store {
        user: address,
        coin_type: 0x1::ascii::String,
        start_time: u64,
        end_time: u64,
        boost: u64,
        amount_sui: u64,
    }
    
    public struct MessageEvent has copy, drop, store {
        user: address,
        message: 0x1::ascii::String,
        start_time: u64,
    }
    
    public struct MessageEventV2 has copy, drop, store {
        user: address,
        coin_type: 0x1::ascii::String,
        message: 0x1::ascii::String,
        start_time: u64,
    }
    
    public struct MessageEventV3 has copy, drop, store {
        user: address,
        coin_type: 0x1::ascii::String,
        message: 0x1::ascii::String,
        start_time: u64,
        image_url: 0x1::ascii::String,
    }
    
    public struct UpdateTokenProfileEvent has copy, drop, store {
        user: address,
        coin_type: 0x1::ascii::String,
        web_site: 0x1::ascii::String,
        twitter: 0x1::ascii::String,
        telegram: 0x1::ascii::String,
        description: 0x1::ascii::String,
        logo_image: 0x1::ascii::String,
    }
    
    public entry fun create_mange_config(arg0: address, arg1: u64, arg2: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::tx_context::sender(arg2) == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        let v0 = ManageConfig{
            id      : 0x2::object::new(arg2), 
            pay_to  : arg0, 
            fee     : arg1, 
            is_live : true,
        };
        0x2::transfer::public_share_object<ManageConfig>(v0);
    }
    
    fun init(arg0: &mut 0x2::tx_context::TxContext) {
        let mut v0 = 0x2::vec_map::empty<u64, BoostOption>();
        let v1 = BoostOption{
            index      : 0, 
            duration   : 86400, 
            boost      : 10, 
            amount_sui : 1799000000,
            amount_pop : 406000000000,
        };
        0x2::vec_map::insert<u64, BoostOption>(&mut v0, 0, v1);
        let v2 = BoostOption{
            index      : 1, 
            duration   : 86400, 
            boost      : 30, 
            amount_sui : 4490000000,
            amount_pop : 1015000000000,
        };
        0x2::vec_map::insert<u64, BoostOption>(&mut v0, 1, v2);
        let v3 = BoostOption{
            index      : 2, 
            duration   : 86400, 
            boost      : 50, 
            amount_sui : 7190000000,
            amount_pop : 1982160000000,
        };
        0x2::vec_map::insert<u64, BoostOption>(&mut v0, 2, v3);
        let v4 = BoostOption{
            index      : 3, 
            duration   : 86400, 
            boost      : 100, 
            amount_sui : 13490000000,
            amount_pop : 3900000000000,
        };
        0x2::vec_map::insert<u64, BoostOption>(&mut v0, 3, v4);
        let v5 = BoostOption{
            index      : 4, 
            duration   : 86400, 
            boost      : 500, 
            amount_sui : 64790000000,
            amount_pop : 18900000000000,
        };
        0x2::vec_map::insert<u64, BoostOption>(&mut v0, 4, v5);
        let v6 = Config{
            id           : 0x2::object::new(arg0), 
            setter       : @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 
            pay_to       : @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 
            boost_option : v0,
        };
        0x2::transfer::public_share_object<Config>(v6);
    }
    
    public entry fun pay<T0>(arg0: &mut Config, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: u64, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::vec_map::get<u64, BoostOption>(&arg0.boost_option, &arg2);
        assert!(v0.amount_sui <= 0x2::coin::value<0x2::sui::SUI>(&arg1), 3);
        let v1 = 0x2::clock::timestamp_ms(arg3) / 1000;
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(arg1, arg0.pay_to);
        let v2 = PaymentEvent{
            user       : 0x2::tx_context::sender(arg4), 
            coin_type  : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            start_time : v1, 
            end_time   : v1 + v0.duration, 
            boost      : v0.boost, 
            amount_sui : v0.amount_sui,
        };
        0x2::event::emit<PaymentEvent>(v2);
    }

    public entry fun pay_with_pop<T0>(arg0: &mut Config, arg1: 0x2::coin::Coin<POP>, arg2: u64, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::vec_map::get<u64, BoostOption>(&arg0.boost_option, &arg2);
        assert!(v0.amount_sui <= 0x2::coin::value<POP>(&arg1), 3);
        let v1 = 0x2::clock::timestamp_ms(arg3) / 1000;
        0x2::transfer::public_transfer<0x2::coin::Coin<POP>>(arg1, arg0.pay_to);
        let v2 = PaymentEvent{
            user       : 0x2::tx_context::sender(arg4), 
            coin_type  : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            start_time : v1, 
            end_time   : v1 + v0.duration, 
            boost      : v0.boost, 
            amount_sui : v0.amount_sui,
        };
        0x2::event::emit<PaymentEvent>(v2);
    }
    
    public entry fun replace_boost_options(arg0: &mut Config, arg1: vector<u64>, arg2: vector<u64>, arg3: vector<u64>, arg4: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg4);
        assert!(v0 == arg0.setter || v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        assert!(0x1::vector::length<u64>(&arg1) == 0x1::vector::length<u64>(&arg2) && 0x1::vector::length<u64>(&arg2) == 0x1::vector::length<u64>(&arg3), 4);
        while (!0x2::vec_map::is_empty<u64, BoostOption>(&arg0.boost_option)) {
            let (_, _) = 0x2::vec_map::pop<u64, BoostOption>(&mut arg0.boost_option);
        };
        let mut v3 = 0;
        while (v3 < 0x1::vector::length<u64>(&arg2)) {
            let v4 = BoostOption{
                index      : v3, 
                duration   : *0x1::vector::borrow<u64>(&arg1, v3), 
                boost      : *0x1::vector::borrow<u64>(&arg2, v3), 
                amount_sui : *0x1::vector::borrow<u64>(&arg3, v3),
                amount_pop : *0x1::vector::borrow<u64>(&arg3, v3),
            };
            0x2::vec_map::insert<u64, BoostOption>(&mut arg0.boost_option, v3, v4);
            v3 = v3 + 1;
        };
    }
    
    public entry fun send_message(arg0: &mut Config, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: 0x1::ascii::String, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::coin::value<0x2::sui::SUI>(&arg1) >= 10000000, 4);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(arg1, arg0.pay_to);
        let v0 = MessageEvent{
            user       : 0x2::tx_context::sender(arg4), 
            message    : arg2, 
            start_time : 0x2::clock::timestamp_ms(arg3) / 1000,
        };
        0x2::event::emit<MessageEvent>(v0);
    }
    
    public entry fun send_message_v2<T0>(arg0: &mut Config, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: 0x1::ascii::String, arg3: &0x2::clock::Clock, arg4: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::coin::value<0x2::sui::SUI>(&arg1) >= 10000000, 4);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(arg1, arg0.pay_to);
        let v0 = MessageEventV2{
            user       : 0x2::tx_context::sender(arg4), 
            coin_type  : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            message    : arg2, 
            start_time : 0x2::clock::timestamp_ms(arg3) / 1000,
        };
        0x2::event::emit<MessageEventV2>(v0);
    }
    
    public entry fun send_message_v3<T0>(arg0: &mut Config, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: 0x1::ascii::String, arg3: 0x1::ascii::String, arg4: &0x2::clock::Clock, arg5: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::coin::value<0x2::sui::SUI>(&arg1) >= 10000000, 4);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(arg1, arg0.pay_to);
        let v0 = MessageEventV3{
            user       : 0x2::tx_context::sender(arg5), 
            coin_type  : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            message    : arg2, 
            start_time : 0x2::clock::timestamp_ms(arg4) / 1000, 
            image_url  : arg3,
        };
        0x2::event::emit<MessageEventV3>(v0);
    }
    
    public entry fun set_pay_to(arg0: &mut Config, arg1: address, arg2: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg2);
        assert!(v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b || v0 == arg0.setter, 1);
        arg0.pay_to = arg1;
    }
    
    public entry fun set_to_setter(arg0: &mut Config, arg1: address, arg2: &mut 0x2::tx_context::TxContext) {
        let v0 = 0x2::tx_context::sender(arg2);
        assert!(v0 == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b || v0 == arg0.setter, 1);
        arg0.setter = arg1;
    }
    
    public entry fun update_manage_config(arg0: &mut ManageConfig, arg1: address, arg2: u64, arg3: bool, arg4: &mut 0x2::tx_context::TxContext) {
        assert!(0x2::tx_context::sender(arg4) == @0x051f95cd060f4bd4841e271b78d2aa3af45afe3493c2ea2057833ee2a1038f9b, 1);
        arg0.is_live = arg3;
        arg0.pay_to = arg1;
        arg0.fee = arg2;
    }
    
    public entry fun update_token_profile<T0>(arg0: &mut ManageConfig, arg1: 0x2::coin::Coin<0x2::sui::SUI>, arg2: 0x1::ascii::String, arg3: 0x1::ascii::String, arg4: 0x1::ascii::String, arg5: 0x1::ascii::String, arg6: 0x1::ascii::String, arg7: &mut 0x2::tx_context::TxContext) {
        assert!(arg0.fee <= 0x2::coin::value<0x2::sui::SUI>(&arg1), 3);
        assert!(arg0.is_live, 2);
        0x2::transfer::public_transfer<0x2::coin::Coin<0x2::sui::SUI>>(arg1, arg0.pay_to);
        let v0 = UpdateTokenProfileEvent{
            user        : 0x2::tx_context::sender(arg7), 
            coin_type   : 0x1::type_name::into_string(0x1::type_name::get<T0>()), 
            web_site    : arg2, 
            twitter     : arg3, 
            telegram    : arg4, 
            description : arg5, 
            logo_image  : arg6,
        };
        0x2::event::emit<UpdateTokenProfileEvent>(v0);
    }
}

