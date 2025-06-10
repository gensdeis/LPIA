// SkillSystem 클래스 - 스킬 관련 로직
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
                if (typeof showNotification === 'function') {
                    showNotification('Not enough MP!', 'info');
                }
            } else {
                const remainingCooldown = Math.ceil((skill.cooldown - (Date.now() - skill.lastUsed)) / 1000);
                if (typeof showNotification === 'function') {
                    showNotification(`Skill on cooldown: ${remainingCooldown}s`, 'info');
                }
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
        
        if (typeof showNotification === 'function') {
            showNotification(`${skill.name} activated!`, 'success');
        }
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

// 스킬 UI 업데이트 함수
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