// ==================== 유즈케이스 ====================

class GameUseCase {
    constructor() {
        this.player = new Player();
        this.monsters = []; // 다중 몬스터 지원
        this.currentBoss = null;
        this.stage = 1;
        this.lastMonsterSpawn = Date.now();
        this.monsterSpawnInterval = 1000; // 1초마다 스폰
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
        
        // 플레이어 위치 (기본 위치 - 브라우저 정가운데)
        this.playerPosition = {
            x: 0.5, // 0.35에서 0.5로 변경 (브라우저 정가운데)
            y: 0.5,
            targetX: 0.5, // 0.35에서 0.5로 변경
            targetY: 0.5,
            moveSpeed: 0.002 // 화면 비율 기준 이동 속도
        };
        
        // 스킬 시스템 (늦은 초기화)
        this.skillSystem = null;
        
        // 플레이어 피격 효과
        this.playerHitEffect = false;
        
        // 자동 포션 사용 설정
        this.autoPotionSettings = {
            enabled: true,
            triggerPercent: 30, // HP 30% 이하일 때 사용
            priority: ['large', 'medium', 'small'] // 큰 포션부터 우선 사용
        };
        
        // 미사일 추적 시스템
        this.activeMissiles = []; // 현재 날아가고 있는 미사일들
        this.missileTargets = new Set(); // 미사일 타겟인 적들
        
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
        // 보스가 있으면 몬스터 스폰하지 않음
        if (this.currentBoss) return;
        
        // 최대 5마리까지만 스폰
        if (this.monsters.length >= 5) return;
        
        // 개선된 몬스터 레벨 계산 (스테이지 + 플레이어 레벨 고려)
        const baseLevel = Math.floor(this.stage * 0.8 + this.player.level * 0.5); // 스테이지 80% + 플레이어 레벨 50%
        const levelVariance = Math.floor(Math.random() * 4) - 1; // -1 ~ +2 변동
        const monsterLevel = Math.max(1, baseLevel + levelVariance);
        
        const monsterName = this.monsterNames[Math.floor(Math.random() * this.monsterNames.length)];
        const newMonster = new Monster(monsterName, monsterLevel, this.stage);
        
        // 공격 타입 랜덤 선택 (근접/원거리)
        newMonster.attackType = Math.random() < 0.5 ? 'melee' : 'ranged';
        
        // 다양한 위치에서 스폰 (캔버스 전체 영역 활용)
        const spawnArea = Math.random();
        if (spawnArea < 0.25) {
            // 상단 스폰
            newMonster.positionX = 0.2 + Math.random() * 0.6; // 0.2 ~ 0.8
            newMonster.positionY = 0.1 + Math.random() * 0.2; // 0.1 ~ 0.3
        } else if (spawnArea < 0.5) {
            // 하단 스폰
            newMonster.positionX = 0.2 + Math.random() * 0.6; // 0.2 ~ 0.8
            newMonster.positionY = 0.7 + Math.random() * 0.2; // 0.7 ~ 0.9
        } else if (spawnArea < 0.75) {
            // 좌측 스폰
            newMonster.positionX = 0.1 + Math.random() * 0.2; // 0.1 ~ 0.3
            newMonster.positionY = 0.2 + Math.random() * 0.6; // 0.2 ~ 0.8
        } else {
            // 우측 스폰
            newMonster.positionX = 0.7 + Math.random() * 0.2; // 0.7 ~ 0.9
            newMonster.positionY = 0.2 + Math.random() * 0.6; // 0.2 ~ 0.8
        }
        newMonster.scale = 1;
        newMonster.alpha = 1;
        
        this.monsters.push(newMonster);
        
        // 첫 번째 몬스터를 현재 몬스터로 설정 (UI 표시용)
        if (!this.currentMonster || this.currentMonster.isDead) {
            this.currentMonster = newMonster;
        }
    }
    
    // 몬스터 스폰 시스템 업데이트
    updateMonsterSpawning() {
        const now = Date.now();
        if (now - this.lastMonsterSpawn > this.monsterSpawnInterval) {
            this.spawnMonster();
            this.lastMonsterSpawn = now;
        }
        
        // 죽은 몬스터 제거
        this.monsters = this.monsters.filter(monster => {
            if (monster.isDead && Date.now() - monster.deathTime > 500) {
                // 현재 몬스터가 제거되는 경우 다른 몬스터로 교체
                if (this.currentMonster === monster) {
                    this.currentMonster = this.monsters.find(m => m !== monster && !m.isDead) || null;
                }
                return false; // 제거
            }
            return true; // 유지
        });
    }

    spawnBoss() {
        const bossName = `${this.planetNames[Math.floor(this.stage / 100) % this.planetNames.length]} 보스`;
        
        // 개선된 보스 레벨 계산 (스테이지 + 플레이어 레벨 고려)
        const bossBaseLevel = Math.floor(this.stage * 0.9 + this.player.level * 0.6); // 스테이지 90% + 플레이어 레벨 60%
        const bossLevel = Math.max(1, bossBaseLevel + Math.floor(Math.random() * 3)); // 0~2 추가 레벨
        
        this.currentBoss = new Boss(bossName, bossLevel, this.stage);
        
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
            if (this.isDead) return false;
            
            // 방어력 적용 (안전한 계산)
            const defense = this.defense || 0; // defense가 undefined인 경우 0으로 처리
            const actualDamage = Math.max(1, damage - defense);
            this.hp = Math.max(0, this.hp - actualDamage); // hp가 음수가 되지 않도록
            
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
        // 살아있는 몬스터가 없으면 종료
        if (!this.monsters || this.monsters.length === 0) return false;
        
        let attackedAnyMonster = false;
        
        // 무기 타입에 따른 다른 공격 전략
        if (this.player.selectedWeaponType === 'melee') {
            // 근접 무기: 가장 가까운 몬스터 1개만 공격
            const nearestMonster = this.findNearestMonsterInRange();
            if (nearestMonster) {
                if (this.performPlayerAttackOnMonster(nearestMonster)) {
                    attackedAnyMonster = true;
                }
            }
        } else if (this.player.selectedWeaponType === 'ranged') {
            // 원거리 무기: 모든 살아있는 몬스터에게 공격
            this.monsters.forEach(monster => {
                if (!monster.isDead && !monster.deathAnimation) {
                    if (this.performPlayerAttackOnMonster(monster)) {
                        attackedAnyMonster = true;
                    }
                }
            });
        }
        
        // 모든 살아있는 몬스터들이 개별적으로 반격
        this.monsters.forEach(monster => {
            if (!monster.isDead && monster.hp > 0 && monster.canAttack()) {
                this.performMonsterAttackFromSpecific(monster);
            }
        });

        // UI 표시용 currentMonster 업데이트 (첫 번째 살아있는 몬스터)
        if (!this.currentMonster || this.currentMonster.isDead) {
            this.currentMonster = this.monsters.find(monster => !monster.isDead) || null;
        }

        return attackedAnyMonster;
    }

    // 특정 몬스터에 대한 플레이어 공격 수행
    performPlayerAttackOnMonster(targetMonster) {
        if (!targetMonster) return false;
        
        // 미사일 타겟인 경우 일반 공격 금지
        if (this.isMissileTarget(targetMonster)) {
            return false; // 미사일이 날아가고 있는 타겟에게는 공격하지 않음
        }

        let attacked = false;

        // 선택된 무기 타입에 따른 공격
        if (this.player.selectedWeaponType === 'melee') {
            // 근접 무기 공격 (광선검) - 가장 가까운 몬스터만 공격
            if (this.player.equipment.lightsaber) {
                // 모든 몬스터 중 가장 가까운 것을 찾아서 공격
                const nearestMonster = this.findNearestMonsterInRange();
                if (nearestMonster && nearestMonster === targetMonster) {
                    const swordDamage = Math.floor(this.player.getWeaponPower() * 0.5) + Math.floor(Math.random() * 10) + 15;
                    this.performMeleeAttack(swordDamage, targetMonster);
                    attacked = true;
                }
            }
        } else if (this.player.selectedWeaponType === 'ranged') {
            // 원거리 무기 공격 (레이저총) - 모든 몬스터에게 공격 가능
            if (this.player.equipment.laser) {
                this.performRangedAttackOnMonster(targetMonster);
                attacked = true;
            }
        }

        return attacked;
    }

    // 근접 공격 범위 내의 가장 가까운 몬스터 찾기
    findNearestMonsterInRange() {
        const meleeRange = 0.1; // 근접 공격 범위
        let nearestMonster = null;
        let nearestDistance = Infinity;
        
        this.monsters.forEach(monster => {
            if (!monster.isDead && !monster.deathAnimation) {
                const distance = this.getDistanceToTarget(monster);
                if (distance <= meleeRange && distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestMonster = monster;
                }
            }
        });
        
        return nearestMonster;
    }

    // 특정 몬스터에 대한 원거리 공격
    performRangedAttackOnMonster(target) {
        const weapon = this.player.equipment.laser;
        if (!weapon) return;
        
        // 사정거리 체크
        const distance = this.getDistanceToTarget(target);
        const maxRange = 0.4; // 원거리 무기 최대 사정거리
        if (distance > maxRange) {
            // 사정거리 밖이면 공격하지 않음
            return;
        }
        
        // 명중률 체크
        const hitChance = Math.random() * 100;
        if (hitChance > weapon.accuracy) {
            // 명중 실패 - 몬스터 위에 Miss 텍스트 표시
            this.showMissText(target);
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
        
        // 특정 몬스터를 타겟으로 하는 투사체 생성
        this.createPlayerProjectileToMonster(damage, isCritical, target);
    }

    // 특정 몬스터를 타겟으로 하는 투사체 생성
    createPlayerProjectileToMonster(damage, isCritical, targetMonster) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x + 20;
        const startY = canvas.height * this.playerPosition.y;
        
        const targetX = canvas.width * targetMonster.positionX;
        const targetY = canvas.height * targetMonster.positionY;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'laser', 20);
        projectile.isCritical = isCritical;
        projectile.targetMonster = targetMonster; // 특정 몬스터 타겟 설정
        projectile.targetBoss = null; // 보스가 아님을 명시
        this.projectiles.push(projectile);
        
        // 치명타 시 특별한 알림
        if (isCritical) {
            showNotification(`Critical Hit! ${damage} damage!`, 'success');
        }
    }

    // 특정 몬스터의 반격
    performMonsterAttackFromSpecific(monster) {
        const attackData = monster.performAttack();
        
        if (attackData.damage <= 0) return; // 공격하지 않는 경우
        
        if (attackData.type === 'melee') {
            // 근접 공격 - 빠른 근접 투사체
            this.createMonsterMeleeAttackFromSpecific(attackData.damage, monster);
        } else {
            // 원거리 공격 - 투사체 생성
            this.createMonsterProjectileFromSpecific(attackData.damage, monster);
        }
    }

    createMonsterMeleeAttackFromSpecific(damage, monster) {
        const canvas = document.getElementById('gameCanvas');
        
        const startX = canvas.width * monster.positionX;
        const startY = canvas.height * monster.positionY;
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        // 몬스터 근접 공격은 빠른 속도
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'monster_melee', 20);
        this.monsterProjectiles.push(projectile);
    }

    createMonsterProjectileFromSpecific(damage, monster) {
        const canvas = document.getElementById('gameCanvas');
        
        const startX = canvas.width * monster.positionX;
        const startY = canvas.height * monster.positionY;
        const targetX = canvas.width * this.playerPosition.x;
        const targetY = canvas.height * this.playerPosition.y;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'fireball', 10);
        this.monsterProjectiles.push(projectile);
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
        
        // 사정거리 체크
        const distance = this.getDistanceToTarget(target);
        const maxRange = 0.4; // 원거리 무기 최대 사정거리
        if (distance > maxRange) {
            // 사정거리 밖이면 공격하지 않음
            return;
        }
        
        // 명중률 체크
        const hitChance = Math.random() * 100;
        if (hitChance > weapon.accuracy) {
            // 명중 실패 - 몬스터 위에 Miss 텍스트 표시
            this.showMissText(target);
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
    
    showMissText(target) {
        if (!target) return;
        
        const canvas = document.getElementById('gameCanvas');
        const x = canvas.width * target.positionX;
        const y = canvas.height * target.positionY - 30; // 몬스터 위쪽
        
        // Miss 텍스트 객체 생성
        const missText = {
            x: x,
            y: y,
            text: 'Miss',
            startTime: Date.now(),
            duration: 1000, // 1초간 표시
            color: '#888888',
            fontSize: 16
        };
        
        // 기존 missTexts 배열이 없으면 생성
        if (!this.missTexts) {
            this.missTexts = [];
        }
        
        this.missTexts.push(missText);
    }

    createMeleeAttack(damage) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x + 20; // 동적 플레이어 위치 사용
        const startY = canvas.height * this.playerPosition.y; // 동적 플레이어 위치 사용
        
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
        projectile.targetMonster = this.currentMonster; // 타깃 몬스터 정보 추가
        projectile.targetBoss = this.currentBoss; // 타깃 보스 정보 추가
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
        projectile.targetMonster = this.currentMonster; // 타깃 몬스터 정보 추가
        projectile.targetBoss = this.currentBoss; // 타깃 보스 정보 추가
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

    dealDamageToSpecificMonster(monster, damage) {
        if (!monster || monster.isDead) return false;

        const isDead = monster.takeDamage(damage);

        if (isDead) {
            // 죽은 몬스터 정보를 로컬 변수에 저장 (레이스 컨디션 방지)
            const deadMonster = monster;
            
            // 사망 애니메이션이 끝난 후 몬스터 처리
            setTimeout(() => {
                // 저장된 몬스터 참조 사용
                this.player.gainExperience(deadMonster.experience);
                this.player.gold += deadMonster.gold;
                
                // 퀘스트 업데이트
                this.updateQuest('kill', 1);
                this.updateQuest('gold', deadMonster.gold);
                this.updateQuest('exp', deadMonster.experience);

                // 장비 드롭 확률
                if (Math.random() < 0.3) {
                    this.dropEquipment();
                }
                
                // HP 포션 드롭 확률 (15%)
                if (Math.random() < 0.15) {
                    this.dropHealthPotion(false);
                }

                // 현재 몬스터가 죽은 몬스터와 같다면 초기화
                if (this.currentMonster === deadMonster) {
                    this.currentMonster = null;
                }
                
                // 새 몬스터 스폰
                this.spawnMonster();
            }, 500); // 사망 애니메이션 시간과 동일
        }
        
        return isDead;
    }

    // 기존 dealDamageToMonster 함수는 호환성을 위해 유지
    dealDamageToMonster(damage) {
        if (!this.currentMonster) return;
        return this.dealDamageToSpecificMonster(this.currentMonster, damage);
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
            // 좌표 안전성 검사 - 무효한 좌표가 있으면 투사체 제거
            if (!isFinite(projectile.x) || !isFinite(projectile.y) || 
                !isFinite(projectile.velocityX) || !isFinite(projectile.velocityY)) {
                console.warn('Invalid projectile coordinates detected, removing:', projectile);
                return false; // 투사체 제거
            }
            
            const hit = projectile.update();
            if (hit) {
                let target = null;
                let canDealDamage = false;
                
                // 투사체의 타깃이 여전히 유효한지 확인
                if (projectile.targetBoss && projectile.targetBoss === this.currentBoss && !this.currentBoss.isDead) {
                    target = this.currentBoss;
                    canDealDamage = true;
                } else if (projectile.targetMonster && !projectile.targetMonster.isDead && 
                          this.monsters.includes(projectile.targetMonster)) {
                    target = projectile.targetMonster;
                    canDealDamage = true;
                }
                
                // 타깃이 유효할 때만 데미지 적용
                if (canDealDamage && target) {
                    if (target === this.currentBoss) {
                        this.dealDamageToBoss(projectile.damage);
                    } else {
                        this.dealDamageToSpecificMonster(target, projectile.damage);
                    }
                    
                    // 미사일 스킬 피격 시 특별한 폭발 이펙트
                    if (projectile.type === 'missile' && target) {
                        this.createMissileExplosionEffect(target);
                    }
                }
                
                return false; // 투사체 제거
            }
            return projectile.active;
        });

        // 몬스터 투사체 업데이트
        this.monsterProjectiles = this.monsterProjectiles.filter(projectile => {
            // 좌표 안전성 검사 - 무효한 좌표가 있으면 투사체 제거
            if (!isFinite(projectile.x) || !isFinite(projectile.y) || 
                !isFinite(projectile.velocityX) || !isFinite(projectile.velocityY)) {
                console.warn('Invalid monster projectile coordinates detected, removing:', projectile);
                return false; // 투사체 제거
            }
            
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
        
        // 미사일 타겟인 경우 일반 공격 금지
        if (this.isMissileTarget(this.currentBoss)) {
            return; // 미사일이 날아가고 있는 타겟에게는 공격하지 않음
        }

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
        
        // 사정거리 체크
        const distance = this.getDistanceToTarget(target);
        const maxRange = 0.4; // 원거리 무기 최대 사정거리
        if (distance > maxRange) {
            // 사정거리 밖이면 공격하지 않음
            return;
        }
        
        // 명중률 체크
        const hitChance = Math.random() * 100;
        if (hitChance > weapon.accuracy) {
            // 명중 실패
            this.showMissText(target);
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
        const startX = canvas.width * this.playerPosition.x + 20; // 동적 플레이어 위치 사용
        const startY = canvas.height * this.playerPosition.y; // 동적 플레이어 위치 사용
        const targetX = canvas.width * 0.65;
        const targetY = canvas.height * 0.5;

        // 광선검은 훨씬 빠른 속도 (근접 공격이므로)
        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'lightsaber', 25);
        projectile.targetBoss = this.currentBoss; // 타깃 보스 정보 추가
        this.projectiles.push(projectile);
        
        // 치명타 시 특별한 알림
        if (isCritical) {
            showNotification(`Critical Hit! ${damage} damage!`, 'success');
        }
    }

    createPlayerProjectileForBoss(damage, isCritical = false) {
        const canvas = document.getElementById('gameCanvas');
        const startX = canvas.width * this.playerPosition.x + 20;
        const startY = canvas.height * this.playerPosition.y;
        const targetX = canvas.width * 0.65;
        const targetY = canvas.height * 0.5;

        const projectile = new Projectile(startX, startY, targetX, targetY, damage, 'laser', 20);
        projectile.isCritical = isCritical; // 치명타 정보 추가
        projectile.targetBoss = this.currentBoss; // 타깃 보스 정보 추가
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
            // 죽은 보스 정보를 로컬 변수에 저장 (레이스 컨디션 방지)
            const deadBoss = this.currentBoss;
            
            // 보스 사망 애니메이션이 끝난 후 처리
            setTimeout(() => {
                // 저장된 보스 참조 사용
                this.player.gainExperience(deadBoss.experience);
                this.player.gold += deadBoss.gold;
                
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
        if (!target) return Infinity;
        
        // 플레이어와 타겟의 위치를 비율로 계산
        const playerX = this.playerPosition.x;
        const playerY = this.playerPosition.y;
        
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = 0.65;
            targetY = 0.5;
        } else {
            targetX = target.positionX;
            targetY = target.positionY;
        }
        
        const dx = targetX - playerX;
        const dy = targetY - playerY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 근접 공격 가능 여부 확인 (비율 기준)
    canUseMeleeAttack(target) {
        const distance = this.getDistanceToTarget(target);
        return distance <= 0.1; // 화면 비율 기준 10% 거리 내에서 근접 공격 가능 (0.2에서 0.1로 변경)
    }
    
    // 실제 근접 공격 수행 (즉시 데미지 + 이펙트)
    performMeleeAttack(damage, target) {
        if (!target) return;
        
        // 근접 공격 애니메이션 시작
        this.startSaberSwingAnimation();
        
        // 데미지 적용
        let isDead = false;
        if (target === this.currentBoss) {
            isDead = this.dealDamageToBoss(damage);
        } else {
            isDead = this.dealDamageToSpecificMonster(target, damage);
        }
        
        // 근접 공격 이펙트
        this.showMeleeEffect(target);
        
        return isDead;
    }
    
    // 광선검 휘두르기 애니메이션 시작
    startSaberSwingAnimation() {
        this.saberSwingAnimation = {
            startTime: Date.now(),
            duration: 400, // 0.4초 동안
            active: true
        };
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
        if (!target) {
            // 타겟이 없으면 중앙으로 복귀
            this.playerPosition.targetX = 0.5;
            this.playerPosition.targetY = 0.5;
        } else {
            // 타겟의 위치 계산
            let targetX, targetY;
            if (target === this.currentBoss) {
                targetX = 0.65; // 보스 위치
                targetY = 0.5;
            } else {
                targetX = target.positionX;
                targetY = target.positionY;
            }
            
            // 근접 무기 선택 시에만 몬스터에게 접근
            if (this.player.selectedWeaponType === 'melee' && this.player.equipment.lightsaber) {
                const dx = targetX - this.playerPosition.x;
                const dy = targetY - this.playerPosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0.08) { // 근접 공격 범위를 더 짧게 (0.15에서 0.08로 변경)
                    // 타겟 방향으로 접근 (매우 가까운 거리 유지)
                    this.playerPosition.targetX = targetX - (dx / distance) * 0.06; // 더 가까이 접근 (0.12에서 0.06으로 변경)
                    this.playerPosition.targetY = targetY - (dy / distance) * 0.06;
                } else {
                    // 근접 범위 내에 있으면 현재 위치 유지
                    this.playerPosition.targetX = this.playerPosition.x;
                    this.playerPosition.targetY = this.playerPosition.y;
                }
            } else if (this.player.selectedWeaponType === 'ranged' && this.player.equipment.laser) {
                // 원거리 무기도 사정거리 제한 적용
                const dx = targetX - this.playerPosition.x;
                const dy = targetY - this.playerPosition.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxRange = 0.4; // 원거리 무기 최대 사정거리
                const optimalRange = 0.3; // 최적 사정거리
                
                if (distance > maxRange) {
                    // 사정거리 밖이면 접근
                    this.playerPosition.targetX = targetX - (dx / distance) * optimalRange;
                    this.playerPosition.targetY = targetY - (dy / distance) * optimalRange;
                } else {
                    // 사정거리 내에 있으면 중앙에서 약간 이동하여 위치 조정
                    this.playerPosition.targetX = 0.5 + (dx / distance) * 0.1;
                    this.playerPosition.targetY = 0.5 + (dy / distance) * 0.1;
                }
            } else {
                // 무기가 없으면 중앙 위치 유지
                this.playerPosition.targetX = 0.5;
                this.playerPosition.targetY = 0.5;
            }
        }
        
        // 현재 위치에서 목표 위치로 부드럽게 이동 - 안전성 검사 포함
        const moveX = this.playerPosition.targetX - this.playerPosition.x;
        const moveY = this.playerPosition.targetY - this.playerPosition.y;
        
        // 좌표와 이동값 유효성 검사
        if (isFinite(moveX) && isFinite(moveY) && 
            isFinite(this.playerPosition.x) && isFinite(this.playerPosition.y) && 
            isFinite(this.playerPosition.targetX) && isFinite(this.playerPosition.targetY)) {
            
            const newX = this.playerPosition.x + moveX * this.playerPosition.moveSpeed * 60;
            const newY = this.playerPosition.y + moveY * this.playerPosition.moveSpeed * 60;
            
            // 새로운 위치 유효성 검사 및 범위 제한
            if (isFinite(newX) && isFinite(newY)) {
                this.playerPosition.x = Math.max(0, Math.min(1, newX)); // 0-1 범위로 제한
                this.playerPosition.y = Math.max(0, Math.min(1, newY)); // 0-1 범위로 제한
            } else {
                console.warn('Invalid player position calculated, keeping current position');
            }
        } else {
            console.warn('Invalid player movement parameters, resetting to center');
            this.playerPosition.x = 0.5;
            this.playerPosition.y = 0.5;
            this.playerPosition.targetX = 0.5;
            this.playerPosition.targetY = 0.5;
        }
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
            
            // 게임 로드 후 퀘스트 상태 체크 (레벨, 골드 등 현재 상태와 동기화)
            this.checkQuestStatus();
            
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
        stopGameLoop();
        
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
            startGameLoop();
            
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
            
            // 타깃 정보 추가
            if (target === this.currentBoss) {
                projectile.targetBoss = this.currentBoss;
            } else {
                projectile.targetMonster = target;
            }
            
            this.projectiles.push(projectile);
            
            // 활성 미사일 목록에 추가
            this.activeMissiles.push(projectile);
        } else {
            const projectile = new Projectile(startX, startY, targetX, targetY, damage, type, 15);
            projectile.isSkill = true;
            
            // 타깃 정보 추가
            if (target === this.currentBoss) {
                projectile.targetBoss = this.currentBoss;
            } else {
                projectile.targetMonster = target;
            }
            
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
        if (!this.skillEffects) this.skillEffects = [];
        
        this.skillEffects = this.skillEffects.filter(effect => {
            const elapsed = Date.now() - effect.startTime;
            return elapsed < effect.duration;
        });
    }
    
    updateMissTexts() {
        if (!this.missTexts) this.missTexts = [];
        
        // 오래된 Miss 텍스트 제거
        this.missTexts = this.missTexts.filter(missText => {
            const elapsed = Date.now() - missText.startTime;
            return elapsed < missText.duration;
        });
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
        
        // 타겟 위치 계산 - 안전성 검사 포함
        let targetX, targetY;
        if (target === this.currentBoss) {
            targetX = canvas.width * 0.65;
            targetY = canvas.height * 0.5;
        } else if (target && isFinite(target.positionX) && isFinite(target.positionY)) {
            targetX = canvas.width * target.positionX;
            targetY = canvas.height * target.positionY;
        } else {
            console.warn('Invalid target position for body slam:', target);
            // 기본 위치로 설정
            targetX = canvas.width * 0.7;
            targetY = canvas.height * 0.5;
        }
        
        // 플레이어 원래 위치 - 안전성 검사 포함
        const originalX = canvas.width * this.playerPosition.x;
        const originalY = canvas.height * this.playerPosition.y;
        
        // 좌표 유효성 최종 검사
        if (!isFinite(targetX) || !isFinite(targetY) || !isFinite(originalX) || !isFinite(originalY)) {
            console.warn('Invalid coordinates for body slam, cancelling:', { targetX, targetY, originalX, originalY });
            return;
        }
        
        // 몸통박치기 애니메이션 데이터
        this.bodySlamAnimation = {
            startTime: Date.now(),
            duration: 1000, // 2초에서 1초로 변경 (2배 빠르게)
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
        
        // 고정 데미지 5 (0.5초 후 적용으로 변경)
        setTimeout(() => {
            if (target === this.currentBoss) {
                this.dealDamageToBoss(5);
            } else if (target === this.currentMonster) {
                this.dealDamageToSpecificMonster(target, 5);
            }
            
            // 넉백 효과 시작
            this.createKnockbackEffect(target);
        }, 500); // 1초에서 0.5초로 변경 (2배 빠르게)
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
        if (elapsed < 500) {
            // 0-0.5초: 돌진 단계 (1초에서 0.5초로 변경)
            const rushProgress = elapsed / 500; // 1000에서 500으로 변경
            const easeOut = 1 - Math.pow(1 - rushProgress, 3); // 감속 곡선
            
            animation.currentX = animation.originalX + (animation.targetX - animation.originalX) * easeOut;
            animation.currentY = animation.originalY + (animation.targetY - animation.originalY) * easeOut;
            animation.phase = 'rush';
        } else if (elapsed < 600) {
            // 0.5-0.6초: 충격 단계 (1-1.2초에서 0.5-0.6초로 변경)
            animation.phase = 'impact';
        } else {
            // 0.6-1초: 복귀 단계 (1.2-2초에서 0.6-1초로 변경)
            const returnProgress = (elapsed - 600) / 400; // (elapsed - 1200) / 800에서 (elapsed - 600) / 400으로 변경
            const easeIn = Math.pow(returnProgress, 2); // 가속 곡선
            
            animation.currentX = animation.targetX + (animation.originalX - animation.targetX) * easeIn;
            animation.currentY = animation.targetY + (animation.originalY - animation.targetY) * easeIn;
            animation.phase = 'return';
        }
    }
    
    // 광선검 휘두르기 애니메이션 업데이트
    updateSaberSwingAnimation() {
        if (!this.saberSwingAnimation || !this.saberSwingAnimation.active) return;
        
        const animation = this.saberSwingAnimation;
        const elapsed = Date.now() - animation.startTime;
        
        if (elapsed >= animation.duration) {
            // 애니메이션 종료
            this.saberSwingAnimation = null;
        }
    }
    
    // 미사일 타겟 관리 메서드들
    addMissileTarget(target) {
        this.missileTargets.add(target);
    }
    
    removeMissileTarget(target) {
        this.missileTargets.delete(target);
    }
    
    isMissileTarget(target) {
        return this.missileTargets.has(target);
    }
    
    // 미사일 추적 시스템 업데이트
    updateMissileTracking() {
        // 비활성화된 미사일들을 activeMissiles에서 제거
        this.activeMissiles = this.activeMissiles.filter(missile => missile.active);
        
        // 타겟이 죽었거나 해당 미사일이 없으면 타겟 목록에서 제거
        const targetsToRemove = [];
        this.missileTargets.forEach(target => {
            if (target.isDead || target.hp <= 0) {
                targetsToRemove.push(target);
            } else {
                // 해당 타겟을 향한 활성 미사일이 있는지 확인
                const hasMissile = this.activeMissiles.some(missile => 
                    missile.targetMonster === target || missile.targetBoss === target
                );
                if (!hasMissile) {
                    targetsToRemove.push(target);
                }
            }
        });
        
        targetsToRemove.forEach(target => this.removeMissileTarget(target));
    }
}

// ==================== 게임 인스턴스 및 루프 ====================

let game;
let gameRunning = false;

// 게임 루프 시작/정지 관리
let gameLoopInterval = null;
let gameLoopRequestId = null;

function startGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    if (gameLoopRequestId) {
        cancelAnimationFrame(gameLoopRequestId);
    }
    
    // 이중 루프 시스템: setInterval로 게임 로직, requestAnimationFrame으로 렌더링
    // setInterval로 게임 로직 실행 (브라우저 포커스 아웃 상태에서도 지속)
    gameLoopInterval = setInterval(() => {
        if (!gameRunning) return;
        
        // 몬스터 스폰 시스템 업데이트
        game.updateMonsterSpawning();
        
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
        
        // Miss 텍스트 업데이트
        game.updateMissTexts();
        
        // 미사일 추적 시스템 업데이트
        game.updateMissileTracking();
        
        // 몸통박치기 애니메이션 업데이트
        game.updateBodySlamAnimation();
        
        // 광선검 휘두르기 애니메이션 업데이트
        game.updateSaberSwingAnimation();
        
        // 몬스터 효과 업데이트
        if (game.currentMonster) {
            game.currentMonster.updateEffects();
        }
        if (game.currentBoss) {
            game.currentBoss.updateEffects();
        }
        
        // 자동 전투 (0.6초마다)
        if (Date.now() - game.lastAttackTime > 600) {
            game.lastAttackTime = Date.now();
            let combatResult = false;
            if (game.currentBoss) {
                combatResult = game.attackBoss();
            } else {
                combatResult = game.attackMonster();
            }
        }
        
        // 플레이 시간 증가 (1초마다)
        if (Date.now() - (game.lastTimeUpdate || 0) > 1000) {
            game.player.playTime += 1;
            game.lastTimeUpdate = Date.now();
        }
        
        // UI 업데이트 (덜 자주 업데이트로 성능 최적화)
        if (Date.now() - (game.lastUIUpdate || 0) > 100) {
            updateUI();
            game.lastUIUpdate = Date.now();
        }
    }, 16); // 60fps (16ms마다 실행)
    
    // requestAnimationFrame으로 렌더링 (부드러운 애니메이션)
    function renderLoop() {
        if (gameRunning) {
            drawGame();
            gameLoopRequestId = requestAnimationFrame(renderLoop);
        }
    }
    renderLoop();
}

function stopGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
    }
    if (gameLoopRequestId) {
        cancelAnimationFrame(gameLoopRequestId);
        gameLoopRequestId = null;
    }
}

// 브라우저 Visibility API 처리 (포커스 아웃 시에도 게임 지속)
document.addEventListener('visibilitychange', function() {
    // 탭이 비활성화되어도 게임 로직은 계속 실행
    // 단지 알림만 표시
    if (document.hidden) {
        console.log('Game continues running in background');
    } else {
        console.log('Game tab is active again');
        // 탭이 다시 활성화되면 UI 즉시 업데이트
        if (typeof updateUI === 'function') {
            updateUI();
        }
    }
});

// 윈도우 포커스 이벤트 처리
window.addEventListener('blur', function() {
    // 윈도우가 포커스를 잃어도 게임 계속 진행
    console.log('Window lost focus, but game continues');
});

window.addEventListener('focus', function() {
    // 윈도우가 포커스를 다시 얻으면 UI 업데이트
    console.log('Window regained focus');
    if (typeof updateUI === 'function') {
        updateUI();
    }
});

// createStars 함수는 rendering.js로 이동

// 렌더링 함수들은 rendering.js로 이동

// 모든 draw* 함수들은 rendering.js로 이동

// 투사체 그리기
function drawProjectiles(ctx, canvas) {
    // 플레이어 투사체 그리기
    game.projectiles.forEach(projectile => {
        if (projectile.active) {
            // 좌표 안전성 검사 - NaN이나 Infinity 체크
            if (!isFinite(projectile.x) || !isFinite(projectile.y)) {
                console.warn('Invalid projectile coordinates:', projectile);
                projectile.active = false; // 비활성화하여 제거
                return;
            }
            
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
            // 좌표 안전성 검사 - NaN이나 Infinity 체크
            if (!isFinite(projectile.x) || !isFinite(projectile.y)) {
                console.warn('Invalid monster projectile coordinates:', projectile);
                projectile.active = false; // 비활성화하여 제거
                return;
            }
            
            ctx.beginPath();
            
            if (projectile.type === 'fireball') {
                // 파이어볼 투사체
                ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
                
                // 그라데이션 효과 - 좌표 유효성 재검증
                if (isFinite(projectile.x) && isFinite(projectile.y)) {
                    const gradient = ctx.createRadialGradient(
                        projectile.x, projectile.y, 0,
                        projectile.x, projectile.y, 4
                    );
                    gradient.addColorStop(0, '#ffff00');
                    gradient.addColorStop(0.5, '#ff6600');
                    gradient.addColorStop(1, '#ff0000');
                    
                    ctx.fillStyle = gradient;
                } else {
                    // 폴백 색상
                    ctx.fillStyle = '#ff6600';
                }
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
                
                // 보스 투사체 그라데이션 효과 - 좌표 유효성 재검증
                if (isFinite(projectile.x) && isFinite(projectile.y)) {
                    const gradient = ctx.createRadialGradient(
                        projectile.x, projectile.y, 0,
                        projectile.x, projectile.y, 6
                    );
                    gradient.addColorStop(0, '#ffffff');
                    gradient.addColorStop(0.3, '#9b59b6');
                    gradient.addColorStop(1, '#2c3e50');
                    
                    ctx.fillStyle = gradient;
                } else {
                    // 폴백 색상
                    ctx.fillStyle = '#9b59b6';
                }
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

// 윈도우 리사이즈 처리
window.addEventListener('resize', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 게임 시작은 캐릭터 생성 후에만 수행됨


// 기존 모달 이벤트는 아래 계정 시스템에서 통합 관리됨 

// 계정 관리 함수들은 auth.js에서 관리됩니다.

// 페이지 종료 시 저장 로직
window.addEventListener('beforeunload', () => {
    if (game) {
        game.saveGame();
    }
});

// 모달 배경 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (e.target.id === 'equipmentModal') {
        closeEquipmentModal();
    }
    if (e.target.id === 'rankingModal') {
        closeRanking();
    }
});

// initGame 함수 수정 - 로그인 강제 제거
window.initGame = function initGame() {
    window.game = game = new GameUseCase();
    
    // 코나미 커맨드 초기화 (게임 인스턴스에 저장)
    game.konamiCommand = new KonamiCommand();
    
    game.loadGame();
    
    // 캔버스 설정
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 배경 별 생성
    createStars();
    
    // 게임 루프 시작 (브라우저 포커스 아웃 상태에서도 지속)
    gameRunning = true;
    startGameLoop();
    
    // UI 업데이트
    updateUI();
    
    // 자동 저장 (더 안정적인 자동 저장)
    setInterval(() => {
        if (game && typeof game.saveGame === 'function') {
            game.saveGame();
        }
    }, 30000); // 30초마다 저장
    
    // 게임이 정상적으로 실행되고 있음을 알리는 로그
    console.log('Game initialized and running - continues even when browser tab is inactive');
    
    // 브라우저가 비활성화되어도 게임 로직이 계속 실행되도록 보장
    // 추가 보호 장치: 1분마다 게임 상태 확인
    setInterval(() => {
        if (gameRunning && game) {
            // 게임이 실행 중이지만 루프가 멈춘 경우 재시작
            if (!gameLoopInterval) {
                console.log('Game loop was stopped, restarting...');
                startGameLoop();
            }
        }
    }, 60000); // 1분마다 확인
}

// 무기 선택 관련 함수들은 weapon.js에서 관리됩니다.
