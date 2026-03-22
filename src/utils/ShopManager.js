const INITIAL_ITEMS = [
    {
        id: 'thief_kit',
        name: '🥷 Thief Kit',
        description: 'Increases your chance of a successful robbery by 15%.',
        price: 2500,
        type: 'consumable'
    },
    {
        id: 'lucky_charm',
        name: '🍀 Lucky Charm',
        description: 'Grants a slight bonus to slot machine payouts.',
        price: 5000,
        type: 'passive'
    },
    {
        id: 'vip_badge',
        name: '💎 VIP Badge',
        description: 'A flex item to show off your wealth on your profile.',
        price: 15000,
        type: 'flex'
    },
    {
        id: 'bank_upgrade',
        name: '🏦 Bank Expansion',
        description: 'Instantly permanently increases your bank capacity by 5,000 Credits.',
        price: 7500,
        type: 'instant'
    },
    {
        id: 'xp_booster',
        name: '⚡ XP Booster',
        description: 'Doubles your XP gain for the next 50 messages.',
        price: 4000,
        type: 'consumable'
    },
    {
        id: 'shield_module',
        name: '🛡️ Shield Module',
        description: 'Protects you from robbery attempts for 24 hours.',
        price: 6000,
        type: 'consumable'
    },
    {
        id: 'name_color',
        name: '🎨 Chromatic Tag',
        description: 'A cosmetic tag that appears on your profile (flex item).',
        price: 10000,
        type: 'flex'
    },
    {
        id: 'crate_key',
        name: '🔑 Crate Key',
        description: 'Opens a mystery crate for a random credit reward (500–5000 CR).',
        price: 3000,
        type: 'instant'
    }
];

class ShopManager {
    constructor() {
        this.items = INITIAL_ITEMS;
    }

    getAllItems() {
        return this.items;
    }

    getItem(id) {
        return this.items.find(i => i.id === id);
    }
}

module.exports = new ShopManager();
