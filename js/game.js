
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
                emoji: '⚔️',
                color: ['#00ff00', '#0080ff', '#ff4040', '#ff8000', '#8000ff'][Math.floor(Math.random() * 5)],
                effect: 'glow'
            },
            laser: {
                emoji: '🔫',
                color: ['#ff0000', '#00ff00', '#0080ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                effect: 'energy'
            },
            helmet: {
                emoji: ['⛑️', '🎩', '👑', '🥽', '🎭'][Math.floor(Math.random() * 5)],
                color: ['#c0c0c0', '#ffd700', '#ff4500', '#4169e1', '#800080'][Math.floor(Math.random() * 5)],
                effect: 'metallic'
            },
            shoulder: {
                emoji: ['🛡️', '🎯', '🔰', '⚡', '🌟'][Math.floor(Math.random() * 5)],
                color: ['#c0c0c0', '#8b4513', '#2f4f4f', '#4169e1', '#dc143c'][Math.floor(Math.random() * 5)],
                effect: 'armor'
            },
            chest: {
                emoji: ['👕', '🥼', '🦺', '🎽', '👔'][Math.floor(Math.random() * 5)],
                color: ['#4169e1', '#2f4f4f', '#8b4513', '#556b2f', '#483d8b'][Math.floor(Math.random() * 5)],
                effect: 'fabric'
            },
            legs: {
                emoji: ['👖', '🩳', '👘', '🦵', '🛡️'][Math.floor(Math.random() * 5)],
                color: ['#2f4f4f', '#8b4513', '#556b2f', '#483d8b', '#708090'][Math.floor(Math.random() * 5)],
                effect: 'cloth'
            },
            boots: {
                emoji: ['👢', '👞', '🥾', '👠', '🩰'][Math.floor(Math.random() * 5)],
                color: ['#8b4513', '#2f4f4f', '#000000', '#696969', '#a0522d'][Math.floor(Math.random() * 5)],
                effect: 'leather'
            },
            earring: {
                emoji: ['👂', '💎', '⭐', '🌙', '☀️'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#ff69b4', '#00ced1', '#9370db', '#ff6347'][Math.floor(Math.random() * 5)],
                effect: 'sparkle'
            },
            necklace: {
                emoji: ['📿', '💎', '🔗', '⛓️', '🌟'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#c0c0c0', '#87ceeb', '#dda0dd', '#f0e68c'][Math.floor(Math.random() * 5)],
                effect: 'shine'
            },
            ring: {
                emoji: ['💍', '⭕', '🔴', '🟡', '🟢'][Math.floor(Math.random() * 5)],
                color: ['#ffd700', '#ff69b4', '#00ced1', '#9370db', '#ff6347'][Math.floor(Math.random() * 5)],
                effect: 'magical'
            }
        };
        
        return visualData[this.slot] || { emoji: '📦', color: '#808080', effect: 'none' };
    }
}

// 투사체 엔티티
class Projectile {
    constructor(x, y, targetX, targetY, damage, type, speed = 5) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.type = type; // 'laser', 'fireball', 'energy'
        this.speed = speed;
        this.active = true;
        this.createdTime = Date.now();
        
        // 방향 계산
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.velocityX = (dx / distance) * speed;
        this.velocityY = (dy / distance) * speed;
        this.totalDistance = distance;
        this.traveledDistance = 0;
    }
    
    update() {
        if (!this.active) return false;
        
        // 미사일은 특별한 포물선 궤도 처리
        if (this.isMissile && this.flightDuration) {
            const elapsed = Date.now() - this.startTime;
            const progress = Math.min(1, elapsed / this.flightDuration);
            
            if (progress >= 1) {
                this.active = false;
                return true; // 충돌
            }
            
            // 포물선 궤도 계산
            // X축: 시작점에서 목표점까지 선형 이동
            this.x = this.originalStartX + (this.originalTargetX - this.originalStartX) * progress;
            
            // Y축: 포물선 (위로 솟아올랐다가 내려옴)
            const baseY = this.originalStartY + (this.originalTargetY - this.originalStartY) * progress;
            const arcHeight = Math.sin(progress * Math.PI) * this.peakHeight; // 포물선 높이
            this.y = baseY - arcHeight;
            
            return false;
        }
        
        // 일반 투사체 처리
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.traveledDistance += this.speed;
        
        // 목표 지점에 도달했는지 확인 (충돌 반경 고려)
        const distanceToTarget = Math.sqrt(
            Math.pow(this.targetX - this.x, 2) + 
            Math.pow(this.targetY - this.y, 2)
        );
        
        if (distanceToTarget <= 20 || this.traveledDistance >= this.totalDistance * 1.1) {
            this.active = false;
            return true; // 충돌
        }
        
        return false;
    }
}

// 몬스터 엔티티
class Monster {
    constructor(name, level, stage) {
        this.name = name;
        this.level = level;
        this.stage = stage;
        this.maxHp = level * 120 + stage * 25; // HP 약 2.4배 증가
        this.hp = this.maxHp;
        this.attack = level * 5 + stage * 2;
        this.defense = level * 2 + stage;
        this.expReward = level * 10 + stage * 5;
        this.goldReward = level * 5 + stage * 2;
        
        // 몬스터 타입 설정 (50% 확률로 근접/원거리)
        this.attackType = Math.random() < 0.5 ? 'melee' : 'ranged';
        this.lastAttackTime = 0;
        this.attackCooldown = 2000 + Math.random() * 1000; // 2-3초
        
        // 시각적 효과
        this.hitEffect = false;
        this.hitEffectTime = 0;
        this.deathAnimation = false;
        this.deathTime = 0;
        this.scale = 1;
        this.alpha = 1;
        
        // 랜덤 위치 (화면 우측 중앙, 55-75% 범위, 상하 35-65% 범위)
        this.positionX = 0.55 + Math.random() * 0.2; // 55-75%
        this.positionY = 0.35 + Math.random() * 0.3; // 35-65%
    }

    takeDamage(damage) {
        const actualDamage = Math.max(1, damage - this.defense);
        this.hp -= actualDamage;
        
        // 피격 효과
        this.hitEffect = true;
        this.hitEffectTime = Date.now();
        
        if (this.hp <= 0) {
            this.startDeathAnimation();
            return true;
        }
        return false;
    }
    
    startDeathAnimation() {
        this.deathAnimation = true;
        this.deathTime = Date.now();
    }
    
    updateEffects() {
        const currentTime = Date.now();
        
        // 피격 효과 업데이트
        if (this.hitEffect && currentTime - this.hitEffectTime > 200) {
            this.hitEffect = false;
        }
        
        // 사망 애니메이션 업데이트
        if (this.deathAnimation) {
            const elapsed = currentTime - this.deathTime;
            const duration = 500; // 0.5초
            
            if (elapsed < duration) {
                this.scale = 1 - (elapsed / duration) * 0.5; // 크기 축소
                this.alpha = 1 - (elapsed / duration); // 투명해짐
            } else {
                this.scale = 0;
                this.alpha = 0;
            }
        }
    }
    
    canAttack() {
        const currentTime = Date.now();
        return currentTime - this.lastAttackTime > this.attackCooldown;
    }
    
    performAttack() {
        this.lastAttackTime = Date.now();
        return {
            damage: this.attack + Math.floor(Math.random() * 5),
            type: this.attackType
        };
    }
}

// 보스 엔티티
class Boss extends Monster {
    constructor(name, level, stage) {
        super(name, level, stage);
        this.maxHp *= 5;
        this.hp = this.maxHp;
        this.attack *= 2;
        this.defense *= 2;
        this.expReward *= 5;
        this.goldReward *= 5;
    }
}

// HP 포션 엔티티
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
            case 'small': return 50; // HP의 약 20-30%
            case 'medium': return 150; // HP의 약 50-70%  
            case 'large': return 300; // HP의 100% 이상
            default: return 50;
        }
    }
    
    getColor() {
        switch(this.type) {
            case 'small': return '#90EE90'; // 연한 초록
            case 'medium': return '#32CD32'; // 초록
            case 'large': return '#008000'; // 진한 초록
            default: return '#90EE90';
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

// 퀘스트 엔티티
class Quest {
    constructor(id, description, target, current = 0, reward = {}) {
        this.id = id;
        this.description = description;
        this.target = target;
        this.current = current;
        this.reward = reward;
        this.completed = false;
    }

    updateProgress(amount) {
        this.current = Math.min(this.current + amount, this.target);
        if (this.current >= this.target) {
            this.completed = true;
        }
    }
}

// ==================== 유즈케이스 ====================

class GameUseCase {
    constructor() {
        this.player = new Player();
        this.currentMonster = null;
        this.currentBoss = null;
        this.stage = 1;
        this.quests = [];
        this.planetNames = [
            '작은 행성', '꽃의 행성', '왕의 행성', '사업가의 행성', '가로등의 행성',
            '지리학자의 행성', '뱀의 행성', '장미의 행성', '바오밥의 행성', '우물의 행성'
        ];
        this.monsterNames = [
            '우주 슬라임', '별똥별 박쥐', '소행성 거미', '은하수 늑대', '혜성 드래곤',
            '블랙홀 고블린', '성운 오크', '태양풍 엘프', '중성자별 트롤', '퀘이사 타이탄'
        ];
        
        this.initializeQuests();
        this.spawnMonster();
        this.giveStarterEquipment();
        
        // 투사체 시스템
        this.projectiles = [];
        this.monsterProjectiles = [];
        
        // 공격 쿨다운
        this.lastAttackTime = 0;
        
        // 근접 공격 범위 (픽셀 단위)
        this.meleeRange = 150;
        
        // HP 포션 인벤토리
        this.healthPotions = {
            small: 0,
            medium: 0,
            large: 0
        };
        
        // 근접 공격 이펙트
        this.meleeEffects = [];
        
        // 플레이어 위치 (기본 위치 - 중앙 좌측)
        this.playerPosition = {
            x: 0.35,
            y: 0.5,
            targetX: 0.35,
            targetY: 0.5,
            moveSpeed: 0.002 // 화면 비율 기준 이동 속도
        };
        
        // 자동 포션 사용 설정
        this.autoPotionSettings = {
            enabled: false,
            triggerPercent: 50, // 50% 이하일 때 사용
            priority: ['small', 'medium', 'large'] // 사용 우선순위
        };
        
        // 스테이지 시작 상태 저장 (사망 시 복원용)
        this.stageStartState = null;
        
        // 스킬 시스템
        this.skillSystem = new SkillSystem();
        
        // 스킬 이펙트들
        this.skillEffects = [];
        this.planetDestroyerEffect = null;
        this.shieldEffect = null;
        
        // 히든 스킬 관련
        this.bodySlamAnimation = null;
        
        // MP 자동 회복 시스템
        this.lastMpRecover = Date.now();
        
        // 스테이지 시작 시점의 상태 저장
        this.saveStageStartState();
    }

    // 다음 5레벨 단위 타겟 계산 함수
    calculateNextLevelTarget(currentLevel) {
        const nextTarget = Math.ceil(currentLevel / 5) * 5;
        return nextTarget === currentLevel ? currentLevel + 5 : nextTarget;
    }

    initializeQuests() {
        // 현재 레벨 기준으로 다음 5레벨 단위 타겟 계산
        const levelTarget = this.calculateNextLevelTarget(this.player.level);
        
        const questTemplates = [
            { id: 1, desc: '몬스터 20 마리 처치', target: 20, type: 'kill' },
            { id: 2, desc: '1000 골드 수집', target: 1000, type: 'gold' },
            { id: 3, desc: '경험치 1000 exp 획득', target: 1000, type: 'exp' },
            { id: 4, desc: '장비 10 개 획득', target: 10, type: 'equipment' },
            { id: 5, desc: `${levelTarget} 레벨 달성`, target: levelTarget, type: 'level' }
        ];

        this.quests = questTemplates.map(template => 
            new Quest(template.id, template.desc, template.target, 0, { gold: 100, exp: 50 })
        );

        // 퀘스트 초기화 후 현재 상태 체크
        this.checkQuestStatus();
    }

    // 현재 플레이어 상태에 따른 퀘스트 상태 업데이트
    checkQuestStatus() {
        this.quests.forEach(quest => {
            if (!quest.completed) {
                const oldCurrent = quest.current;
                
                switch(quest.id) {
                    case 1: // 몬스터 처치 퀘스트 (기존 값 유지)
                        // 몬스터 처치는 누적이므로 기존 값 유지
                        break;
                    case 2: // 골드 퀘스트
                        quest.current = Math.min(this.player.gold, quest.target);
                        break;
                    case 3: // 경험치 퀘스트
                        quest.current = Math.min(this.player.experience, quest.target);
                        break;
                    case 4: // 장비 퀘스트
                        quest.current = Math.min(this.getEquippedItemCount(), quest.target);
                        break;
                    case 5: // 레벨 퀘스트
                        quest.current = Math.min(this.player.level, quest.target);
                        break;
                }
                
                if (quest.current >= quest.target) {
                    quest.completed = true;
                }
            }
        });
    }

    // 장착된 장비 개수 계산
    getEquippedItemCount() {
        return Object.values(this.player.equipment).filter(item => item !== null).length;
    }

    giveStarterEquipment() {
        // 시작 장비 지급
        const starterLightsaber = new Equipment('Novice Lightsaber', 'weapon', 1, 15, 'lightsaber');
        const starterLaser = new Equipment('Basic Laser Rifle', 'weapon', 1, 12, 'laser');
        
        this.player.equipItem(starterLightsaber, 'lightsaber');
        this.player.equipItem(starterLaser, 'laser');
        
        // 시작 장비 지급 후 퀘스트 상태 업데이트
        this.updateQuest('equipment', this.getEquippedItemCount());
        this.updateQuest('level', this.player.level);
    }

    spawnMonster() {
        const monsterLevel = Math.max(1, this.stage - Math.floor(Math.random() * 3));
        const monsterName = this.monsterNames[Math.floor(Math.random() * this.monsterNames.length)];
        this.currentMonster = new Monster(monsterName, monsterLevel, this.stage);
    }

    spawnBoss() {
        const bossName = `${this.planetNames[Math.floor(this.stage / 100) % this.planetNames.length]} 보스`;
        this.currentBoss = new Boss(bossName, this.stage, this.stage);
        
        // 보스도 몬스터와 같은 새로운 속성들 추가
        this.currentBoss.attackType = Math.random() < 0.3 ? 'melee' : 'ranged'; // 보스는 원거리가 더 많음
        this.currentBoss.lastAttackTime = 0;
        this.currentBoss.attackCooldown = 3000 + Math.random() * 2000; // 3-5초
        
        // 시각적 효과
        this.currentBoss.hitEffect = false;
        this.currentBoss.hitEffectTime = 0;
        this.currentBoss.deathAnimation = false;
        this.currentBoss.deathTime = 0;
        this.currentBoss.scale = 1;
        this.currentBoss.alpha = 1;
        
        // 보스 전용 메서드 추가
        this.currentBoss.updateEffects = Monster.prototype.updateEffects;
        this.currentBoss.canAttack = Monster.prototype.canAttack;
        this.currentBoss.performAttack = Monster.prototype.performAttack;
        this.currentBoss.startDeathAnimation = Monster.prototype.startDeathAnimation;
        
        // 기존 takeDamage 메서드 확장
        const originalTakeDamage = this.currentBoss.takeDamage.bind(this.currentBoss);
        this.currentBoss.takeDamage = function(damage) {
            const actualDamage = Math.max(1, damage - this.defense);
            this.hp -= actualDamage;
            
            // 피격 효과
            this.hitEffect = true;
            this.hitEffectTime = Date.now();
            
            if (this.hp <= 0) {
                this.startDeathAnimation();
                return true;
            }
            return false;
        };
    }

    attackMonster() {
        if (!this.currentMonster || this.currentMonster.deathAnimation) return false;

        // 플레이어 공격
        this.performPlayerAttack();

        // 몬스터가 살아있으면 반격
        if (this.currentMonster && this.currentMonster.hp > 0 && this.currentMonster.canAttack()) {
            this.performMonsterAttack();
        }

        return false;
    }

    performPlayerAttack() {
        if (!this.currentMonster) return;

        // 선택된 무기 타입에 따른 공격
        if (this.player.selectedWeaponType === 'melee') {
            // 근접 무기 공격 (광선검)
            if (this.player.equipment.lightsaber && this.canUseMeleeAttack(this.currentMonster)) {
                // 근접무기는 높은 데미지 (무기별 공격력 계산 사용)
                const swordDamage = Math.floor(this.player.getWeaponPower() * 0.5) + Math.floor(Math.random() * 10) + 15;
                this.performMeleeAttack(swordDamage, this.currentMonster);
            }
        } else if (this.player.selectedWeaponType === 'ranged') {
            // 원거리 무기 공격 (레이저총)
            if (this.player.equipment.laser) {
                this.performRangedAttack(this.currentMonster);
            }
        }
    }
    
    // 새로운 원거리 공격 함수 (명중률과 치명타 적용)
    performRangedAttack(target) {
        const weapon = this.player.equipment.laser;
        if (!weapon) return;
        
        // 명중률 체크
        const hitChance = Math.random() * 100;
        if (hitChance > weapon.accuracy) {
            // 명중 실패
            showNotification('Miss!', 'info');
            return;
        }
        
        // 기본 데미지 (원거리는 낮은 데미지이지만 무기별 공격력 계산 사용)
        let damage = Math.floor(this.player.getWeaponPower() * 0.35) + Math.floor(Math.random() * 8);
        
        // 치명타 체크
        const critChance = Math.random() * 100;
        let isCritical = false;
        if (critChance <= weapon.criticalChance) {
            damage *= 2; // 치명타 시 2배 데미지
            isCritical = true;
        }
        
        // 투사체 생성
        this.createPlayerProjectile(damage, isCritical);
    }

    createMeleeAttack(damage) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * 0.2 + 20;
        const startY = canvas.height * 0.7;
        
        // 몬스터의 실제 위치로 타깃 설정
        let targetX, targetY;
        if (this.currentBoss) {
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.6;
        } else if (this.currentMonster) {
            targetX = canvas.width * this.currentMonster.positionX;
            targetY = canvas.height * this.currentMonster.positionY;
        } else {
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.7;
        }

        // 광선검은 훨씬 빠른 속도 (근접 공격이므로)
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'lightsaber', 25);
        this.projectiles.push(projectile);
    }

    createPlayerProjectile(damage, isCritical = false) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x + 20;
        const startY = canvas.height * this.playerPosition.y;
        
        // 몬스터의 실제 위치로 타깃 설정
        let targetX, targetY;
        if (this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else if (this.currentMonster) {
            targetX = canvas.width * this.currentMonster.positionX;
            targetY = canvas.height * this.currentMonster.positionY;
        } else {
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.7;
        }

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'laser', 20);
        projectile.isCritical = isCritical; // 치명타 정보 추가
        this.projectiles.push(projectile);
        
        // 치명타 시 특별한 알림
        if (isCritical) {
            showNotification(`Critical Hit! ${damage} damage!`, 'success');
        }
    }

    performMonsterAttack() {
        const attackData = this.currentMonster.performAttack();
        
        if (attackData.type === 'melee') {
            // 근접 공격 - 빠른 근접 투사체
            this.createMonsterMeleeAttack(attackData.damage);
        } else {
            // 원거리 공격 - 투사체 생성
            this.createMonsterProjectile(attackData.damage);
        }
    }

    createMonsterMeleeAttack(damage) {
        const canvas = document.getElementById('gameCanvas');
        
        // 몬스터의 실제 위치에서 발사
        let startX, startY;
        if (this.currentBoss) {
            startX = canvas.width * 0.7;
            startY = canvas.height * 0.6;
        } else if (this.currentMonster) {
            startX = canvas.width * this.currentMonster.positionX;
            startY = canvas.height * this.currentMonster.positionY;
        }
        
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        // 몬스터 근접 공격은 빠른 속도
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'monster_melee', 20);
        this.monsterProjectiles.push(projectile);
    }

    createMonsterProjectile(damage) {
        const canvas = document.getElementById('gameCanvas');
        
        // 몬스터의 실제 위치에서 발사
        let startX, startY;
        if (this.currentBoss) {
            startX = canvas.width * 0.7;
            startY = canvas.height * 0.6;
        } else if (this.currentMonster) {
            startX = canvas.width * this.currentMonster.positionX;
            startY = canvas.height * this.currentMonster.positionY;
        }
        
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'fireball', 10);
        this.monsterProjectiles.push(projectile);
    }

    dealDamageToMonster(damage) {
        if (!this.currentMonster) return;

        const isDead = this.currentMonster.takeDamage(damage);

        if (isDead) {
            // 사망 애니메이션이 끝난 후 몬스터 처리
            setTimeout(() => {
                this.player.gainExperience(this.currentMonster.expReward);
                this.player.gold += this.currentMonster.goldReward;
                
                // 퀘스트 업데이트
                this.updateQuest('kill', 1);
                this.updateQuest('gold', this.currentMonster.goldReward);
                this.updateQuest('exp', this.currentMonster.expReward);

                // 장비 드롭 확률
                if (Math.random() < 0.3) {
                    this.dropEquipment();
                }
                
                // HP 포션 드롭 확률 (15%)
                if (Math.random() < 0.15) {
                    this.dropHealthPotion(false);
                }

                this.spawnMonster();
            }, 500); // 사망 애니메이션 시간과 동일
        }
    }

    dealDamageToPlayer(damage) {
        // 방어력 적용: 데미지의 최대 40%를 백분율 감소, 나머지는 절대값으로 감소
        const playerDefense = this.player.getTotalDefense();
        const percentReduction = Math.min(0.4, playerDefense * 0.008); // 방어력 125당 100% (최대 40%)
        const absoluteReduction = Math.min(damage * 0.6, playerDefense * 0.8); // 방어력의 80%만큼 절대값 감소
        
        let finalDamage = Math.max(1, Math.floor(damage * (1 - percentReduction) - absoluteReduction));
        
        // 방어막으로 데미지 흡수
        finalDamage = this.player.absorbDamageWithShield(finalDamage);
        
        this.player.hp = Math.max(0, this.player.hp - finalDamage);
        
        // 방어 효과는 UI에서만 표시 (토스트 메시지 제거)
        
        // 플레이어 피격 효과
        this.showPlayerHitEffect();
        
        // 플레이어 사망 처리
        if (this.player.hp <= 0) {
            this.handlePlayerDeath();
        }
    }

    showPlayerHitEffect() {
        // 플레이어 피격 시 화면 흔들림 효과
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            gameContainer.style.animation = '';
        }, 300);
    }

    updateProjectiles() {
        // 플레이어 투사체 업데이트
        this.projectiles = this.projectiles.filter(projectile => {
            const hit = projectile.update();
            if (hit) {
                let target = null;
                if (this.currentBoss) {
                    target = this.currentBoss;
                    this.dealDamageToBoss(projectile.damage);
                } else if (this.currentMonster) {
                    target = this.currentMonster;
                    this.dealDamageToMonster(projectile.damage);
                }
                
                // 미사일 스킬 피격 시 특별한 폭발 이펙트
                if (projectile.type === 'missile' && target) {
                    this.createMissileExplosionEffect(target);
                }
                
                return false; // 투사체 제거
            }
            return projectile.active;
        });

        // 몬스터 투사체 업데이트
        this.monsterProjectiles = this.monsterProjectiles.filter(projectile => {
            const hit = projectile.update();
            if (hit) {
                this.dealDamageToPlayer(projectile.damage);
                return false; // 투사체 제거
            }
            return projectile.active;
        });
    }

    attackBoss() {
        if (!this.currentBoss || this.currentBoss.deathAnimation) return false;

        // 플레이어 공격 (보스용)
        this.performPlayerAttackOnBoss();

        // 보스가 살아있으면 반격
        if (this.currentBoss && this.currentBoss.hp > 0 && this.currentBoss.canAttack()) {
            this.performBossAttack();
        }

        return false;
    }

    performPlayerAttackOnBoss() {
        if (!this.currentBoss) return;

        // 선택된 무기 타입에 따른 공격
        if (this.player.selectedWeaponType === 'melee') {
            // 근접 무기 공격 (광선검)
            if (this.player.equipment.lightsaber && this.canUseMeleeAttack(this.currentBoss)) {
                // 근접무기는 높은 데미지 (무기별 공격력 계산 사용)
                const swordDamage = Math.floor(this.player.getWeaponPower() * 0.5) + Math.floor(Math.random() * 10) + 15;
                this.performMeleeAttack(swordDamage, this.currentBoss);
            }
        } else if (this.player.selectedWeaponType === 'ranged') {
            // 원거리 무기 공격 (레이저총)
            if (this.player.equipment.laser) {
                this.performRangedAttackOnBoss(this.currentBoss);
            }
        }
    }
    
    // 보스용 원거리 공격 함수
    performRangedAttackOnBoss(target) {
        const weapon = this.player.equipment.laser;
        if (!weapon) return;
        
        // 명중률 체크
        const hitChance = Math.random() * 100;
        if (hitChance > weapon.accuracy) {
            // 명중 실패
            showNotification('Miss!', 'info');
            return;
        }
        
        // 기본 데미지 (원거리는 낮은 데미지이지만 무기별 공격력 계산 사용)
        let damage = Math.floor(this.player.getWeaponPower() * 0.35) + Math.floor(Math.random() * 8);
        
        // 치명타 체크
        const critChance = Math.random() * 100;
        let isCritical = false;
        if (critChance <= weapon.criticalChance) {
            damage *= 2; // 치명타 시 2배 데미지
            isCritical = true;
        }
        
        // 투사체 생성
        this.createPlayerProjectileForBoss(damage, isCritical);
    }

    createMeleeAttackOnBoss(damage) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * 0.2 + 20;
        const startY = canvas.height * 0.7;
        const targetX = canvas.width * 0.7;
        const targetY = canvas.height * 0.6;

        // 광선검은 훨씬 빠른 속도 (근접 공격이므로)
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'lightsaber', 25);
        this.projectiles.push(projectile);
    }

    createPlayerProjectileForBoss(damage, isCritical = false) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x + 20;
        const startY = canvas.height * this.playerPosition.y;
        const targetX = canvas.width * 0.65;
        const targetY = canvas.height * 0.5;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'laser', 20);
        projectile.isCritical = isCritical; // 치명타 정보 추가
        this.projectiles.push(projectile);
        
        // 치명타 시 특별한 알림
        if (isCritical) {
            showNotification(`Critical Hit! ${damage} damage!`, 'success');
        }
    }

    performBossAttack() {
        const attackData = this.currentBoss.performAttack();
        
        if (attackData.type === 'melee') {
            // 보스 근접 공격 - 강력한 근접 투사체
            this.createBossMeleeAttack(attackData.damage * 1.5);
        } else {
            // 보스 원거리 공격 - 강력한 투사체
            this.createBossProjectile(attackData.damage);
        }
    }

    createBossMeleeAttack(damage) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * 0.7;
        const startY = canvas.height * 0.6;
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        // 보스 근접 공격은 매우 빠른 속도
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'boss_melee', 22);
        this.monsterProjectiles.push(projectile);
    }

    createBossProjectile(damage) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * 0.7;
        const startY = canvas.height * 0.6;
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage * 1.2, 'boss_energy', 10);
        this.monsterProjectiles.push(projectile);
    }

    dealDamageToBoss(damage) {
        if (!this.currentBoss) return;

        const isDead = this.currentBoss.takeDamage(damage);

        if (isDead) {
                            // 보스 사망 애니메이션이 끝난 후 처리
            setTimeout(() => {
                this.player.gainExperience(this.currentBoss.expReward);
                this.player.gold += this.currentBoss.goldReward;
                
                // 보스 클리어 시 다음 스테이지
                this.stage++;
                this.currentBoss = null;
                
                // 새 스테이지 시작 상태 저장
                this.onNewStageStart();
                
                // 퀘스트 완전 초기화 (진행도 0으로 리셋, 레벨 타겟 새로 설정)
                this.resetQuests();
                
                // 보스 장비 드롭 (확률 높음)
                if (Math.random() < 0.8) {
                    this.dropEquipment(true);
                }
                
                // 대형 HP 포션 드롭 확률 (60%)
                if (Math.random() < 0.6) {
                    this.dropHealthPotion(true);
                }
                
                // 보스 클리어 알림
                showNotification(`Boss cleared! Stage ${this.stage}`, 'success');
            }, 500);
        }
    }
    
    // 플레이어와 타겟 간의 거리 계산
    getDistanceToTarget(target) {
        const canvas = document.getElementById('gameCanvas');
        const playerX = canvas.width * this.playerPosition.x;
        const playerY = canvas.height * this.playerPosition.y;
        
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.6;
        } else if (target === this.currentMonster) {
            targetX = canvas.width * this.currentMonster.positionX;
            targetY = canvas.height * this.currentMonster.positionY;
        } else {
            return Infinity;
        }
        
        return Math.sqrt(Math.pow(targetX - playerX, 2) + Math.pow(targetY - playerY, 2));
    }
    
    // 근접 공격 가능 여부 확인
    canUseMeleeAttack(target) {
        return this.getDistanceToTarget(target) <= this.meleeRange;
    }
    
    // 실제 근접 공격 수행 (즉시 데미지 + 이펙트)
    performMeleeAttack(damage, target) {
        // 즉시 데미지 적용
        if (target === this.currentBoss) {
            this.dealDamageToBoss(damage);
        } else if (target === this.currentMonster) {
            this.dealDamageToMonster(damage);
        }
        
        // 근접 공격 이펙트 표시
        this.showMeleeEffect(target);
    }
    
    // 근접 공격 이펙트 표시
    showMeleeEffect(target) {
        const canvas = document.getElementById('gameCanvas');
        let targetX, targetY;
        
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.6;
        } else if (target === this.currentMonster) {
            targetX = canvas.width * this.currentMonster.positionX;
            targetY = canvas.height * this.currentMonster.positionY;
        }
        
        // 광선검 이펙트 생성
        this.meleeEffects.push({
            x: targetX,
            y: targetY,
            startTime: Date.now(),
            duration: 300 // 0.3초
        });
    }
    
    // 플레이어 자동 이동 업데이트
    updatePlayerMovement() {
        let target = this.currentBoss || this.currentMonster;
        if (!target) return;
        
        // 타겟의 위치 계산
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = 0.7;
            targetY = 0.6;
        } else {
            targetX = target.positionX;
            targetY = target.positionY;
        }
        
        // 광선검이 있고 근접 공격이 불가능한 경우 타겟에게 이동
        if (this.player.equipment.lightsaber && !this.canUseMeleeAttack(target)) {
            // 타겟으로부터 근접 공격 범위 내의 위치를 목표로 설정
            const dx = targetX - this.playerPosition.x;
            const dy = targetY - this.playerPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0.15) { // 화면 비율 기준 거리
                // 타겟 방향으로 이동
                this.playerPosition.targetX = targetX - (dx / distance) * 0.12; // 근접 거리 유지
                this.playerPosition.targetY = targetY - (dy / distance) * 0.12;
            }
        } else {
            // 기본 위치로 복귀
            this.playerPosition.targetX = 0.2;
            this.playerPosition.targetY = 0.7;
        }
        
        // 현재 위치에서 목표 위치로 부드럽게 이동
        const moveX = this.playerPosition.targetX - this.playerPosition.x;
        const moveY = this.playerPosition.targetY - this.playerPosition.y;
        
        this.playerPosition.x += moveX * this.playerPosition.moveSpeed * 60; // 60fps 기준
        this.playerPosition.y += moveY * this.playerPosition.moveSpeed * 60;
    }
    
    dropHealthPotion(isBoss = false) {
        let potionType;
        if (isBoss) {
            potionType = 'large'; // 보스는 대형 포션만
        } else {
            // 일반 몬스터는 소형(70%), 중형(30%)
            potionType = Math.random() < 0.7 ? 'small' : 'medium';
        }
        
        const potion = new HealthPotion(potionType);
        this.healthPotions[potionType]++;
        
        const potionName = potion.name;
        showNotification(`${potionName} 획득!`, 'success');
    }
    
    useHealthPotion(type) {
        if (this.healthPotions[type] <= 0) {
            showNotification('포션이 부족합니다!', 'error');
            return false;
        }
        
        const potion = new HealthPotion(type);
        const healAmount = potion.healAmount;
        const currentHp = this.player.hp;
        
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
        this.healthPotions[type]--;
        
        const actualHeal = this.player.hp - currentHp;
        showNotification(`HP ${actualHeal} recovered!`, 'success');
        return true;
    }
    
    // 자동 포션 사용 체크
    checkAutoPotion() {
        if (!this.autoPotionSettings.enabled) return;
        
        const hpPercent = (this.player.hp / this.player.maxHp) * 100;
        if (hpPercent <= this.autoPotionSettings.triggerPercent) {
            // 우선순위에 따라 포션 사용
            for (const potionType of this.autoPotionSettings.priority) {
                if (this.healthPotions[potionType] > 0) {
                    this.useHealthPotion(potionType);
                    break; // 하나만 사용하고 종료
                }
            }
        }
    }

    dropEquipment(isBoss = false) {
        const equipmentTypes = [
            { name: 'Lightsaber', slot: 'lightsaber', type: 'weapon' },
            { name: 'Laser Rifle', slot: 'laser', type: 'weapon' },
            { name: 'Space Helmet', slot: 'helmet', type: 'armor' },
            { name: 'Shoulder Guard', slot: 'shoulder', type: 'armor' },
            { name: 'Chest Plate', slot: 'chest', type: 'armor' },
            { name: 'Leg Armor', slot: 'legs', type: 'armor' },
            { name: 'Space Boots', slot: 'boots', type: 'armor' },
            { name: 'Cosmic Earring', slot: 'earring', type: 'accessory' },
            { name: 'Star Necklace', slot: 'necklace', type: 'accessory' },
            { name: 'Power Ring', slot: 'ring', type: 'accessory' }
        ];

        const randomType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
        const itemLevel = this.stage + (isBoss ? 5 : Math.floor(Math.random() * 3));
        const basePower = itemLevel * 5 + Math.floor(Math.random() * 10);
        
        const newEquipment = new Equipment(randomType.name, randomType.type, itemLevel, basePower, randomType.slot);
        
        // 현재 장비보다 좋으면 자동 장착
        const currentEquipment = this.player.equipment[randomType.slot];
        if (!currentEquipment || newEquipment.power > currentEquipment.power) {
            this.player.equipItem(newEquipment, randomType.slot);
            // 장비 퀘스트는 실제 장착된 장비 개수로 업데이트
            this.updateQuest('equipment', this.getEquippedItemCount());
        }
    }

    updateQuest(type, amount) {
        this.quests.forEach(quest => {
            if (!quest.completed) {
                if (type === 'kill' && quest.id === 1) quest.updateProgress(amount);
                if (type === 'gold' && quest.id === 2) quest.updateProgress(amount);
                if (type === 'exp' && quest.id === 3) quest.updateProgress(amount);
                if (type === 'equipment' && quest.id === 4) {
                    // 장비 퀘스트는 현재 장착된 장비 개수로 직접 설정
                    quest.current = amount;
                    if (quest.current >= quest.target) {
                        quest.completed = true;
                    }
                }
                if (type === 'level' && quest.id === 5) {
                    // 레벨 퀘스트는 현재 레벨로 직접 설정
                    quest.current = this.player.level;
                    if (quest.current >= quest.target) {
                        quest.completed = true;
                    }
                }
            }
        });
    }

    canChallengeBoss() {
        return this.quests.every(quest => quest.completed);
    }

    challengeBoss() {
        if (this.canChallengeBoss()) {
            this.spawnBoss();
            return true;
        }
        return false;
    }

    // 자동 보스 도전 체크
    checkAutoChallengeBoss() {
        if (this.canChallengeBoss() && !this.currentBoss) {
            this.challengeBoss();
            // 보스 도전 알림
            setTimeout(() => {
                showNotification('All quests completed! Challenging the boss!', 'success');
            }, 500);
        }
    }

    resetQuests() {
        // 레벨 퀘스트의 새로운 타겟 계산 (현재 레벨에서 가장 가까운 5의 배수)
        const levelTarget = this.calculateNextLevelTarget(this.player.level);
        
        this.quests.forEach(quest => {
            quest.current = 0;
            quest.completed = false;
            
            // 레벨 퀘스트의 타겟을 동적으로 업데이트
            if (quest.id === 5) { // 레벨 달성 퀘스트
                quest.target = levelTarget;
                quest.description = `Reach level ${levelTarget}`;
            }
        });
        
        // 퀘스트 리셋 후 현재 상태 체크 (레벨, 골드, 경험치, 장비는 유지)
        this.checkQuestStatus();
        
        showNotification(`New quests! Level target: ${levelTarget}`, 'info');
    }

    getCurrentPlanet() {
        return this.planetNames[Math.floor(this.stage / 100) % this.planetNames.length];
    }

    saveGame() {
        const gameData = {
            player: this.player,
            stage: this.stage,
            quests: this.quests,
            selectedWeaponType: this.player.selectedWeaponType,
            timestamp: Date.now()
        };
        localStorage.setItem('littlePrinceIdleGame', JSON.stringify(gameData));
    }

    loadGame() {
        const saved = localStorage.getItem('littlePrinceIdleGame');
        if (saved) {
            const gameData = JSON.parse(saved);
            Object.assign(this.player, gameData.player);
            this.stage = gameData.stage;
            this.quests = gameData.quests.map(q => Object.assign(new Quest(), q));
            
            // 무기 선택 정보 복원 (기본값: 'melee')
            this.player.selectedWeaponType = gameData.selectedWeaponType || 'melee';
            
            // 오프라인 진행 계산
            const offlineTime = Date.now() - gameData.timestamp;
            this.processOfflineProgress(offlineTime);
            
            // 무기 선택 상태 확인 (로드 후)
            setTimeout(() => {
                checkWeaponSelectionState();
            }, 100);
        }
    }

    processOfflineProgress(offlineTime) {
        const hoursOffline = Math.floor(offlineTime / (1000 * 60 * 60));
        if (hoursOffline > 0) {
            const offlineGold = hoursOffline * 10;
            const offlineExp = hoursOffline * 5;
            this.player.gold += offlineGold;
            this.player.gainExperience(offlineExp);
            
            // 오프라인 진행 알림
            if (offlineGold > 0) {
                setTimeout(() => {
                    alert(`오프라인 동안 ${offlineGold} 골드와 ${offlineExp} 경험치를 획득했습니다!`);
                }, 1000);
            }
        }
    }

    // 스테이지 시작 상태 저장
    saveStageStartState() {
        this.stageStartState = {
            stage: this.stage,
            playerHp: this.player.hp,
            playerMaxHp: this.player.maxHp,
            playerLevel: this.player.level,
            playerExperience: this.player.experience,
            playerGold: this.player.gold,
            playerPlayTime: this.player.playTime,
            timestamp: Date.now()
        };
    }
    
    // 플레이어 사망 처리
    handlePlayerDeath() {
        if (!this.stageStartState) {
            this.saveStageStartState();
        }
        
        // 게임 일시 정지
        gameRunning = false;
        
        // 사망 알림
        showNotification(`💀 You died! Returning to stage ${this.stageStartState.stage} start state...`, 'info');
        
        // 잠시 후 복원 처리
        setTimeout(() => {
            // 스테이지 시작 상태로 복원
            this.restoreStageStartState();
            
            // 게임 상태 초기화
            this.currentMonster = null;
            this.currentBoss = null;
            this.projectiles = [];
            this.monsterProjectiles = [];
            this.meleeEffects = [];
            
            // 새 몬스터 스폰
            this.spawnMonster();
            
            // UI 업데이트
            updateUI();
            
            // 게임 재개
            gameRunning = true;
            gameLoop();
            
            // 재시작 알림
            showNotification('🔄 Stage restarted! Keep fighting!', 'success');
        }, 2000);
    }
    
    // 스테이지 시작 상태로 복원
    restoreStageStartState() {
        if (!this.stageStartState) return;
        
        this.stage = this.stageStartState.stage;
        this.player.level = this.stageStartState.playerLevel;
        this.player.experience = this.stageStartState.playerExperience;
        this.player.gold = this.stageStartState.playerGold;
        this.player.playTime = this.stageStartState.playerPlayTime;
        this.player.maxHp = this.stageStartState.playerMaxHp;
        
        // HP 복원 로직: 시작 시점에 50% 미만이었다면 최대 HP로, 50% 이상이었다면 원래 HP로
        const startHpPercent = this.stageStartState.playerHp / this.stageStartState.playerMaxHp;
        if (startHpPercent < 0.5) {
            this.player.hp = this.player.maxHp; // 최대 HP로 복원
        } else {
            this.player.hp = this.stageStartState.playerHp; // 원래 HP로 복원
        }
    }
    
    // 새 스테이지 시작 시 상태 저장
    onNewStageStart() {
        this.saveStageStartState();
    }
    
    // 스킬 사용
    useSkill(skillId) {
        return this.skillSystem.useSkill(skillId, this.player, this);
    }
    
    // 스킬 투사체 생성 (미사일)
    createSkillProjectile(damage, type, target) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x;
        const startY = canvas.height * this.playerPosition.y;
        
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else {
            targetX = canvas.width * target.positionX;
            targetY = canvas.height * target.positionY;
        }
        
        if (type === 'missile') {
            // 미사일은 특별한 포물선 궤도 사용
            const projectile = new Projectile(startX, startY, targetX, targetY, damage, type, 8);
            projectile.isSkill = true;
            projectile.isMissile = true;
            
            // 미사일 궤도 설정
            projectile.startTime = Date.now();
            projectile.flightDuration = 3000; // 3초 비행시간
            projectile.peakHeight = 200; // 최고 높이
            projectile.originalStartX = startX;
            projectile.originalStartY = startY;
            projectile.originalTargetX = targetX;
            projectile.originalTargetY = targetY;
            
            this.projectiles.push(projectile);
        } else {
            const projectile = new Projectile(startX, startY, targetX, targetY, damage, type, 15);
            projectile.isSkill = true;
            this.projectiles.push(projectile);
        }
    }
    
    // 행성파괴 레이저 생성
    createPlanetDestroyerLaser(damage, target) {
        const canvas = document.getElementById('gameCanvas');
        
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else {
            targetX = canvas.width * target.positionX;
            targetY = canvas.height * target.positionY;
        }
        
        // 행성파괴 레이저 이펙트 생성
        this.planetDestroyerEffect = {
            targetX: targetX,
            targetY: targetY,
            damage: damage,
            target: target,
            startTime: Date.now(),
            phase: 'charge', // charge -> fire -> impact
            chargeTime: 4000, // 4초 충전 (더 천천히)
            fireTime: 2000,   // 2초 발사 (더 천천히)
            active: true
        };
    }
    
    // 방어막 이펙트 표시
    showShieldEffect() {
        this.shieldEffect = {
            startTime: Date.now(),
            duration: 3000, // 3초간 표시
            active: true
        };
    }
    
    // MP 자동 회복
    updateMpRecover() {
        const now = Date.now();
        if (now - this.lastMpRecover >= 1000) { // 1초마다
            this.player.recoverMp(2); // 2 MP 회복
            this.lastMpRecover = now;
        }
    }
    
    // 스킬 이펙트 업데이트
    updateSkillEffects() {
        const now = Date.now();
        
        // 행성파괴 레이저 업데이트
        if (this.planetDestroyerEffect && this.planetDestroyerEffect.active) {
            const effect = this.planetDestroyerEffect;
            const elapsed = now - effect.startTime;
            
            if (effect.phase === 'charge' && elapsed >= effect.chargeTime) {
                effect.phase = 'fire';
                effect.fireStartTime = now;
            } else if (effect.phase === 'fire' && elapsed >= effect.chargeTime + effect.fireTime) {
                effect.phase = 'impact';
                
                // 데미지 적용
                if (effect.target === this.currentBoss) {
                    const isDead = this.dealDamageToBoss(effect.damage);
                    if (isDead) {
                        this.createPlanetCrackEffect();
                    }
                } else if (effect.target === this.currentMonster) {
                    const isDead = this.dealDamageToMonster(effect.damage);
                    if (isDead) {
                        this.createPlanetCrackEffect();
                    }
                }
                
                effect.impactTime = now;
            } else if (effect.phase === 'impact' && elapsed >= effect.chargeTime + effect.fireTime + 2000) {
                this.planetDestroyerEffect = null; // 2초 더 길게 표시
            }
        }
        
        // 방어막 이펙트 업데이트
        if (this.shieldEffect && this.shieldEffect.active) {
            const elapsed = now - this.shieldEffect.startTime;
            if (elapsed >= this.shieldEffect.duration) {
                this.shieldEffect = null;
            }
        }
    }
    
    // 행성 갈라짐 이펙트
    createPlanetCrackEffect() {
        // 행성이 갈라지는 시각적 효과를 위한 데이터
        this.planetCrackEffect = {
            startTime: Date.now(),
            duration: 3000,
            active: true
        };
        
        showNotification('💥 PLANET DESTROYED! 💥', 'success');
    }
    
    // 미사일 폭발 이펙트
    createMissileExplosionEffect(target) {
        const canvas = document.getElementById('gameCanvas');
        let targetX, targetY;
        
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else {
            targetX = canvas.width * target.positionX;
            targetY = canvas.height * target.positionY;
        }
        
        // 스킬 이펙트 배열에 폭발 이펙트 추가
        if (!this.skillEffects) this.skillEffects = [];
        
        this.skillEffects.push({
            type: 'missileExplosion',
            x: targetX,
            y: targetY,
            startTime: Date.now(),
            duration: 800, // 0.8초 지속
            active: true
        });
    }
    
    // 히든 스킬: 몸통박치기
    performBodySlam(target) {
        const canvas = document.getElementById('gameCanvas');
        
        // 타겟 위치 계산
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else {
            targetX = canvas.width * target.positionX;
            targetY = canvas.height * target.positionY;
        }
        
        // 플레이어 원래 위치
        const originalX = canvas.width * this.playerPosition.x;
        const originalY = canvas.height * this.playerPosition.y;
        
        // 몸통박치기 애니메이션 데이터
        this.bodySlamAnimation = {
            startTime: Date.now(),
            duration: 2000, // 2초 동안
            phase: 'rush', // rush -> impact -> return
            originalX: originalX,
            originalY: originalY,
            targetX: targetX - 50, // 타겟 앞에서 멈춤
            targetY: targetY,
            currentX: originalX,
            currentY: originalY,
            target: target,
            active: true
        };
        
        // 고정 데미지 5 (1초 후 적용)
        setTimeout(() => {
            if (target === this.currentBoss) {
                this.dealDamageToBoss(5);
            } else if (target === this.currentMonster) {
                this.dealDamageToMonster(5);
            }
            
            // 넉백 효과 시작
            this.createKnockbackEffect(target);
        }, 1000); // 1초 후 데미지 적용
    }
    
    // 넉백 효과
    createKnockbackEffect(target) {
        const canvas = document.getElementById('gameCanvas');
        
        // 타겟의 원래 위치 저장
        let originalX, originalY;
        if (target === this.currentBoss) {
            originalX = 0.65;
            originalY = 0.5;
        } else {
            originalX = target.positionX;
            originalY = target.positionY;
        }
        
        // 넉백 효과 데이터
        target.knockbackEffect = {
            startTime: Date.now(),
            duration: 1500, // 1.5초
            originalX: originalX,
            originalY: originalY,
            knockbackDistance: 0.1, // 10% 뒤로
            active: true
        };
    }
    
    // 몸통박치기 애니메이션 업데이트
    updateBodySlamAnimation() {
        if (!this.bodySlamAnimation || !this.bodySlamAnimation.active) return;
        
        const animation = this.bodySlamAnimation;
        const elapsed = Date.now() - animation.startTime;
        const progress = elapsed / animation.duration;
        
        if (progress >= 1) {
            // 애니메이션 종료
            this.bodySlamAnimation = null;
            return;
        }
        
        // 단계별 애니메이션
        if (elapsed < 1000) {
            // 0-1초: 돌진 단계
            const rushProgress = elapsed / 1000;
            const easeOut = 1 - Math.pow(1 - rushProgress, 3); // 감속 곡선
            
            animation.currentX = animation.originalX + (animation.targetX - animation.originalX) * easeOut;
            animation.currentY = animation.originalY + (animation.targetY - animation.originalY) * easeOut;
            animation.phase = 'rush';
        } else if (elapsed < 1200) {
            // 1-1.2초: 충격 단계
            animation.phase = 'impact';
        } else {
            // 1.2-2초: 복귀 단계
            const returnProgress = (elapsed - 1200) / 800;
            const easeIn = Math.pow(returnProgress, 2); // 가속 곡선
            
            animation.currentX = animation.targetX + (animation.originalX - animation.targetX) * easeIn;
            animation.currentY = animation.targetY + (animation.originalY - animation.targetY) * easeIn;
            animation.phase = 'return';
        }
    }
}

// ==================== 게임 인스턴스 및 루프 ====================

let game;
let gameRunning = false;

// 기존 initGame 함수는 아래 새로운 버전으로 대체됨

// 게임 루프
function gameLoop() {
    if (!gameRunning) return;
    
    // 자동 보스 도전 체크
    game.checkAutoChallengeBoss();
    
    // 플레이어 자동 이동 (근접 공격을 위해)
    game.updatePlayerMovement();
    
    // 투사체 업데이트
    game.updateProjectiles();
    
    // 자동 포션 사용 체크
    game.checkAutoPotion();
    
    // MP 자동 회복
    game.updateMpRecover();
    
    // 스킬 이펙트 업데이트
    game.updateSkillEffects();
    
    // 몸통박치기 애니메이션 업데이트
    game.updateBodySlamAnimation();
    
    // 몬스터 효과 업데이트
    if (game.currentMonster) {
        game.currentMonster.updateEffects();
    }
    if (game.currentBoss) {
        game.currentBoss.updateEffects();
    }
    
    // 자동 전투 (0.3초마다 - 부드러운 전투)
    if (Date.now() - game.lastAttackTime > 300) {
        game.lastAttackTime = Date.now();
        let combatResult = false;
        if (game.currentBoss) {
            combatResult = game.attackBoss();
        } else {
            combatResult = game.attackMonster();
        }
    }
    
    // 플레이 시간 증가 (60fps 기준으로 1초마다)
    if (Date.now() - (game.lastTimeUpdate || 0) > 1000) {
        game.player.playTime += 1;
        game.lastTimeUpdate = Date.now();
    }
    
    // UI 업데이트 (15fps로 제한하여 성능 최적화)
    if (Date.now() - (game.lastUIUpdate || 0) > 67) {
        updateUI();
        game.lastUIUpdate = Date.now();
    }
    
    // 배경 애니메이션
    drawGame();
    
    // 다음 프레임 (60fps) - 백그라운드에서도 동작하도록 setInterval 사용
    if (gameRunning) {
        setTimeout(gameLoop, 16); // 60fps (16ms마다 실행)
    }
}

// createStars 함수는 rendering.js로 이동

// 렌더링 함수들은 rendering.js로 이동

// 모든 draw* 함수들은 rendering.js로 이동

// 플레이어 그리기
function drawPlayer(ctx, canvas) {
    // 몸통박치기 애니메이션 중이면 애니메이션 위치 사용
    let x, y;
    if (game.bodySlamAnimation && game.bodySlamAnimation.active) {
        x = game.bodySlamAnimation.currentX;
        y = game.bodySlamAnimation.currentY;
        
        // 충격 단계에서 약간의 진동 효과
        if (game.bodySlamAnimation.phase === 'impact') {
            x += (Math.random() - 0.5) * 6;
            y += (Math.random() - 0.5) * 6;
        }
    } else {
        x = canvas.width * game.playerPosition.x;
        y = canvas.height * game.playerPosition.y + Math.sin(Date.now() * 0.003) * 10;
    }
    const player = game.player;
    
    // 캐릭터 색상 가져오기
    const bodyColor = player.character?.color?.body || '#4a90e2';
    const helmetColor = player.character?.color?.helmet || '#357abd';
    const equipmentColor = player.character?.color?.equipment || '#666666';
    
    // 하의 (legs) 그리기
    if (player.equipment.legs) {
        ctx.fillStyle = player.equipment.legs.visual.color;
        ctx.fillRect(x - 8, y + 5, 16, 20);
    }
    
    // 신발 (boots) 그리기
    if (player.equipment.boots) {
        ctx.fillStyle = player.equipment.boots.visual.color;
        ctx.fillRect(x - 10, y + 20, 8, 8);
        ctx.fillRect(x + 2, y + 20, 8, 8);
    }
    
    // 플레이어 몸체 (우주복)
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = helmetColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 상의 (chest) 그리기
    if (player.equipment.chest) {
        ctx.fillStyle = player.equipment.chest.visual.color;
        ctx.fillRect(x - 12, y - 10, 24, 20);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 12, y - 10, 24, 20);
    }
    
    // 어깨 (shoulder) 그리기
    if (player.equipment.shoulder) {
        ctx.fillStyle = player.equipment.shoulder.visual.color;
        ctx.beginPath();
        ctx.arc(x - 18, y - 5, 6, 0, Math.PI * 2);
        ctx.arc(x + 18, y - 5, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 플레이어 헬멧
    const helmetEquip = player.equipment.helmet;
    if (helmetEquip) {
        ctx.fillStyle = helmetEquip.visual.color;
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    }
    ctx.beginPath();
    ctx.arc(x, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = helmetColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 광선검 (왼손)
    if (player.equipment.lightsaber) {
        const saber = player.equipment.lightsaber;
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 35, y - 30);
        ctx.strokeStyle = saber.visual.color;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // 광선검 광택 효과
        ctx.shadowBlur = 10;
        ctx.shadowColor = saber.visual.color;
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 35, y - 30);
        ctx.strokeStyle = saber.visual.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // 레이저총 (오른손)
    if (player.equipment.laser) {
        const laser = player.equipment.laser;
        ctx.fillStyle = laser.visual.color;
        ctx.fillRect(x + 15, y - 5, 15, 8);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 15, y - 5, 15, 8);
        
        // 레이저포인터 효과
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x + 30, y - 2, 3, 2);
    }
    
    // 악세서리 그리기
    // 귀걸이
    if (player.equipment.earring) {
        ctx.fillStyle = player.equipment.earring.visual.color;
        ctx.beginPath();
        ctx.arc(x - 15, y - 20, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 목걸이
    if (player.equipment.necklace) {
        ctx.strokeStyle = player.equipment.necklace.visual.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y - 5, 10, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 반지 (손에 작은 점으로)
    if (player.equipment.ring) {
        ctx.fillStyle = player.equipment.ring.visual.color;
        ctx.beginPath();
        ctx.arc(x - 25, y + 5, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 방어막 시각 효과 (플레이어에게 방어막이 있을 때)
    if (player.shield > 0) {
        const shieldAlpha = Math.sin(Date.now() * 0.008) * 0.2 + 0.4; // 0.2 ~ 0.6 사이로 깜빡임
        const shieldRadius = 35 + Math.sin(Date.now() * 0.01) * 3; // 35~38 사이로 맥동
        
        ctx.save();
        ctx.globalAlpha = shieldAlpha;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        
        // 메인 방어막 구
        ctx.beginPath();
        ctx.arc(x, y, shieldRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 육각형 에너지 패턴
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.002;
            const innerRadius = 20;
            const outerRadius = shieldRadius - 5;
            
            const x1 = x + Math.cos(angle) * innerRadius;
            const y1 = y + Math.sin(angle) * innerRadius;
            const x2 = x + Math.cos(angle) * outerRadius;
            const y2 = y + Math.sin(angle) * outerRadius;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // 방어막 강도에 따른 추가 링
        const shieldPercent = player.shield / player.maxShield;
        if (shieldPercent > 0.5) {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, shieldRadius - 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    // 플레이어 닉네임 표시
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    const nickname = player.character?.nickname || '플레이어';
    ctx.strokeText(nickname, x, y + 40);
    ctx.fillText(nickname, x, y + 40);
}

// 몬스터 그리기
function drawMonster(ctx, canvas) {
    if (!game.currentMonster) return;
    
    const monster = game.currentMonster;
    
    // 넉백 효과 계산
    let x, y;
    if (monster.knockbackEffect && monster.knockbackEffect.active) {
        const knockback = monster.knockbackEffect;
        const elapsed = Date.now() - knockback.startTime;
        const progress = elapsed / knockback.duration;
        
        if (progress >= 1) {
            // 넉백 효과 종료
            monster.knockbackEffect = null;
            x = canvas.width * monster.positionX;
        } else {
            // 넉백 애니메이션 (뒤로 갔다가 돌아옴)
            let knockbackProgress;
            if (progress < 0.3) {
                // 0-30%: 뒤로 밀려남
                knockbackProgress = (progress / 0.3) * knockback.knockbackDistance;
            } else {
                // 30-100%: 원래 자리로 복귀
                const returnProgress = (progress - 0.3) / 0.7;
                knockbackProgress = knockback.knockbackDistance * (1 - returnProgress);
            }
            
            x = canvas.width * (monster.positionX + knockbackProgress);
        }
    } else {
        x = canvas.width * monster.positionX;
    }
    
    const baseY = canvas.height * monster.positionY + Math.sin(Date.now() * 0.004) * 8;
    y = baseY;
    let size = (20 + monster.level * 2) * monster.scale;
    
    // 피격 효과 - 몬스터 흔들림
    if (monster.hitEffect) {
        y += Math.sin(Date.now() * 0.05) * 3;
    }
    
    // 투명도 설정
    ctx.globalAlpha = monster.alpha;
    
    // 몬스터 타입에 따른 색상
    let monsterColor = monster.attackType === 'melee' ? 
        `hsl(${monster.level * 30}, 70%, 50%)` : 
        `hsl(${monster.level * 30 + 180}, 70%, 50%)`;
    
    // 피격 효과 - 빨간색 깜빡임
    if (monster.hitEffect) {
        monsterColor = '#ff6666';
    }
    
    // 몬스터 몸체
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = monsterColor;
    ctx.fill();
    ctx.strokeStyle = monster.attackType === 'melee' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 100, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 몬스터 타입 표시
    if (monster.attackType === 'melee') {
        // 근접 몬스터 - 날카로운 이빨
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 3);
        ctx.lineTo(x - 2, y + 8);
        ctx.lineTo(x + 2, y + 8);
        ctx.lineTo(x + 5, y + 3);
        ctx.fillStyle = 'white';
        ctx.fill();
    } else {
        // 원거리 몬스터 - 마법 오라
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${monster.level * 30 + 180}, 100%, 70%)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // 몬스터 눈
    ctx.beginPath();
    ctx.arc(x - 8, y - 8, 3, 0, Math.PI * 2);
    ctx.arc(x + 8, y - 8, 3, 0, Math.PI * 2);
    ctx.fillStyle = monster.attackType === 'melee' ? 'red' : 'blue';
    ctx.fill();
    
    // HP 바 (몬스터가 살아있을 때만)
    if (monster.alpha > 0.5) {
        const hpBarWidth = 60;
        const hpPercent = monster.hp / monster.maxHp;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x - hpBarWidth/2, y - size - 15, hpBarWidth, 8);
        
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x - hpBarWidth/2, y - size - 15, hpBarWidth * hpPercent, 8);
        
        // 몬스터 이름과 타입
        ctx.fillStyle = 'white';
        ctx.font = '12px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText(monster.name, x, y + size + 20);
        ctx.fillText(`LV.${monster.level} (${monster.attackType === 'melee' ? 'Melee' : 'Ranged'})`, x, y + size + 35);
    }
    
    // 투명도 복원
    ctx.globalAlpha = 1;
}

// 보스 그리기
function drawBoss(ctx, canvas) {
    if (!game.currentBoss) return;
    
    const boss = game.currentBoss;
    
    // 넉백 효과 계산 (보스는 0.65에서 시작)
    let x, y;
    if (boss.knockbackEffect && boss.knockbackEffect.active) {
        const knockback = boss.knockbackEffect;
        const elapsed = Date.now() - knockback.startTime;
        const progress = elapsed / knockback.duration;
        
        if (progress >= 1) {
            // 넉백 효과 종료
            boss.knockbackEffect = null;
            x = canvas.width * 0.65;
        } else {
            // 넉백 애니메이션 (뒤로 갔다가 돌아옴)
            let knockbackProgress;
            if (progress < 0.3) {
                // 0-30%: 뒤로 밀려남
                knockbackProgress = (progress / 0.3) * knockback.knockbackDistance;
            } else {
                // 30-100%: 원래 자리로 복귀
                const returnProgress = (progress - 0.3) / 0.7;
                knockbackProgress = knockback.knockbackDistance * (1 - returnProgress);
            }
            
            x = canvas.width * (0.65 + knockbackProgress);
        }
    } else {
        x = canvas.width * 0.65;
    }
    
    const baseY = canvas.height * 0.5 + Math.sin(Date.now() * 0.002) * 15;
    y = baseY;
    let size = (40 + boss.level * 3) * boss.scale;
    
    // 피격 효과 - 보스 흔들림
    if (boss.hitEffect) {
        y += Math.sin(Date.now() * 0.03) * 8;
    }
    
    // 투명도 설정
    ctx.globalAlpha = boss.alpha;
    
    // 보스 타입에 따른 색상
    let bossColor = boss.attackType === 'melee' ? 
        `hsl(${boss.level * 20}, 80%, 40%)` : 
        `hsl(${boss.level * 20 + 120}, 80%, 45%)`;
    
    // 피격 효과 - 빨간색 깜빡임
    if (boss.hitEffect) {
        bossColor = '#ff4444';
    }
    
    // 보스 오라 (살아있을 때만)
    if (boss.alpha > 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, size + 15, 0, Math.PI * 2);
        ctx.strokeStyle = boss.attackType === 'melee' ? 
            `hsl(${boss.level * 20}, 100%, 60%)` : 
            `hsl(${boss.level * 20 + 120}, 100%, 70%)`;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // 보스 몸체
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = bossColor;
    ctx.fill();
    
    // 보스 테두리
    ctx.strokeStyle = boss.attackType === 'melee' ? 'rgba(255, 0, 0, 1)' : 'rgba(75, 0, 130, 1)';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // 보스 타입별 특징
    if (boss.attackType === 'melee') {
        // 근접 보스 - 거대한 이빨과 발톱
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x - 10, y + 20);
        ctx.lineTo(x - 5, y + 20);
        ctx.lineTo(x, y);
        ctx.lineTo(x + 5, y + 20);
        ctx.lineTo(x + 10, y + 20);
        ctx.lineTo(x + 20, y);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = 'silver';
        ctx.lineWidth = 2;
        ctx.stroke();
    } else {
        // 원거리 보스 - 회전하는 마법 오브들
        for (let i = 0; i < 4; i++) {
            const orbX = x + Math.cos(Date.now() * 0.003 + i * Math.PI / 2) * (size + 25);
            const orbY = y + Math.sin(Date.now() * 0.003 + i * Math.PI / 2) * (size + 25);
            ctx.beginPath();
            ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
            
            const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 8);
            orbGradient.addColorStop(0, '#ffffff');
            orbGradient.addColorStop(0.5, `hsl(${boss.level * 20 + 240 + i * 30}, 100%, 70%)`);
            orbGradient.addColorStop(1, `hsl(${boss.level * 20 + 240 + i * 30}, 80%, 40%)`);
            
            ctx.fillStyle = orbGradient;
            ctx.fill();
        }
    }
    
    // 보스 눈
    ctx.beginPath();
    ctx.arc(x - 15, y - 15, 8, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 15, 8, 0, Math.PI * 2);
    ctx.fillStyle = boss.attackType === 'melee' ? '#ff0000' : '#4b0082';
    ctx.fill();
    
    // 눈 빛 효과
    ctx.beginPath();
    ctx.arc(x - 15, y - 15, 3, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 15, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // 보스 정보 표시 (살아있을 때만)
    if (boss.alpha > 0.5) {
        // HP 바
        const hpBarWidth = 120;
        const hpPercent = boss.hp / boss.maxHp;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - hpBarWidth/2, y - size - 35, hpBarWidth, 15);
        
        ctx.fillStyle = boss.attackType === 'melee' ? '#c0392b' : '#6a0dad';
        ctx.fillRect(x - hpBarWidth/2, y - size - 35, hpBarWidth * hpPercent, 15);
        
        // 보스 이름과 타입
        ctx.fillStyle = 'gold';
        ctx.font = 'bold 16px Noto Sans KR';
        ctx.textAlign = 'center';
        ctx.fillText(boss.name, x, y + size + 30);
        ctx.fillText(`BOSS LV.${boss.level} (${boss.attackType === 'melee' ? 'Melee' : 'Ranged'})`, x, y + size + 50);
    }
    
    // 투명도 복원
    ctx.globalAlpha = 1;
}

// 투사체 그리기
function drawProjectiles(ctx, canvas) {
    // 플레이어 투사체 그리기
    game.projectiles.forEach(projectile => {
        if (projectile.active) {
            ctx.beginPath();
            
            if (projectile.type === 'laser') {
                // 레이저 투사체
                ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                
                // 레이저 꼬리 효과
                ctx.strokeStyle = '#ff6666';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - projectile.velocityX * 3, projectile.y - projectile.velocityY * 3);
                ctx.stroke();
            } else if (projectile.type === 'lightsaber') {
                // 광선검 투사체 (빠른 녹색 섬광)
                ctx.beginPath();
                
                // 광선검 날
                ctx.strokeStyle = '#00ff00';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(projectile.x - 15, projectile.y);
                ctx.lineTo(projectile.x + 15, projectile.y);
                ctx.stroke();
                
                // 광선검 손잡이
                ctx.fillStyle = '#666666';
                ctx.fillRect(projectile.x - 3, projectile.y + 5, 6, 10);
                
                // 글로우 효과
                ctx.shadowColor = '#00ff00';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = '#88ff88';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(projectile.x - 15, projectile.y);
                ctx.lineTo(projectile.x + 15, projectile.y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (projectile.type === 'missile') {
                // 미사일 스킬 투사체
                let rotation;
                if (projectile.isMissile && projectile.flightDuration) {
                    // 포물선 궤도 미사일의 경우 현재 방향 계산
                    const elapsed = Date.now() - projectile.startTime;
                    const progress = Math.min(1, elapsed / projectile.flightDuration);
                    
                    // 다음 위치를 예측해서 방향 계산
                    const nextProgress = Math.min(1, (elapsed + 50) / projectile.flightDuration);
                    const nextX = projectile.originalStartX + (projectile.originalTargetX - projectile.originalStartX) * nextProgress;
                    const nextBaseY = projectile.originalStartY + (projectile.originalTargetY - projectile.originalStartY) * nextProgress;
                    const nextArcHeight = Math.sin(nextProgress * Math.PI) * projectile.peakHeight;
                    const nextY = nextBaseY - nextArcHeight;
                    
                    rotation = Math.atan2(nextY - projectile.y, nextX - projectile.x);
                } else {
                    rotation = Math.atan2(projectile.velocityY, projectile.velocityX);
                }
                
                ctx.save();
                ctx.translate(projectile.x, projectile.y);
                ctx.rotate(rotation);
                
                // 미사일 몸체
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(-8, -3, 16, 6);
                
                // 미사일 앞부분 (삼각형)
                ctx.beginPath();
                ctx.moveTo(8, 0);
                ctx.lineTo(12, -3);
                ctx.lineTo(12, 3);
                ctx.closePath();
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                
                // 미사일 꼬리 (불꽃)
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(-15, -2);
                ctx.lineTo(-12, 0);
                ctx.lineTo(-15, 2);
                ctx.closePath();
                ctx.fillStyle = '#ffff00';
                ctx.fill();
                
                // 글로우 효과
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ff6600';
                ctx.fillRect(-8, -3, 16, 6);
                ctx.shadowBlur = 0;
                
                ctx.restore();
            }
        }
    });
    
    // 몬스터 투사체 그리기
    game.monsterProjectiles.forEach(projectile => {
        if (projectile.active) {
            ctx.beginPath();
            
            if (projectile.type === 'fireball') {
                // 파이어볼 투사체
                ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
                
                // 그라데이션 효과
                const gradient = ctx.createRadialGradient(
                    projectile.x, projectile.y, 0,
                    projectile.x, projectile.y, 4
                );
                gradient.addColorStop(0, '#ffff00');
                gradient.addColorStop(0.5, '#ff6600');
                gradient.addColorStop(1, '#ff0000');
                
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // 불꽃 꼬리 효과
                ctx.strokeStyle = '#ff9900';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - projectile.velocityX * 4, projectile.y - projectile.velocityY * 4);
                ctx.stroke();
            } else if (projectile.type === 'boss_energy') {
                // 보스 에너지 투사체
                ctx.arc(projectile.x, projectile.y, 6, 0, Math.PI * 2);
                
                // 보스 투사체 그라데이션 효과
                const gradient = ctx.createRadialGradient(
                    projectile.x, projectile.y, 0,
                    projectile.x, projectile.y, 6
                );
                gradient.addColorStop(0, '#ffffff');
                gradient.addColorStop(0.3, '#9b59b6');
                gradient.addColorStop(1, '#2c3e50');
                
                ctx.fillStyle = gradient;
                ctx.fill();
                
                // 에너지 오라 효과
                ctx.strokeStyle = '#8e44ad';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(projectile.x, projectile.y, 8, 0, Math.PI * 2);
                ctx.stroke();
                
                // 에너지 꼬리 효과
                ctx.strokeStyle = '#9b59b6';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(projectile.x, projectile.y);
                ctx.lineTo(projectile.x - projectile.velocityX * 5, projectile.y - projectile.velocityY * 5);
                ctx.stroke();
            } else if (projectile.type === 'monster_melee') {
                // 몬스터 근접 공격 (발톱 모양)
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                
                // 발톱 모양 그리기
                ctx.beginPath();
                ctx.moveTo(projectile.x - 8, projectile.y - 8);
                ctx.lineTo(projectile.x + 8, projectile.y + 8);
                ctx.moveTo(projectile.x + 8, projectile.y - 8);
                ctx.lineTo(projectile.x - 8, projectile.y + 8);
                ctx.stroke();
                
                // 붉은 글로우 효과
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 8;
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else if (projectile.type === 'boss_melee') {
                // 보스 근접 공격 (강력한 에너지 발톱)
                ctx.strokeStyle = '#8b0000';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                
                // 더 크고 강력한 발톱 모양
                ctx.beginPath();
                ctx.moveTo(projectile.x - 12, projectile.y - 12);
                ctx.lineTo(projectile.x + 12, projectile.y + 12);
                ctx.moveTo(projectile.x + 12, projectile.y - 12);
                ctx.lineTo(projectile.x - 12, projectile.y + 12);
                ctx.moveTo(projectile.x, projectile.y - 15);
                ctx.lineTo(projectile.x, projectile.y + 15);
                ctx.stroke();
                
                // 강력한 붉은 글로우 효과
                ctx.shadowColor = '#ff0000';
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    });
}

// 근접 공격 이펙트 그리기
function drawMeleeEffects(ctx, canvas) {
    if (!game.meleeEffects || game.meleeEffects.length === 0) return;
    
    for (let i = game.meleeEffects.length - 1; i >= 0; i--) {
        const effect = game.meleeEffects[i];
        const elapsed = Date.now() - effect.startTime;
        const duration = 300; // 0.3초 지속
        
        if (elapsed > duration) {
            game.meleeEffects.splice(i, 1);
            continue;
        }
        
        const progress = elapsed / duration;
        const alpha = 1 - progress;
        const scale = 1 + progress * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 4 * scale;
        
        // 충격파 원형 이펙트
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 30 * scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // 충격 라인들
        for (let j = 0; j < 8; j++) {
            const angle = (j / 8) * Math.PI * 2;
            const x1 = effect.x + Math.cos(angle) * 20 * scale;
            const y1 = effect.y + Math.sin(angle) * 20 * scale;
            const x2 = effect.x + Math.cos(angle) * 40 * scale;
            const y2 = effect.y + Math.sin(angle) * 40 * scale;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// 스킬 이펙트 그리기
function drawSkillEffects(ctx, canvas) {
    if (!game.skillEffects || game.skillEffects.length === 0) return;
    
    for (let i = game.skillEffects.length - 1; i >= 0; i--) {
        const effect = game.skillEffects[i];
        const elapsed = Date.now() - effect.startTime;
        
        if (elapsed > effect.duration) {
            game.skillEffects.splice(i, 1);
            continue;
        }
        
        const progress = elapsed / effect.duration;
        
        if (effect.type === 'shield') {
            drawShieldEffect(ctx, canvas, effect, progress);
        } else if (effect.type === 'planetDestroyer') {
            drawPlanetDestroyerEffect(ctx, canvas, effect, progress);
        } else if (effect.type === 'planetCrack') {
            drawPlanetCrackEffect(ctx, canvas, effect, progress);
        } else if (effect.type === 'missileExplosion') {
            drawMissileExplosionEffect(ctx, canvas, effect, progress);
        }
    }
    
    // 행성파괴 레이저는 별도 처리 (더 눈에 띄도록)
    if (game.planetDestroyerEffect && game.planetDestroyerEffect.active) {
        const effect = game.planetDestroyerEffect;
        const elapsed = Date.now() - effect.startTime;
        const totalDuration = effect.chargeTime + effect.fireTime + 2000; // 8초 총 지속시간
        const progress = elapsed / totalDuration;
        
        drawPlanetDestroyerEffect(ctx, canvas, effect, progress);
    }
}

// 방어막 이펙트 그리기
function drawShieldEffect(ctx, canvas, effect, progress) {
    const x = canvas.width * game.playerPosition.x;
    const y = canvas.height * game.playerPosition.y;
    const alpha = Math.sin(progress * Math.PI * 4) * 0.3 + 0.3;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    
    // 방어막 구
    ctx.beginPath();
    ctx.arc(x, y, 25 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // 육각형 패턴
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Date.now() * 0.001;
        const innerRadius = 15;
        const outerRadius = 25;
        
        const x1 = x + Math.cos(angle) * innerRadius;
        const y1 = y + Math.sin(angle) * innerRadius;
        const x2 = x + Math.cos(angle) * outerRadius;
        const y2 = y + Math.sin(angle) * outerRadius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// 행성파괴레이저 이펙트 그리기
function drawPlanetDestroyerEffect(ctx, canvas, effect, progress) {
    const target = effect.target;
    if (!target) return;
    
    let targetX, targetY;
    if (target === game.currentBoss) {
        targetX = canvas.width * 0.65;
        targetY = canvas.height * 0.5;
    } else {
        targetX = canvas.width * target.positionX;
        targetY = canvas.height * target.positionY;
    }
    
    if (effect.phase === 'charge') {
        // 충전 단계 (4초 동안)
        const chargeProgress = Math.min(1, progress * (8000 / 4000)); // 전체 8초 중 첫 4초
        const alpha = Math.sin(chargeProgress * Math.PI * 15) * 0.4 + 0.6;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // 하늘에서 에너지 수집
        const chargeRadius = 20 + chargeProgress * 30;
        const gradient = ctx.createRadialGradient(targetX, targetY - 150, 0, targetX, targetY - 150, chargeRadius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#ff0000');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(targetX, targetY - 150, chargeRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 에너지 수집 파티클들
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2 + Date.now() * 0.005;
            const radius = 80 + Math.sin(Date.now() * 0.003 + i) * 30;
            const px = targetX + Math.cos(angle) * radius * (1 - chargeProgress * 0.5);
            const py = targetY - 150 + Math.sin(angle) * radius * (1 - chargeProgress * 0.5);
            
            ctx.beginPath();
            ctx.arc(px, py, 2 + chargeProgress * 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffff00';
            ctx.fill();
        }
        
        // 타겟 마킹
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(targetX, targetY, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.restore();
    } else if (effect.phase === 'fire') {
        // 발사 단계 (2초 동안)
        const fireProgress = Math.max(0, (progress - 0.5) * 2); // 4초 후부터 2초간
        
        ctx.save();
        
        // 강력한 레이저 빔
        const beamWidth = 15 + fireProgress * 10;
        const beamHeight = 150 * fireProgress;
        
        // 레이저 그라데이션
        const laserGradient = ctx.createLinearGradient(targetX, targetY - 150, targetX, targetY);
        laserGradient.addColorStop(0, '#ffffff');
        laserGradient.addColorStop(0.3, '#ff0000');
        laserGradient.addColorStop(1, '#aa0000');
        
        ctx.fillStyle = laserGradient;
        ctx.fillRect(targetX - beamWidth/2, targetY - beamHeight, beamWidth, beamHeight);
        
        // 외부 글로우
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 30;
        ctx.fillRect(targetX - beamWidth/2, targetY - beamHeight, beamWidth, beamHeight);
        ctx.shadowBlur = 0;
        
        // 타겟 지점 충격파
        if (fireProgress > 0.5) {
            const impactProgress = (fireProgress - 0.5) * 2;
            const impactRadius = 60 * impactProgress;
            
            ctx.globalAlpha = 1 - impactProgress;
            
            const impactGradient = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, impactRadius);
            impactGradient.addColorStop(0, '#ffffff');
            impactGradient.addColorStop(0.4, '#ff4400');
            impactGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(targetX, targetY, impactRadius, 0, Math.PI * 2);
            ctx.fillStyle = impactGradient;
            ctx.fill();
            
            // 충격파 링들
            for (let i = 0; i < 3; i++) {
                const ringRadius = impactRadius + i * 20;
                ctx.strokeStyle = `rgba(255, ${100 - i * 30}, 0, ${1 - impactProgress})`;
                ctx.lineWidth = 4 - i;
                ctx.beginPath();
                ctx.arc(targetX, targetY, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }
}

// 행성 갈라짐 이펙트 그리기
function drawPlanetCrackEffect(ctx, canvas, effect, progress) {
    if (!effect.cracks) return;
    
    ctx.save();
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 1 - progress;
    
    for (const crack of effect.cracks) {
        ctx.beginPath();
        ctx.moveTo(crack.x1, crack.y1);
        ctx.lineTo(
            crack.x1 + (crack.x2 - crack.x1) * progress,
            crack.y1 + (crack.y2 - crack.y1) * progress
        );
        ctx.stroke();
    }
    
    ctx.restore();
}

// 미사일 폭발 이펙트 그리기
function drawMissileExplosionEffect(ctx, canvas, effect, progress) {
    const x = effect.x;
    const y = effect.y;
    const radius = 50 * progress; // 점점 커지는 폭발
    const alpha = 1 - progress; // 점점 사라짐
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // 메인 폭발 (오렌지 원)
    const explosionGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    explosionGradient.addColorStop(0, '#ffff00'); // 중심은 노란색
    explosionGradient.addColorStop(0.3, '#ff6600'); // 중간은 주황색
    explosionGradient.addColorStop(1, 'rgba(255, 0, 0, 0)'); // 가장자리는 투명한 빨강
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = explosionGradient;
    ctx.fill();
    
    // 폭발 파편들
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const particleDistance = radius * 0.8 + Math.sin(Date.now() * 0.01 + i) * 10;
        const particleX = x + Math.cos(angle) * particleDistance;
        const particleY = y + Math.sin(angle) * particleDistance;
        const particleSize = 3 + Math.random() * 4;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize * (1 - progress), 0, Math.PI * 2);
        ctx.fillStyle = '#ff4400';
        ctx.fill();
    }
    
    // 충격파 링
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 3 * (1 - progress);
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
}

// 몸통박치기 이펙트 그리기
function drawBodySlamEffect(ctx, canvas) {
    if (!game.bodySlamAnimation || !game.bodySlamAnimation.active) return;
    
    const animation = game.bodySlamAnimation;
    
    // 충격파 효과 (충격 단계에서만)
    if (animation.phase === 'impact') {
        const elapsed = Date.now() - animation.startTime - 1000; // 충격 시작 후 경과 시간
        const impactProgress = elapsed / 200; // 0.2초 동안
        
        if (impactProgress >= 0 && impactProgress <= 1) {
            const radius = 30 + impactProgress * 60; // 30에서 90까지 확장
            const alpha = 1 - impactProgress; // 서서히 투명해짐
            
            ctx.save();
            ctx.globalAlpha = alpha * 0.7;
            
            // 충격파 링
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 8;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.arc(animation.targetX, animation.targetY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // 내부 충격파
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(animation.targetX, animation.targetY, radius * 0.7, 0, Math.PI * 2);
            ctx.stroke();
            
            // 파편 효과
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const distance = radius * 0.8;
                const x = animation.targetX + Math.cos(angle) * distance;
                const y = animation.targetY + Math.sin(angle) * distance;
                
                ctx.fillStyle = '#ff9900';
                ctx.beginPath();
                ctx.arc(x, y, 4 - impactProgress * 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        }
    }
    
    // 돌진 경로 표시 (돌진 단계에서만)
    if (animation.phase === 'rush') {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(animation.originalX, animation.originalY);
        ctx.lineTo(animation.targetX, animation.targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 속도선 효과
        for (let i = 0; i < 5; i++) {
            const trailX = animation.currentX - (animation.currentX - animation.originalX) * i * 0.1;
            const trailY = animation.currentY - (animation.currentY - animation.originalY) * i * 0.1;
            const trailAlpha = (5 - i) / 5 * 0.3;
            
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(trailX, trailY, 8 - i, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// 데미지 숫자 표시
function showDamageNumber(x, y, damage) {
    const damageDiv = document.createElement('div');
    damageDiv.className = 'damage-number';
    damageDiv.textContent = `-${damage}`;
    damageDiv.style.left = x + 'px';
    damageDiv.style.top = y + 'px';
    
    document.getElementById('gameContainer').appendChild(damageDiv);
    
    setTimeout(() => {
        if (damageDiv.parentNode) {
            damageDiv.parentNode.removeChild(damageDiv);
        }
    }, 1000);
}

// UI 업데이트
function updateUI() {
    // 퀘스트 상태를 매번 체크 (레벨, 골드, 경험치, 장비 상태 실시간 반영)
    game.checkQuestStatus();
    
    // 플레이어 정보 업데이트
    document.getElementById('playerLevel').textContent = game.player.level;
    document.getElementById('playerPower').textContent = game.player.getTotalPower();
    document.getElementById('playerDefense').textContent = game.player.getTotalDefense();
    document.getElementById('playerGold').textContent = game.player.gold;
    
    // HP 바
    const hpPercent = (game.player.hp / game.player.maxHp) * 100;
    document.getElementById('hpBar').style.width = hpPercent + '%';
    document.getElementById('hpText').textContent = `${game.player.hp}/${game.player.maxHp} (${hpPercent.toFixed(0)}%)`;
    
    // MP 바
    const mpPercent = (game.player.mp / game.player.maxMp) * 100;
    document.getElementById('mpBar').style.width = mpPercent + '%';
    document.getElementById('mpText').textContent = `${game.player.mp}/${game.player.maxMp} (${mpPercent.toFixed(0)}%)`;
    
    // 방어막 바
    if (game.player.shield > 0) {
        const shieldPercent = (game.player.shield / game.player.maxShield) * 100;
        document.getElementById('shieldDisplay').style.display = 'block';
        document.getElementById('shieldBarContainer').style.display = 'block';
        document.getElementById('shieldText').textContent = `${game.player.shield}/${game.player.maxShield} (${shieldPercent.toFixed(0)}%)`;
        document.getElementById('shieldBar').style.width = shieldPercent + '%';
    } else {
        document.getElementById('shieldDisplay').style.display = 'none';
        document.getElementById('shieldBarContainer').style.display = 'none';
    }
    
    // 경험치 바
    const expPercent = (game.player.experience / game.player.experienceToNext) * 100;
    document.getElementById('expBar').style.width = expPercent + '%';
    document.getElementById('expText').textContent = `${game.player.experience}/${game.player.experienceToNext} (${expPercent.toFixed(0)}%)`;
    
    // 퀘스트 업데이트
    updateQuestUI();
    
    // 스테이지 정보 업데이트
    document.getElementById('currentStage').textContent = game.stage;
    document.getElementById('currentPlanet').textContent = game.getCurrentPlanet();
    
    // 몬스터/보스 정보 업데이트
    if (game.currentBoss) {
        document.getElementById('currentMonster').textContent = game.currentBoss.name;
        document.getElementById('monsterLevel').textContent = game.currentBoss.level;
        const bossHpPercent = (game.currentBoss.hp / game.currentBoss.maxHp) * 100;
        document.getElementById('bossHpBar').style.width = bossHpPercent + '%';
        document.getElementById('bossHpText').textContent = `${Math.max(0, game.currentBoss.hp)}/${game.currentBoss.maxHp} (${bossHpPercent.toFixed(0)}%)`;
    } else if (game.currentMonster) {
        document.getElementById('currentMonster').textContent = game.currentMonster.name;
        document.getElementById('monsterLevel').textContent = game.currentMonster.level;
        const monsterHpPercent = (game.currentMonster.hp / game.currentMonster.maxHp) * 100;
        document.getElementById('bossHpBar').style.width = monsterHpPercent + '%';
        document.getElementById('bossHpText').textContent = `${Math.max(0, game.currentMonster.hp)}/${game.currentMonster.maxHp} (${monsterHpPercent.toFixed(0)}%)`;
    }
    
    // 장비 슬롯 업데이트
    updateEquipmentUI();
    
    // 포션 UI 업데이트
    updatePotionUI();
    
    // 스킬 UI 업데이트
    updateSkillUI();
    
    // 무기 선택 UI 업데이트
    updateWeaponSelector();
}

// 퀘스트 UI 업데이트
function updateQuestUI() {
    const questList = document.getElementById('questList');
    questList.innerHTML = '';
    
    game.quests.forEach(quest => {
        const questDiv = document.createElement('div');
        questDiv.className = 'quest-item' + (quest.completed ? ' quest-completed' : '');
        questDiv.innerHTML = `
            <div>${quest.description}</div>
            <div>${quest.current}/${quest.target}</div>
        `;
        questList.appendChild(questDiv);
    });
    
    // 보스 도전은 자동으로 실행됨
}

// 장비 UI 업데이트
function updateEquipmentUI() {
    Object.keys(game.player.equipment).forEach(slot => {
        const slotElement = document.querySelector(`[data-slot="${slot}"]`);
        const equipment = game.player.equipment[slot];
        
        if (equipment) {
            slotElement.classList.add('equipped');
            slotElement.title = `${equipment.name} (레벨 ${equipment.level}, 전투력 +${equipment.power})`;
            
            // 장비 아이콘 및 색상 업데이트
            slotElement.textContent = equipment.visual.emoji;
            slotElement.style.color = equipment.visual.color;
            
            // 장비 레벨을 작은 텍스트로 표시
            const levelSpan = slotElement.querySelector('.equipment-level');
            if (levelSpan) {
                levelSpan.textContent = equipment.level;
            } else {
                const newLevelSpan = document.createElement('span');
                newLevelSpan.className = 'equipment-level';
                newLevelSpan.style.cssText = `
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    font-size: 8px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border-radius: 2px;
                    padding: 1px 2px;
                `;
                newLevelSpan.textContent = equipment.level;
                slotElement.appendChild(newLevelSpan);
            }
        } else {
            slotElement.classList.remove('equipped');
            const originalTitle = slotElement.getAttribute('title');
            slotElement.title = originalTitle ? originalTitle.split(' (')[0] : slotElement.getAttribute('data-slot');
            
            // 레벨 스팬 제거
            const levelSpan = slotElement.querySelector('.equipment-level');
            if (levelSpan) {
                levelSpan.remove();
            }
        }
    });
}

// 보스 도전은 자동으로 실행됨 (challengeBoss 함수 제거됨)

// 랭킹 관련 함수들
function showRanking() {
    document.getElementById('rankingModal').style.display = 'flex';
    showPowerRanking();
}

function closeRanking() {
    document.getElementById('rankingModal').style.display = 'none';
}

function showPowerRanking() {
    const content = document.getElementById('rankingContent');
    content.innerHTML = `
        <h3>전투력 랭킹</h3>
        <div>1. 플레이어 - ${game.player.getTotalPower()}</div>
        <div>2. 다른 플레이어 - ${Math.floor(game.player.getTotalPower() * 0.8)}</div>
        <div>3. 다른 플레이어 - ${Math.floor(game.player.getTotalPower() * 0.6)}</div>
    `;
}

function showStageRanking() {
    const content = document.getElementById('rankingContent');
    content.innerHTML = `
        <h3>스테이지 랭킹</h3>
        <div>1. 플레이어 - ${game.stage} 스테이지</div>
        <div>2. 다른 플레이어 - ${Math.max(1, game.stage - 5)} 스테이지</div>
        <div>3. 다른 플레이어 - ${Math.max(1, game.stage - 10)} 스테이지</div>
    `;
}

function showTimeRanking() {
    const content = document.getElementById('rankingContent');
    const hours = Math.floor(game.player.playTime / 3600);
    const minutes = Math.floor((game.player.playTime % 3600) / 60);
    content.innerHTML = `
        <h3>플레이 시간 랭킹</h3>
        <div>1. 플레이어 - ${hours}시간 ${minutes}분</div>
        <div>2. 다른 플레이어 - ${Math.floor(hours * 0.8)}시간</div>
        <div>3. 다른 플레이어 - ${Math.floor(hours * 0.6)}시간</div>
    `;
}

// 윈도우 리사이즈 처리
window.addEventListener('resize', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 게임 시작
window.addEventListener('load', () => {
    initGame();
});

// 코나미 커맨드 시스템
class KonamiCommand {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowRight', 'ArrowRight', 'Space']; // up up right right space
        this.userInput = [];
        this.isActive = false;
        this.cooldown = 10000; // 10초 쿨다운
        this.lastUsed = 0;
        
        // 키 입력 리스너 등록
        this.initKeyListener();
    }
    
    initKeyListener() {
        document.addEventListener('keydown', (event) => {
            // 게임이 실행 중일 때만 작동
            if (!gameRunning || !game || !game.player) return;
            
            // 입력 필드나 모달이 열려있으면 무시
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;
            if (document.getElementById('loginModal').style.display === 'flex') return;
            if (document.getElementById('characterModal').style.display === 'flex') return;
            
            // console.log('Key pressed:', event.key); // 디버그용 (필요시 주석 해제)
            
            // 입력된 키를 배열에 추가
            this.userInput.push(event.key);
            
            // 배열이 너무 길어지면 앞부분 제거
            if (this.userInput.length > this.sequence.length) {
                this.userInput.shift();
            }
            
            // console.log('Current input sequence:', this.userInput); // 디버그용 (필요시 주석 해제)
            
            // 패턴 매칭 확인
            this.checkSequence();
        });
    }
    
    checkSequence() {
        // 입력 길이가 시퀀스와 같은지 확인
        if (this.userInput.length !== this.sequence.length) return;
        
        // 시퀀스가 일치하는지 확인
        const isMatch = this.userInput.every((key, index) => key === this.sequence[index]);
        
        if (isMatch) {
            console.log('🥊 KONAMI CODE DETECTED! Activating Body Slam...'); // 성공 로그
            this.activateHiddenSkill();
            this.userInput = []; // 입력 초기화
        }
    }
    
    activateHiddenSkill() {
        const now = Date.now();
        
        // 쿨다운 체크
        if (now - this.lastUsed < this.cooldown) {
            const remainingCooldown = Math.ceil((this.cooldown - (now - this.lastUsed)) / 1000);
            showNotification(`Body Slam on cooldown: ${remainingCooldown}s`, 'info');
            return;
        }
        
        // 타겟이 있는지 확인
        const target = game.currentBoss || game.currentMonster;
        if (!target) {
            showNotification('No target for Body Slam!', 'info');
            return;
        }
        
        this.lastUsed = now;
        this.executeBodySlam(target);
        showNotification('🥊 BODY SLAM ACTIVATED! 🥊', 'success');
    }
    
    executeBodySlam(target) {
        // 히든 스킬 실행
        game.performBodySlam(target);
    }
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#27ae60' : '#4a90e2'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeInOut 3s ease-in-out forwards;
    `;
    notification.textContent = message;
    
    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

// 장비 정보 모달 표시
function showEquipmentDetail(slot) {
    const equipment = game.player.equipment[slot];
    const modal = document.getElementById('equipmentModal');
    
    // 슬롯 정보 매핑
    const slotInfo = {
        lightsaber: { name: 'Lightsaber', icon: '⚔️' },
        laser: { name: 'Laser Rifle', icon: '🔫' },
        helmet: { name: 'Helmet', icon: '⛑️' },
        shoulder: { name: 'Shoulder Guard', icon: '🛡️' },
        chest: { name: 'Chest Armor', icon: '👕' },
        legs: { name: 'Leg Armor', icon: '👖' },
        boots: { name: 'Boots', icon: '👢' },
        earring: { name: 'Earring', icon: '👂' },
        necklace: { name: 'Necklace', icon: '📿' },
        ring: { name: 'Ring', icon: '💍' }
    };
    
    const slotData = slotInfo[slot];
    
    if (equipment) {
        // 장비가 있는 경우
        document.getElementById('equipmentTitle').textContent = `${slotData.name} Info`;
        document.getElementById('equipmentIconLarge').textContent = equipment.visual.emoji;
        document.getElementById('equipmentIconLarge').style.color = equipment.visual.color;
        document.getElementById('equipmentName').textContent = equipment.name;
        document.getElementById('equipmentDescription').textContent = equipment.description;
        document.getElementById('equipmentLevel').textContent = equipment.level;
        document.getElementById('equipmentPower').textContent = `+${equipment.power}`;
        document.getElementById('equipmentDefense').textContent = equipment.defense > 0 ? `+${equipment.defense}` : '-';
        document.getElementById('equipmentRarity').textContent = equipment.rarity.charAt(0).toUpperCase() + equipment.rarity.slice(1);
        document.getElementById('equipmentType').textContent = equipment.type.charAt(0).toUpperCase() + equipment.type.slice(1);
        
        // 등급에 따른 색상 변경
        const rarityElement = document.getElementById('equipmentRarity');
        rarityElement.className = `rarity-${equipment.rarity}`;
        
        const nameElement = document.getElementById('equipmentName');
        nameElement.className = `rarity-${equipment.rarity}`;
    } else {
        // 장비가 없는 경우
        document.getElementById('equipmentTitle').textContent = `${slotData.name} Info`;
        document.getElementById('equipmentIconLarge').textContent = slotData.icon;
        document.getElementById('equipmentName').textContent = 'No Equipment';
        document.getElementById('equipmentDescription').textContent = `No ${slotData.name.toLowerCase()} is currently equipped. Defeat monsters to find new equipment!`;
        document.getElementById('equipmentLevel').textContent = '-';
        document.getElementById('equipmentPower').textContent = '-';
        document.getElementById('equipmentDefense').textContent = '-';
        document.getElementById('equipmentRarity').textContent = '-';
        document.getElementById('equipmentType').textContent = '-';
        
        // 기본 색상으로 복원
        document.getElementById('equipmentRarity').className = '';
        document.getElementById('equipmentName').className = '';
    }
    
    modal.style.display = 'flex';
}

// 장비 정보 모달 닫기
function closeEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'none';
}

// 포션 UI 업데이트
function updatePotionUI() {
    document.getElementById('smallPotionCount').textContent = game.healthPotions.small;
    document.getElementById('mediumPotionCount').textContent = game.healthPotions.medium;
    document.getElementById('largePotionCount').textContent = game.healthPotions.large;
}

// 포션 사용 함수
function usePotion(type) {
    if (game.useHealthPotion(type)) {
        updatePotionUI();
    }
}

// 자동 포션 설정 함수들
function toggleAutoPotion() {
    const enabled = document.getElementById('autoPotionEnabled').checked;
    game.autoPotionSettings.enabled = enabled;
    showNotification(`Auto Potion ${enabled ? 'Enabled' : 'Disabled'}`, 'info');
}

function updateAutoPotionPercent(value) {
    game.autoPotionSettings.triggerPercent = parseInt(value);
    document.getElementById('autoPotionPercentText').textContent = value + '%';
}

function updateAutoPotionPriority() {
    const priority = document.getElementById('autoPotionPriority').value;
    game.autoPotionSettings.priority = priority.split(',');
    showNotification(`Priority updated: ${priority.replace(/,/g, ' → ')}`, 'info');
}

// 기존 모달 이벤트는 아래 계정 시스템에서 통합 관리됨 

// 계정 시스템 및 게임 관리 기능
let currentUser = null;
let isRegisterMode = false;

// 계정 관리 함수들
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginMessage').textContent = '';
    updateLoginModal();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginId').value = '';
    document.getElementById('loginPw').value = '';
    document.getElementById('loginMessage').textContent = '';
    isRegisterMode = false;
    updateLoginModal();
}

function toggleRegisterMode() {
    isRegisterMode = !isRegisterMode;
    updateLoginModal();
}

function updateLoginModal() {
    if (isRegisterMode) {
        document.getElementById('loginTitle').textContent = '회원가입';
        document.getElementById('loginBtn').textContent = '회원가입';
        document.getElementById('toggleBtn').textContent = '로그인';
    } else {
        document.getElementById('loginTitle').textContent = '로그인';
        document.getElementById('loginBtn').textContent = '로그인';
        document.getElementById('toggleBtn').textContent = '회원가입';
    }
}

function login() {
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPw').value;
    const messageEl = document.getElementById('loginMessage');
    
    if (!id || !pw) {
        messageEl.textContent = '아이디와 비밀번호를 입력해주세요.';
        return;
    }
    
    if (isRegisterMode) {
        // 회원가입
        register(id, pw);
    } else {
        // 로그인
        loginUser(id, pw);
    }
}

// 기존 register 함수는 아래 새로운 버전으로 대체됨

// 기존 loginUser 함수는 아래 새로운 버전으로 대체됨

function logout() {
    if (currentUser) {
        // 현재 게임 데이터 저장
        saveUserGameData(currentUser);
        currentUser = null;
        updateAccountInfo();
        showNotification('로그아웃되었습니다.', 'info');
    }
}

function updateAccountInfo() {
    const accountInfo = document.getElementById('accountInfo');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    
    if (currentUser) {
        accountInfo.textContent = `로그인: ${currentUser}`;
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
    } else {
        accountInfo.textContent = '로그인되지 않음';
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
    }
}

function saveUserGameData(userId) {
    if (!game) return;
    
    const gameData = {
        player: game.player,
        stage: game.stage,
        quests: game.quests,
        healthPotions: game.healthPotions,
        autoPotionSettings: game.autoPotionSettings,
        stageStartState: game.stageStartState,
        timestamp: Date.now()
    };
    
    const userDataKey = `gameData_${userId}`;
    localStorage.setItem(userDataKey, JSON.stringify(gameData));
}

function loadUserGameData(userId) {
    const userDataKey = `gameData_${userId}`;
    const saved = localStorage.getItem(userDataKey);
    
    if (saved && game) {
        const gameData = JSON.parse(saved);
        
        // 플레이어 데이터 복원
        Object.assign(game.player, gameData.player);
        game.stage = gameData.stage;
        game.quests = gameData.quests.map(q => Object.assign(new Quest(), q));
        
        if (gameData.healthPotions) {
            game.healthPotions = gameData.healthPotions;
        }
        
        if (gameData.autoPotionSettings) {
            game.autoPotionSettings = gameData.autoPotionSettings;
            
            // UI 동기화
            document.getElementById('autoPotionEnabled').checked = gameData.autoPotionSettings.enabled;
            document.getElementById('autoPotionPercent').value = gameData.autoPotionSettings.triggerPercent;
            document.getElementById('autoPotionPercentText').textContent = gameData.autoPotionSettings.triggerPercent + '%';
            
            const priorityString = gameData.autoPotionSettings.priority.join(',');
            document.getElementById('autoPotionPriority').value = priorityString;
        }
        
        if (gameData.stageStartState) {
            game.stageStartState = gameData.stageStartState;
        }
        
        // 새 몬스터 스폰
        game.spawnMonster();
        
        // UI 업데이트
        updateUI();
        updatePotionUI();
        
        showNotification('게임 데이터를 불러왔습니다.', 'success');
    } else {
        // 새 게임 시작
        showNotification('새 게임을 시작합니다.', 'info');
    }
}

// 게임 관리 함수들
function resetGame() {
    if (confirm('정말로 게임을 처음부터 다시 시작하시겠습니까? 현재 진행도가 모두 삭제됩니다.')) {
        // 현재 사용자 게임 데이터만 삭제
        if (currentUser) {
            const userDataKey = `gameData_${currentUser}`;
            localStorage.removeItem(userDataKey);
        } else {
            // 로그인하지 않은 경우 기본 게임 데이터 삭제
            localStorage.removeItem('littlePrinceIdleGame');
        }
        
        // 게임 재시작
        initGame();
        showNotification('게임이 초기화되었습니다.', 'success');
    }
}

function clearAllData() {
    if (confirm('정말로 모든 데이터(모든 계정 및 게임 데이터)를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        // 모든 localStorage 데이터 삭제
        localStorage.clear();
        
        // 로그아웃
        currentUser = null;
        updateAccountInfo();
        
        // 게임 재시작
        initGame();
        showNotification('모든 데이터가 삭제되었습니다.', 'info');
    }
}

// 기존 저장/로드 함수 수정
const originalSaveGame = game?.saveGame;
const originalLoadGame = game?.loadGame;

// GameUseCase의 saveGame과 loadGame 메서드 오버라이드
function enhancedSaveGame() {
    if (currentUser) {
        saveUserGameData(currentUser);
    } else {
        // 기존 방식으로 저장
        if (originalSaveGame) {
            originalSaveGame.call(game);
        }
    }
}

function enhancedLoadGame() {
    if (currentUser) {
        loadUserGameData(currentUser);
    } else {
        // 기존 방식으로 로드
        if (originalLoadGame) {
            originalLoadGame.call(game);
        }
    }
}

// 페이지 종료 시 저장 로직 수정
window.addEventListener('beforeunload', () => {
    if (game) {
        if (currentUser) {
            saveUserGameData(currentUser);
        } else {
            game.saveGame();
        }
    }
});

// 모달 배경 클릭 시 닫기에 로그인 모달 추가
document.addEventListener('click', (e) => {
    if (e.target.id === 'equipmentModal') {
        closeEquipmentModal();
    }
    if (e.target.id === 'rankingModal') {
        closeRanking();
    }
    if (e.target.id === 'loginModal') {
        closeLoginModal();
    }
});

// 엔터키로 로그인/회원가입
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && document.getElementById('loginModal').style.display === 'flex') {
        login();
    }
});

// 캐릭터 생성 관련 함수들
function showCharacterModal() {
    document.getElementById('characterModal').style.display = 'flex';
    document.getElementById('characterMessage').textContent = '';
    updateCharacterPreview();
    
    // 색상 변경 이벤트 리스너 추가
    document.getElementById('bodyColor').addEventListener('input', updateCharacterPreview);
    document.getElementById('helmetColor').addEventListener('input', updateCharacterPreview);
    document.getElementById('equipmentColor').addEventListener('input', updateCharacterPreview);
}

function closeCharacterModal() {
    document.getElementById('characterModal').style.display = 'none';
    document.getElementById('characterNickname').value = '';
    document.getElementById('characterMessage').textContent = '';
}

function updateCharacterPreview() {
    const canvas = document.getElementById('characterPreview');
    const ctx = canvas.getContext('2d');
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const x = 50;
    const y = 50;
    
    // 색상 가져오기
    const bodyColor = document.getElementById('bodyColor').value;
    const helmetColor = document.getElementById('helmetColor').value;
    const equipmentColor = document.getElementById('equipmentColor').value;
    
    // 플레이어 몸체
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.strokeStyle = helmetColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 헬멧
    ctx.beginPath();
    ctx.arc(x, y - 15, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = helmetColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 기본 장비 (예시)
    ctx.fillStyle = equipmentColor;
    ctx.fillRect(x - 8, y - 5, 16, 15);
}

function createCharacter() {
    const nickname = document.getElementById('characterNickname').value.trim();
    const messageEl = document.getElementById('characterMessage');
    
    if (!nickname) {
        messageEl.textContent = '닉네임을 입력해주세요.';
        return;
    }
    
    if (nickname.length < 2 || nickname.length > 10) {
        messageEl.textContent = '닉네임은 2-10자 사이여야 합니다.';
        return;
    }
    
    // 닉네임 중복 검사 (로컬)
    if (isNicknameTaken(nickname)) {
        messageEl.textContent = '이미 사용중인 닉네임입니다.';
        return;
    }
    
    // 캐릭터 생성
    const characterData = {
        nickname: nickname,
        color: {
            body: document.getElementById('bodyColor').value,
            helmet: document.getElementById('helmetColor').value,
            equipment: document.getElementById('equipmentColor').value
        }
    };
    
    // 캐릭터 데이터를 현재 게임에 적용
    if (game && game.player) {
        game.player.character = characterData;
        
        // 사용된 닉네임 저장
        addUsedNickname(nickname);
        
        // 캐릭터 생성 완료
        closeCharacterModal();
        showNotification(`캐릭터 '${nickname}' 생성 완료!`, 'success');
        
        // 게임 시작 (로그인된 상태에서만)
        if (currentUser) {
            // 캔버스 설정 (아직 설정되지 않았다면)
            const canvas = document.getElementById('gameCanvas');
            if (canvas.width === 0 || canvas.height === 0) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            
            // 배경 별 생성 (아직 생성되지 않았다면)
            const existingStars = document.querySelectorAll('.stars');
            if (existingStars.length === 0) {
                createStars();
            }
            
            gameRunning = true;
            if (!game.currentMonster && !game.currentBoss) {
                game.spawnMonster(); // 첫 번째 몬스터 스폰
            }
            gameLoop();
        }
        
        // UI 업데이트
        updateUI();
        updateSkillUI();
    }
}

function isNicknameTaken(nickname) {
    const usedNicknames = JSON.parse(localStorage.getItem('usedNicknames') || '[]');
    return usedNicknames.includes(nickname.toLowerCase());
}

function addUsedNickname(nickname) {
    const usedNicknames = JSON.parse(localStorage.getItem('usedNicknames') || '[]');
    usedNicknames.push(nickname.toLowerCase());
    localStorage.setItem('usedNicknames', JSON.stringify(usedNicknames));
}

// 로그인 강제 시스템
function checkLoginRequired() {
    return !currentUser; // 로그인된 사용자가 없으면 true
}

function enforceLogin() {
    if (checkLoginRequired()) {
        // 게임 루프 중지
        gameRunning = false;
        
        // 로그인 모달 강제 표시
        showLoginModal();
        showNotification('게임을 플레이하려면 로그인이 필요합니다.', 'info');
        return true;
    }
    return false;
}

// 기존 register 함수 수정 - 회원가입 후 바로 캐릭터 생성으로 연결
function register(id, pw) {
    const messageEl = document.getElementById('loginMessage');
    
    // 계정 정보 저장 키
    const accountKey = `account_${id}`;
    const existingAccount = localStorage.getItem(accountKey);
    
    if (existingAccount) {
        messageEl.textContent = '이미 존재하는 아이디입니다.';
        return;
    }
    
    // 새 계정 생성
    const accountData = {
        id: id,
        password: pw,
        createdAt: Date.now()
    };
    
    localStorage.setItem(accountKey, JSON.stringify(accountData));
    
    // 로그인 처리
    currentUser = id;
    updateAccountInfo();
    closeLoginModal();
    
    // 캐릭터 생성 모달 표시
    showCharacterModal();
    showNotification(`${id}님 회원가입 완료! 캐릭터를 생성해주세요.`, 'success');
}

// 기존 loginUser 함수 수정 - 로그인 후 캐릭터 확인
function loginUser(id, pw) {
    const messageEl = document.getElementById('loginMessage');
    
    // 계정 정보 확인
    const accountKey = `account_${id}`;
    const accountData = localStorage.getItem(accountKey);
    
    if (!accountData) {
        messageEl.textContent = '존재하지 않는 아이디입니다.';
        return;
    }
    
    const account = JSON.parse(accountData);
    if (account.password !== pw) {
        messageEl.textContent = '비밀번호가 틀렸습니다.';
        return;
    }
    
    // 로그인 성공
    currentUser = id;
    updateAccountInfo();
    
    // 해당 계정의 게임 데이터 로드
    loadUserGameData(id);
    
    closeLoginModal();
    
    // 캐릭터가 없으면 캐릭터 생성 모달 표시
    if (!game.player.character.nickname) {
        showCharacterModal();
        showNotification(`${id}님 환영합니다! 캐릭터를 생성해주세요.`, 'success');
    } else {
        showNotification(`${id}님 환영합니다!`, 'success');
        // 게임 시작
        gameRunning = true;
        gameLoop();
    }
}

// initGame 함수 수정 - 로그인 강제
function initGame() {
    game = new GameUseCase();
    
    // 로그인 체크
    if (enforceLogin()) {
        return; // 로그인이 필요하면 게임 시작 안함
    }
    
    // 코나미 커맨드 초기화
    const konamiCommand = new KonamiCommand();
    
    game.loadGame();
    
    // 캔버스 설정
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 배경 별 생성
    createStars();
    
    // 게임 루프 시작
    gameRunning = true;
    gameLoop();
    
    // UI 업데이트
    updateUI();
    updateAccountInfo();
    
    // 무기 선택 상태 확인
    checkWeaponSelectionState();
    
    // 자동 저장
    setInterval(() => {
        if (currentUser) {
            saveUserGameData(currentUser);
        } else {
            game.saveGame();
        }
    }, 30000); // 30초마다 저장
}

// 스킬 시스템
class SkillSystem {
    constructor() {
        this.skills = {
            1: {
                id: 1,
                name: 'Missile Strike',
                description: 'Launch a powerful missile at the target',
                mpCost: 25,
                cooldown: 8000, // 8초
                lastUsed: 0,
                type: 'attack'
            },
            2: {
                id: 2,
                name: 'Energy Shield',
                description: 'Create a shield that absorbs 10% of max HP',
                mpCost: 20,
                cooldown: 15000, // 15초
                lastUsed: 0,
                type: 'defense'
            },
            3: {
                id: 3,
                name: 'Planet Destroyer Laser',
                description: 'Ultimate attack that devastates enemies',
                mpCost: 60,
                cooldown: 30000, // 30초
                lastUsed: 0,
                type: 'ultimate'
            }
        };
    }
    
    // 스킬 사용 가능 여부 확인
    canUseSkill(skillId, player) {
        const skill = this.skills[skillId];
        if (!skill) return false;
        
        const now = Date.now();
        const timeSinceLastUse = now - skill.lastUsed;
        
        // 쿨다운 체크
        if (timeSinceLastUse < skill.cooldown) {
            return false;
        }
        
        // MP 체크
        if (player.mp < skill.mpCost) {
            return false;
        }
        
        return true;
    }
    
    // 스킬 사용
    useSkill(skillId, player, game) {
        if (!this.canUseSkill(skillId, player)) {
            const skill = this.skills[skillId];
            if (player.mp < skill.mpCost) {
                showNotification('Not enough MP!', 'info');
            } else {
                const remainingCooldown = Math.ceil((skill.cooldown - (Date.now() - skill.lastUsed)) / 1000);
                showNotification(`Skill on cooldown: ${remainingCooldown}s`, 'info');
            }
            return false;
        }
        
        const skill = this.skills[skillId];
        
        // MP 소모
        player.useMp(skill.mpCost);
        skill.lastUsed = Date.now();
        
        // 스킬별 효과 실행
        switch(skillId) {
            case 1:
                this.castMissileStrike(player, game);
                break;
            case 2:
                this.castEnergyShield(player, game);
                break;
            case 3:
                this.castPlanetDestroyerLaser(player, game);
                break;
        }
        
        showNotification(`${skill.name} activated!`, 'success');
        return true;
    }
    
    // 1번 스킬: 미사일 공격
    castMissileStrike(player, game) {
        const target = game.currentBoss || game.currentMonster;
        if (!target) return;
        
        const damage = Math.floor(player.getTotalPower() * 1.5) + 50; // 1.5배 + 고정 50 데미지
        game.createSkillProjectile(damage, 'missile', target);
    }
    
    // 2번 스킬: 에너지 방어막
    castEnergyShield(player, game) {
        const shieldAmount = Math.floor(player.maxHp * 0.1);
        player.addShield(shieldAmount);
        
        // 방어막 시각 효과
        game.showShieldEffect();
    }
    
    // 3번 스킬: 행성파괴 레이저
    castPlanetDestroyerLaser(player, game) {
        const target = game.currentBoss || game.currentMonster;
        if (!target) return;
        
        const damage = Math.floor(player.getTotalPower() * 3) + 200; // 3배 + 고정 200 데미지
        game.createPlanetDestroyerLaser(damage, target);
    }
    
    // 쿨다운 상태 가져오기
    getCooldownInfo(skillId) {
        const skill = this.skills[skillId];
        if (!skill) return null;
        
        const now = Date.now();
        const timeSinceLastUse = now - skill.lastUsed;
        const remainingCooldown = Math.max(0, skill.cooldown - timeSinceLastUse);
        
        return {
            isReady: remainingCooldown === 0,
            remainingMs: remainingCooldown,
            remainingSeconds: Math.ceil(remainingCooldown / 1000),
            progress: Math.min(1, timeSinceLastUse / skill.cooldown)
        };
    }
}

function updateSkillUI() {
    if (!game || !game.skillSystem) return;
    
    [1, 2, 3].forEach(skillId => {
        const skillBtn = document.getElementById(`skill${skillId}`);
        const cooldownSpan = document.getElementById(`skill${skillId}Cooldown`);
        const skill = game.skillSystem.skills[skillId];
        
        if (!skillBtn || !cooldownSpan || !skill) return;
        
        const canUse = game.skillSystem.canUseSkill(skillId, game.player);
        const cooldownInfo = game.skillSystem.getCooldownInfo(skillId);
        
        // 버튼 활성화/비활성화
        skillBtn.disabled = !canUse;
        
        // 쿨다운 표시
        if (!cooldownInfo.isReady) {
            cooldownSpan.textContent = cooldownInfo.remainingSeconds + 's';
            cooldownSpan.style.color = '#ff6666';
        } else if (game.player.mp < skill.mpCost) {
            cooldownSpan.textContent = 'No MP';
            cooldownSpan.style.color = '#3498db';
        } else {
            cooldownSpan.textContent = 'Ready';
            cooldownSpan.style.color = '#27ae60';
        }
    });
}

// 무기 선택 함수
function selectWeapon(weaponType) {
    if (!game.player) return;
    
    // 무기가 장착되어 있는지 확인
    if (weaponType === 'melee' && !game.player.equipment.lightsaber) {
        showNotification('근접 무기가 장착되어 있지 않습니다!', 'error');
        return;
    }
    
    if (weaponType === 'ranged' && !game.player.equipment.laser) {
        showNotification('원거리 무기가 장착되어 있지 않습니다!', 'error');
        return;
    }
    
    // 무기 타입 변경
    game.player.selectedWeaponType = weaponType;
    
    // UI 업데이트
    updateWeaponSelector();
    
    // 알림 표시
    const weaponName = weaponType === 'melee' ? '근접 무기 (광선검)' : '원거리 무기 (레이저총)';
    showNotification(`${weaponName} 선택됨`, 'success');
    
    // 무기 선택 패널 숨기고 변경 버튼 표시
    hideWeaponSelector();
}

// 무기 선택 UI 업데이트
function updateWeaponSelector() {
    if (!game.player) return;
    
    const meleeRadio = document.getElementById('meleeWeapon');
    const rangedRadio = document.getElementById('rangedWeapon');
    const meleeChoice = meleeRadio?.parentElement?.parentElement;
    const rangedChoice = rangedRadio?.parentElement?.parentElement;
    
    // 라디오 버튼 업데이트
    if (meleeRadio) meleeRadio.checked = game.player.selectedWeaponType === 'melee';
    if (rangedRadio) rangedRadio.checked = game.player.selectedWeaponType === 'ranged';
    
    // 선택 상태 시각적 표시
    if (meleeChoice) {
        meleeChoice.classList.toggle('selected', game.player.selectedWeaponType === 'melee');
    }
    if (rangedChoice) {
        rangedChoice.classList.toggle('selected', game.player.selectedWeaponType === 'ranged');
    }
    
    // 원거리 무기 스탯 업데이트
    const rangedWeapon = game.player.equipment.laser;
    if (rangedWeapon) {
        const accuracySpan = document.getElementById('rangedAccuracy');
        const criticalSpan = document.getElementById('rangedCritical');
        
        if (accuracySpan) accuracySpan.textContent = Math.round(rangedWeapon.accuracy) + '%';
        if (criticalSpan) criticalSpan.textContent = Math.round(rangedWeapon.criticalChance) + '%';
    }
    
    // 무기가 이미 선택되어 있으면 패널 숨기기
    checkWeaponSelectionState();
}

// 무기 선택 상태 확인
function checkWeaponSelectionState() {
    if (!game || !game.player) return;
    
    console.log('Checking weapon selection state...'); // 디버깅용
    console.log('Selected weapon type:', game.player.selectedWeaponType);
    console.log('Has lightsaber:', !!game.player.equipment.lightsaber);
    console.log('Has laser:', !!game.player.equipment.laser);
    
    // 처음 시작할 때는 무기 선택 패널 표시
    // 이미 무기가 선택되어 있으면 변경 버튼만 표시
    const hasWeaponSelected = game.player.selectedWeaponType && 
                              ((game.player.selectedWeaponType === 'melee' && game.player.equipment.lightsaber) ||
                               (game.player.selectedWeaponType === 'ranged' && game.player.equipment.laser));
    
    console.log('Has weapon selected:', hasWeaponSelected); // 디버깅용
    
    if (hasWeaponSelected) {
        hideWeaponSelector();
    } else {
        showWeaponSelector();
    }
}

// 무기 선택 패널 숨기기
function hideWeaponSelector() {
    const weaponSelector = document.getElementById('weaponSelector');
    const weaponChangeBtn = document.getElementById('weaponChangeBtn');
    const weaponChangeBtnInline = document.getElementById('weaponChangeBtnInline');
    
    if (weaponSelector) weaponSelector.style.display = 'none';
    if (weaponChangeBtn) weaponChangeBtn.style.display = 'none'; // 기존 버튼 숨김
    if (weaponChangeBtnInline) {
        weaponChangeBtnInline.style.display = 'inline-block'; // 인라인 버튼 표시
        
        // 현재 선택된 무기 아이콘 업데이트
        const currentWeaponIconInline = document.getElementById('currentWeaponIconInline');
        if (currentWeaponIconInline && game.player) {
            currentWeaponIconInline.textContent = game.player.selectedWeaponType === 'melee' ? '⚔️' : '🔫';
        }
    }
}

// 무기 선택 패널 보이기
function showWeaponSelector() {
    console.log('Showing weapon selector...'); // 디버깅용
    
    const weaponSelector = document.getElementById('weaponSelector');
    const weaponChangeBtn = document.getElementById('weaponChangeBtn');
    const weaponChangeBtnInline = document.getElementById('weaponChangeBtnInline');
    
    console.log('Weapon selector element:', weaponSelector); // 디버깅용
    
    if (weaponSelector) {
        weaponSelector.style.display = 'block';
        console.log('Weapon selector displayed');
    }
    if (weaponChangeBtn) weaponChangeBtn.style.display = 'none';
    if (weaponChangeBtnInline) weaponChangeBtnInline.style.display = 'none';
    
    // UI 업데이트
    updateWeaponSelector();
}
