// Player 클래스 - 플레이어 캐릭터 관련 로직
class Player {
    constructor() {
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.gold = 0;
        this.hp = 100;
        this.maxHp = 100;
        this.baseAttack = 10;
        this.baseDefense = 5;
        this.equipment = {
            lightsaber: null,
            laser: null,
            helmet: null,
            shoulder: null,
            chest: null,
            legs: null,
            boots: null,
            earring: null,
            necklace: null,
            ring: null
        };
        this.playTime = 0;
        
        // 마나 시스템
        this.maxMp = 100;
        this.mp = 100;
        
        // 방어막 시스템
        this.shield = 0;
        this.maxShield = 0;
        
        // 캐릭터 정보
        this.character = {
            nickname: '',
            color: {
                body: '#4a90e2',
                helmet: '#357abd',
                equipment: '#666666'
            }
        };
        
        // 무기 선택 시스템
        this.selectedWeaponType = null; // 'melee' 또는 'ranged' - 처음에는 선택 안됨
    }

    getTotalPower() {
        let power = this.level * 10 + this.baseAttack;
        Object.values(this.equipment).forEach(item => {
            if (item) power += item.power;
        });
        return power;
    }
    
    // 선택된 무기 타입에 따른 공격력 계산
    getWeaponPower() {
        let basePower = this.getTotalPower();
        
        if (this.selectedWeaponType === 'melee') {
            // 근접무기: 기본 공격력 + 30% 보너스
            const meleeWeapon = this.equipment.lightsaber;
            if (meleeWeapon) {
                return basePower + Math.floor(meleeWeapon.power * 0.3);
            }
            return basePower;
        } else if (this.selectedWeaponType === 'ranged') {
            // 원거리무기: 기본 공격력 - 20% 감소 (명중률/치명타로 보상)
            const rangedWeapon = this.equipment.laser;
            if (rangedWeapon) {
                return Math.floor(basePower * 0.8);
            }
            return basePower;
        }
        
        return basePower;
    }
    
    getTotalDefense() {
        let defense = this.baseDefense;
        Object.values(this.equipment).forEach(item => {
            if (item) defense += item.defense;
        });
        return defense;
    }

    gainExperience(exp) {
        this.experience += exp;
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }

    levelUp() {
        this.experience -= this.experienceToNext;
        this.level++;
        
        // 개선된 경험치 요구량 계산 (기하급수적 증가를 완화)
        const baseExp = 100;
        const levelMultiplier = 1.15; // 1.2에서 1.15로 감소 (더 완만한 증가)
        this.experienceToNext = Math.floor(baseExp * Math.pow(levelMultiplier, this.level - 1));
        
        // 레벨업 시 스탯 증가량 개선
        const hpIncrease = 20 + Math.floor(this.level * 0.5); // 레벨이 높을수록 조금 더 증가
        const mpIncrease = 10 + Math.floor(this.level * 0.3);
        const attackIncrease = 2 + Math.floor(this.level * 0.1);
        const defenseIncrease = 1 + Math.floor(this.level * 0.05);
        
        this.maxHp += hpIncrease;
        this.hp = this.maxHp; // HP를 최대로 회복
        this.maxMp += mpIncrease;
        this.mp = this.maxMp; // MP도 최대로 회복
        this.baseAttack += attackIncrease;
        this.baseDefense += defenseIncrease;
        
        // 레벨업 시 게임 시스템에 알림 (퀘스트 업데이트를 위해)
        if (typeof game !== 'undefined' && game.updateQuest) {
            game.updateQuest('level', this.level);
        }
        
        // 레벨업 알림 표시 (showNotification은 ui.js에서 정의)
        if (typeof showNotification === 'function') {
            showNotification(`Level Up! HP & MP fully restored! (Level ${this.level})`, 'success');
        }
    }

    equipItem(item, slot) {
        if (this.equipment[slot] !== undefined) {
            this.equipment[slot] = item;
            return true;
        }
        return false;
    }
    
    // MP 소모
    useMp(amount) {
        if (this.mp >= amount) {
            this.mp -= amount;
            return true;
        }
        return false;
    }
    
    // MP 회복
    recoverMp(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
    }
    
    // 방어막 적용
    addShield(amount) {
        this.maxShield = Math.floor(this.maxHp * 0.1); // 최대 HP의 10%
        this.shield = Math.min(this.maxShield, this.shield + amount);
    }
    
    // 방어막으로 데미지 흡수
    absorbDamageWithShield(damage) {
        if (this.shield > 0) {
            const absorbed = Math.min(this.shield, damage);
            this.shield -= absorbed;
            return damage - absorbed; // 남은 데미지 반환
        }
        return damage;
    }
} 