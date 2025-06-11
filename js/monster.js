// Monster 클래스 - 몬스터 관련 로직
class Monster {
    constructor(name, level, stage) {
        this.name = name;
        this.level = level;
        this.stage = stage;
        
        // 개선된 스탯 계산 (레벨과 스테이지 고려)
        const stageBonus = Math.floor(stage * 0.3); // 스테이지 보너스
        this.maxHp = Math.floor(level * 75 + stageBonus * 25 + 120); // 기본 120 + 레벨당 75 + 스테이지당 7.5
        this.hp = this.maxHp;
        this.attack = Math.floor(level * 7 + stageBonus * 3 + 18); // 기본 18 + 레벨당 7 + 스테이지당 0.9
        this.defense = Math.floor(level * 2 + stageBonus * 1 + 8); // 기본 8 + 레벨당 2 + 스테이지당 0.3
        this.gold = Math.floor(level * 4 + stageBonus * 2 + Math.floor(Math.random() * 12) + 8); // 향상된 골드 보상
        this.experience = Math.floor(level * 3 + stageBonus * 1 + 8); // 향상된 경험치
        
        this.positionX = 0.8;
        this.positionY = 0.5;
        this.isDead = false;
        this.deathTimer = 0;
        this.deathAnimationDuration = 1000; // 1초
        
        // 이동 관련 속성 추가
        this.originalPositionX = this.positionX;
        this.originalPositionY = this.positionY;
        this.moveSpeed = 0.0008; // 조금 더 빠르게 이동
        this.targetPlayerX = 0.5; // 플레이어 새로운 중앙 위치
        this.targetPlayerY = 0.5;
        
        // 애니메이션 및 이펙트
        this.hitEffect = false;
        this.hitEffectTimer = 0;
        this.lastAttackTime = Date.now() - Math.floor(Math.random() * 2500); // 랜덤 시작 시간으로 분산
        this.attackCooldown = 2500 + Math.floor(Math.random() * 1000); // 2.5~3.5초 사이 랜덤 쿨다운
        
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
        // 플레이어쪽으로 천천히 이동
        this.moveTowardsPlayer();
        
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
    
    moveTowardsPlayer() {
        if (this.isDead || this.knockbackEffect) return;
        
        // 게임 객체에서 플레이어 위치 가져오기
        if (window.game && window.game.playerPosition) {
            this.targetPlayerX = window.game.playerPosition.x;
            this.targetPlayerY = window.game.playerPosition.y;
        }
        
        // 공격 타입에 따른 다른 행동 패턴
        if (this.attackType === 'melee') {
            // 근접 몬스터: 플레이어에게 매우 가깝게 접근 (공격을 위해)
            const minDistance = 0.15; // 근접 공격을 위해 더 가깝게
            const dx = this.targetPlayerX - this.positionX;
            const dy = this.targetPlayerY - this.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > minDistance) {
                // 더 빠르게 접근
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX += normalizedDx * this.moveSpeed * 1.8;
                this.positionY += normalizedDy * this.moveSpeed * 1.8;
            }
        } else {
            // 원거리 몬스터: 플레이어에게 접근하되 적당한 거리 유지 (원거리 공격을 위해)
            const optimalDistance = 0.25; // 원거리 공격에 적합한 거리
            const maxDistance = 0.4; // 너무 멀면 접근
            const dx = this.targetPlayerX - this.positionX;
            const dy = this.targetPlayerY - this.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > maxDistance) {
                // 너무 멀면 접근
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX += normalizedDx * this.moveSpeed;
                this.positionY += normalizedDy * this.moveSpeed;
            } else if (distance < optimalDistance) {
                // 너무 가까우면 약간 뒤로
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX -= normalizedDx * this.moveSpeed * 0.5;
                this.positionY -= normalizedDy * this.moveSpeed * 0.5;
            }
            // 적당한 거리면 이동하지 않음
        }
        
        // 화면 경계 제한
        this.positionX = Math.max(0.05, Math.min(0.95, this.positionX));
        this.positionY = Math.max(0.05, Math.min(0.95, this.positionY));
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
        
        // 보스는 훨씬 강력한 스탯 (Monster 클래스 기본 스탯에 추가 보너스)
        const stageBonusMultiplier = 1 + Math.floor(stage / 50) * 0.2; // 50스테이지마다 20% 증가
        
        this.maxHp = Math.floor(this.maxHp * 6 + level * 400 + stage * 20); // 기본 몬스터의 6배 + 추가 보너스
        this.hp = this.maxHp;
        this.attack = Math.floor(this.attack * 3 + level * 20 + stage * 5); // 기본 몬스터의 3배 + 추가 보너스
        this.defense = Math.floor(this.defense * 4 + level * 8 + stage * 2); // 기본 몬스터의 4배 + 추가 보너스
        this.gold = Math.floor(level * 40 + stage * 15 + 150); // 훨씬 많은 골드 보상
        this.experience = Math.floor(level * 25 + stage * 8 + 120); // 훨씬 많은 경험치
        
        // 스테이지 보너스 적용
        this.maxHp = Math.floor(this.maxHp * stageBonusMultiplier);
        this.attack = Math.floor(this.attack * stageBonusMultiplier);
        this.defense = Math.floor(this.defense * stageBonusMultiplier);
        this.hp = this.maxHp; // HP 재설정
        
        this.positionX = 0.65;
        this.positionY = 0.5;
        this.attackCooldown = 3000 + Math.floor(Math.random() * 2000); // 3~5초 사이 랜덤 쿨다운
        this.lastAttackTime = Date.now() - Math.floor(Math.random() * 3000); // 랜덤 시작 시간으로 분산
        
        // 보스도 이동 속도 조정
        this.moveSpeed = 0.0005; // 보스는 조금 더 천천히 이동
    }
} 