// Monster 클래스 - 몬스터 관련 로직
class Monster {
    constructor(name, level, stage) {
        this.name = name;
        this.level = level;
        this.stage = stage;
        this.maxHp = level * 80 + 100;
        this.hp = this.maxHp;
        this.attack = level * 8 + 15;
        this.gold = level * 5 + Math.floor(Math.random() * 10);
        this.experience = level * 3 + 5;
        this.positionX = 0.8;
        this.positionY = 0.5;
        this.isDead = false;
        this.deathTimer = 0;
        this.deathAnimationDuration = 1000; // 1초
        
        // 애니메이션 및 이펙트
        this.hitEffect = false;
        this.hitEffectTimer = 0;
        this.lastAttackTime = 0;
        this.attackCooldown = 2500; // 2.5초마다 공격
        
        // 넉백 효과
        this.knockbackEffect = null;
    }

    takeDamage(damage) {
        if (this.isDead) return false;
        
        this.hp -= damage;
        this.hitEffect = true;
        this.hitEffectTimer = Date.now();
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.startDeathAnimation();
            return true; // 죽음
        }
        return false;
    }

    startDeathAnimation() {
        this.isDead = true;
        this.deathTimer = Date.now();
        this.deathAnimation = true;
        this.deathTime = Date.now();
    }
    
    updateEffects() {
        // 피격 효과 업데이트
        if (this.hitEffect && Date.now() - this.hitEffectTimer > 200) {
            this.hitEffect = false;
        }
        
        // 넉백 효과 업데이트
        if (this.knockbackEffect) {
            const elapsed = Date.now() - this.knockbackEffect.startTime;
            const progress = Math.min(1, elapsed / this.knockbackEffect.duration);
            
            if (progress < 0.3) {
                // 첫 30%: 뒤로 밀려남
                const pushProgress = progress / 0.3;
                this.positionX = this.knockbackEffect.originalX + 
                    (this.knockbackEffect.pushDistance * pushProgress);
            } else {
                // 나머지 70%: 원래 자리로 복귀
                const returnProgress = (progress - 0.3) / 0.7;
                this.positionX = this.knockbackEffect.originalX + 
                    this.knockbackEffect.pushDistance * (1 - returnProgress);
            }
            
            if (progress >= 1) {
                this.positionX = this.knockbackEffect.originalX;
                this.knockbackEffect = null;
            }
        }
    }

    canAttack() {
        return !this.isDead && Date.now() - this.lastAttackTime >= this.attackCooldown;
    }

    performAttack() {
        if (this.canAttack()) {
            this.lastAttackTime = Date.now();
            return {
                damage: this.attack,
                type: this.attackType || 'melee'
            };
        }
        return { damage: 0, type: 'none' };
    }
}

// Boss 클래스 - Monster를 상속받음
class Boss extends Monster {
    constructor(name, level, stage) {
        super(name, level, stage);
        this.maxHp = level * 500 + 1000; // 보스는 훨씬 강함
        this.hp = this.maxHp;
        this.attack = level * 25 + 50;
        this.gold = level * 50 + 100;
        this.experience = level * 30 + 100;
        this.positionX = 0.65;
        this.positionY = 0.5;
        this.attackCooldown = 3000; // 3초마다 공격 (몬스터보다 느림)
    }
} 