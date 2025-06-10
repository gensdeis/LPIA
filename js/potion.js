// HealthPotion 클래스 - 포션 관련 로직
class HealthPotion {
    constructor(type) {
        this.type = type; // 'small', 'medium', 'large'
        this.name = this.getName();
        this.healAmount = this.getHealAmount();
        this.color = this.getColor();
        this.rarity = this.getRarity();
    }
    
    getName() {
        switch(this.type) {
            case 'small': return 'Small Health Potion';
            case 'medium': return 'Medium Health Potion';
            case 'large': return 'Large Health Potion';
            default: return 'Health Potion';
        }
    }
    
    getHealAmount() {
        switch(this.type) {
            case 'small': return 30;
            case 'medium': return 70;
            case 'large': return 150;
            default: return 30;
        }
    }
    
    getColor() {
        switch(this.type) {
            case 'small': return '#ff6b6b';
            case 'medium': return '#ff9f43';
            case 'large': return '#10ac84';
            default: return '#ff6b6b';
        }
    }
    
    getRarity() {
        switch(this.type) {
            case 'small': return 'common';
            case 'medium': return 'rare';
            case 'large': return 'epic';
            default: return 'common';
        }
    }
} 