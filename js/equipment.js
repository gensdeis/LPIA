// Equipment 클래스 - 장비 관련 로직
class Equipment {
    constructor(name, type, level, power, slot = null) {
        this.name = name;
        this.type = type; // 'weapon', 'armor', 'accessory'
        this.level = level;
        this.power = power;
        this.slot = slot;
        this.rarity = this.calculateRarity();
        this.description = this.generateDescription();
        
        // 방어구 방어력 추가
        this.defense = this.calculateDefense();
        
        // 무기 전용 속성 추가
        this.accuracy = this.calculateAccuracy();
        this.criticalChance = this.calculateCriticalChance();
        this.weaponType = this.getWeaponType();
        
        // 시각적 정보 추가
        this.visual = this.generateVisual();
    }
    
    calculateDefense() {
        // 방어구만 방어력 제공
        const armorSlots = ['helmet', 'shoulder', 'chest', 'legs', 'boots'];
        if (armorSlots.includes(this.slot)) {
            return Math.floor(this.level * 2 + this.power * 0.3);
        }
        return 0;
    }
    
    getWeaponType() {
        if (this.slot === 'lightsaber') return 'melee';
        if (this.slot === 'laser') return 'ranged';
        return 'none';
    }
    
    calculateAccuracy() {
        // 원거리 무기만 명중률 적용
        if (this.slot === 'laser') {
            // 기본 70% + 레벨당 1% + 등급 보너스
            let baseAccuracy = 70;
            let levelBonus = this.level * 1;
            let rarityBonus = 0;
            
            switch(this.rarity) {
                case 'rare': rarityBonus = 5; break;
                case 'epic': rarityBonus = 10; break;
                case 'legendary': rarityBonus = 15; break;
            }
            
            return Math.min(95, baseAccuracy + levelBonus + rarityBonus); // 최대 95%
        }
        return 100; // 근접무기는 100% 명중
    }
    
    calculateCriticalChance() {
        // 원거리 무기만 치명타 확률 적용
        if (this.slot === 'laser') {
            // 기본 5% + 레벨당 0.2% + 등급 보너스
            let baseCritical = 5;
            let levelBonus = this.level * 0.2;
            let rarityBonus = 0;
            
            switch(this.rarity) {
                case 'rare': rarityBonus = 3; break;
                case 'epic': rarityBonus = 6; break;
                case 'legendary': rarityBonus = 10; break;
            }
            
            return Math.min(30, baseCritical + levelBonus + rarityBonus); // 최대 30%
        }
        return 0; // 근접무기는 치명타 없음
    }

    calculateRarity() {
        const rand = Math.random();
        if (rand < 0.05) return 'legendary';
        if (rand < 0.20) return 'epic';
        if (rand < 0.50) return 'rare';
        return 'common';
    }

    generateDescription() {
        const descriptions = {
            lightsaber: "A powerful energy sword that cuts through most materials with ease. The blade is made of pure energy contained within a magnetic field.",
            laser: "An advanced energy weapon that fires concentrated beams of light. High accuracy and rapid firing rate make it ideal for space combat.",
            helmet: "A protective headgear designed for space exploration. Provides oxygen supply and protection from cosmic radiation.",
            shoulder: "Reinforced shoulder guards that provide excellent protection without limiting mobility. Made from advanced composite materials.",
            chest: "A durable chest plate that protects vital organs. Features built-in life support systems and energy distribution networks.",
            legs: "Flexible leg armor that maintains full range of motion while providing solid protection. Includes integrated movement enhancers.",
            boots: "Heavy-duty space boots with magnetic soles for zero-gravity environments. Features advanced shock absorption technology.",
            earring: "A mystical accessory that enhances the wearer's connection to cosmic energy. Provides subtle but significant power boosts.",
            necklace: "An ancient artifact containing concentrated stellar energy. Wearing it grants the bearer enhanced combat capabilities.",
            ring: "A ring forged from rare space metals. Its unique properties amplify the wearer's natural abilities in battle."
        };
        
        return descriptions[this.slot] || "A mysterious piece of equipment from the far reaches of space.";
    }
    
    generateVisual() {
        const visualData = {
            lightsaber: {
                emoji: '??',
                color: ['#00ff00', '#0080ff', '#ff4040', '#ff8000', '#8000ff'][Math.floor(Math.random() * 5)],
                effect: 'glow'
            },
            laser: {
                emoji: '?',
                color: ['#ff0000', '#00ff00', '#0080ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                effect: 'energy'
            },
            helmet: {
                emoji: ['??', '?', '?', '?', '?'][Math.floor(Math.random() * 5)],
                color: ['#c0c0c0', '#ffd700', '#ff4500', '#4169e1', '#800080'][Math.floor(Math.random() * 5)],
                effect: 'metallic'
            },
            shoulder: {
                emoji: ['??', '?', '?', '?', '?'][Math.floor(Math.random() * 5)],
                color: ['#c0c0c0', '#8b4513', '#2f4f4f', '#4169e1', '#dc143c'][Math.floor(Math.random() * 5)],
                effect: 'armor'
            },
            chest: {
                emoji: ['?', '?', '?', '?', '?'][Math.floor(Math.random() * 5)],
                color: ['#4169e1', '#2f4f4f', '#8b4513', '#556b2f', '#483d8b'][Math.floor(Math.random() * 5)],
                effect: 'fabric'
            },
            legs: {
                emoji: ['?', '?', '?', '?', '??'][Math.floor(Math.random() * 5)],
                color: ['#2f4f4f', '#8b4513', '#556b2f', '#483d8b', '#708090'][Math.floor(Math.random() * 5)],
                effect: 'cloth'
            },
            boots: {
                emoji: ['?', '?', '?', '?', '?'][Math.floor(Math.random() * 5)],
                color: ['#8b4513', '#2f4f4f', '#000000', '#696969', '#a0522d'][Math.floor(Math.random() * 5)],
                effect: 'leather'
            },
            earring: {
                emoji: ['?', '?', '?', '?', '??'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#ff69b4', '#00ced1', '#9370db', '#ff6347'][Math.floor(Math.random() * 5)],
                effect: 'sparkle'
            },
            necklace: {
                emoji: ['?', '?', '?', '??', '?'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#c0c0c0', '#87ceeb', '#dda0dd', '#f0e68c'][Math.floor(Math.random() * 5)],
                effect: 'shine'
            },
            ring: {
                emoji: ['?', '?', '?', '?', '?'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#ff69b4', '#00ced1', '#9370db', '#ff6347'][Math.floor(Math.random() * 5)],
                effect: 'magical'
            }
        };
        
        return visualData[this.slot] || { emoji: '?', color: '#808080', effect: 'none' };
    }
} 