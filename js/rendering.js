// 렌더링 관련 함수들

// 배경 별 생성
function createStars() {
    const container = document.getElementById('gameContainer');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'stars';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}

// 게임 화면 그리기
function drawGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 행성 그리기
    drawPlanets(ctx, canvas);
    
    // 플레이어 그리기
    drawPlayer(ctx, canvas);
    
    // 몬스터/보스 그리기
    if (game.currentBoss) {
        drawBoss(ctx, canvas);
    } else if (game.monsters && game.monsters.length > 0) {
        // 모든 살아있는 몬스터들 그리기
        game.monsters.forEach(monster => {
            if (!monster.isDead) {
                drawMonsterFromArray(ctx, canvas, monster);
            }
        });
    }
    
    // 투사체 그리기
    drawProjectiles(ctx, canvas);
    
    // 근접 공격 이펙트 그리기
    drawMeleeEffects(ctx, canvas);
    
    // 스킬 이펙트 그리기
    drawSkillEffects(ctx, canvas);
    
    // 몸통박치기 이펙트 그리기
    drawBodySlamEffect(ctx, canvas);
}

// 행성 그리기
function drawPlanets(ctx, canvas) {
    const planetCount = Math.min(5, Math.floor(game.stage / 20) + 1);
    for (let i = 0; i < planetCount; i++) {
        // 행성을 UI와 겹치지 않게 배치 (상단 20% 영역에 배치)
        const x = (canvas.width * 0.8 / planetCount) * i + canvas.width * 0.15;
        const y = canvas.height * 0.15 + Math.sin(Date.now() * 0.001 + i) * 30;
        const radius = 15 + (game.stage % 100) * 0.4;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(game.stage * 10 + i * 60) % 360}, 70%, 60%)`;
        ctx.fill();
        
        // 행성 윤곽선
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

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

// 몬스터 그리기 (배열용)
function drawMonsterFromArray(ctx, canvas, monster) {
    if (!monster) return;
    
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
    let size = (35 + monster.level * 3) * monster.scale; // 크기를 더 크게 조정
    
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