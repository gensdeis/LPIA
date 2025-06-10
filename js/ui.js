// UI 관련 함수들 - 알림, 모달, UI 업데이트 등

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#4a90e2'};
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

// 데미지 숫자 표시
function showDamageNumber(x, y, damage) {
    const damageElement = document.createElement('div');
    damageElement.className = 'damage-number';
    damageElement.textContent = damage;
    damageElement.style.left = x + 'px';
    damageElement.style.top = y + 'px';
    damageElement.style.color = damage > 100 ? '#ff4444' : '#ff6b6b';
    
    document.body.appendChild(damageElement);
    
    setTimeout(() => {
        if (damageElement.parentNode) {
            damageElement.parentNode.removeChild(damageElement);
        }
    }, 1000);
}

// UI 업데이트
function updateUI() {
    if (!game || !game.player) return;
    
    // 플레이어 정보 업데이트
    document.getElementById('level').textContent = game.player.level;
    document.getElementById('hpText').textContent = `${Math.max(0, game.player.hp)}/${game.player.maxHp}`;
    document.getElementById('mpText').textContent = `${Math.max(0, game.player.mp)}/${game.player.maxMp}`;
    document.getElementById('gold').textContent = game.player.gold;
    document.getElementById('power').textContent = game.player.getWeaponPower();
    document.getElementById('defense').textContent = game.player.getTotalDefense();
    
    // 방어막 정보 표시
    if (game.player.shield > 0) {
        document.getElementById('shieldText').textContent = `${game.player.shield}/${game.player.maxShield}`;
        document.getElementById('shieldBar').style.width = `${(game.player.shield / game.player.maxShield) * 100}%`;
        document.getElementById('shieldInfo').style.display = 'block';
    } else {
        document.getElementById('shieldInfo').style.display = 'none';
    }
    
    // HP/MP 바 업데이트
    const hpPercent = (game.player.hp / game.player.maxHp) * 100;
    const mpPercent = (game.player.mp / game.player.maxMp) * 100;
    document.getElementById('hpBar').style.width = hpPercent + '%';
    document.getElementById('mpBar').style.width = mpPercent + '%';
    
    // 경험치 바 업데이트
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
    if (typeof updateSkillUI === 'function') {
        updateSkillUI();
    }
    
    // 무기 선택 UI 업데이트
    if (typeof updateWeaponSelector === 'function') {
        updateWeaponSelector();
    }
}

// 퀘스트 UI 업데이트
function updateQuestUI() {
    const questList = document.getElementById('questList');
    questList.innerHTML = '';
    
    game.quests.forEach(quest => {
        const questElement = document.createElement('div');
        questElement.className = 'quest-item';
        questElement.style.cssText = `
            margin: 5px 0;
            padding: 8px;
            background: rgba(74, 144, 226, 0.1);
            border: 1px solid rgba(74, 144, 226, 0.3);
            border-radius: 4px;
            font-size: 11px;
        `;
        
        const progress = Math.min(quest.current, quest.target);
        const progressPercent = (progress / quest.target) * 100;
        
        questElement.innerHTML = `
            <div style="color: ${quest.completed ? '#27ae60' : '#ffffff'};">
                ${quest.description}
            </div>
            <div style="display: flex; align-items: center; margin-top: 4px;">
                <div style="flex: 1; background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${progressPercent}%; height: 100%; background: ${quest.completed ? '#27ae60' : '#4a90e2'}; transition: width 0.3s;"></div>
                </div>
                <div style="margin-left: 8px; font-size: 10px; color: #bbb;">
                    ${progress}/${quest.target}
                </div>
            </div>
        `;
        
        questList.appendChild(questElement);
    });
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

// 랭킹 관련 함수들
function showRanking() {
    document.getElementById('rankingModal').style.display = 'flex';
    showPowerRanking();
}

function closeRanking() {
    document.getElementById('rankingModal').style.display = 'none';
}

function showPowerRanking() {
    document.getElementById('rankingContent').innerHTML = `
        <h3>전투력 랭킹</h3>
        <div style="text-align: center; color: #888; margin: 20px 0;">
            아직 랭킹 데이터가 없습니다.<br>
            다른 플레이어들과 경쟁해보세요!
        </div>
    `;
}

function showStageRanking() {
    document.getElementById('rankingContent').innerHTML = `
        <h3>스테이지 랭킹</h3>
        <div style="text-align: center; color: #888; margin: 20px 0;">
            아직 랭킹 데이터가 없습니다.<br>
            더 높은 스테이지에 도전해보세요!
        </div>
    `;
}

function showTimeRanking() {
    document.getElementById('rankingContent').innerHTML = `
        <h3>플레이 시간 랭킹</h3>
        <div style="text-align: center; color: #888; margin: 20px 0;">
            아직 랭킹 데이터가 없습니다.<br>
            더 많이 플레이해보세요!
        </div>
    `;
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
        document.getElementById('equipmentIconLarge').style.color = '';
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
    if (!game) return;
    
    document.getElementById('smallPotionCount').textContent = game.healthPotions.small;
    document.getElementById('mediumPotionCount').textContent = game.healthPotions.medium;
    document.getElementById('largePotionCount').textContent = game.healthPotions.large;
}

// 포션 사용 함수
function usePotion(type) {
    game.useHealthPotion(type);
    updatePotionUI();
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
