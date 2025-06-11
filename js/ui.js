// UI 관련 함수들 - 알림, 모달, UI 업데이트 등

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    // 테스트 메시지 비활성화됨
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
    if (!window.game || !window.game.player) return;
    
    // 플레이어 정보 업데이트 (안전 체크 포함)
    const playerLevel = document.getElementById('playerLevel');
    if (playerLevel) playerLevel.textContent = window.game.player.level;
    
    const hpText = document.getElementById('hpText');
    if (hpText) {
        const hp = Math.max(0, window.game.player.hp || 0);
        const maxHp = window.game.player.maxHp || 100;
        const hpPercent = maxHp > 0 ? Math.floor((hp / maxHp) * 100) : 0;
        hpText.textContent = `${hp}/${maxHp} (${hpPercent}%)`;
    }
    
    const mpText = document.getElementById('mpText');
    if (mpText) {
        const mp = Math.max(0, window.game.player.mp || 0);
        const maxMp = window.game.player.maxMp || 100;
        const mpPercent = maxMp > 0 ? Math.floor((mp / maxMp) * 100) : 0;
        mpText.textContent = `${mp}/${maxMp} (${mpPercent}%)`;
    }
    
    const playerGold = document.getElementById('playerGold');
    if (playerGold) playerGold.textContent = window.game.player.gold || 0;
    
    const playerPower = document.getElementById('playerPower');
    if (playerPower) playerPower.textContent = window.game.player.getTotalPower();
    
    const playerDefense = document.getElementById('playerDefense');
    if (playerDefense) playerDefense.textContent = window.game.player.getTotalDefense();
    
    // 방어막 정보 표시
    const shieldDisplay = document.getElementById('shieldDisplay');
    if (shieldDisplay) {
        if (window.game.player.shield > 0) {
            const shieldText = document.getElementById('shieldText');
            const shieldBar = document.getElementById('shieldBar');
            if (shieldText) shieldText.textContent = `${window.game.player.shield}/${window.game.player.maxShield}`;
            if (shieldBar) shieldBar.style.width = `${(window.game.player.shield / window.game.player.maxShield) * 100}%`;
            shieldDisplay.style.display = 'block';
        } else {
            shieldDisplay.style.display = 'none';
        }
    }
    
    // HP/MP 바 업데이트
    const hp = Math.max(0, window.game.player.hp || 0);
    const maxHp = window.game.player.maxHp || 100;
    const mp = Math.max(0, window.game.player.mp || 0);
    const maxMp = window.game.player.maxMp || 100;
    
    const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;
    const mpPercent = maxMp > 0 ? (mp / maxMp) * 100 : 0;
    
    const hpBar = document.getElementById('hpBar');
    const mpBar = document.getElementById('mpBar');
    if (hpBar) hpBar.style.width = hpPercent + '%';
    if (mpBar) mpBar.style.width = mpPercent + '%';
    
    // 경험치 바 업데이트
    const experience = window.game.player.experience || 0;
    const experienceToNext = window.game.player.experienceToNext || 100;
    const expPercent = experienceToNext > 0 ? (experience / experienceToNext) * 100 : 0;
    
    const expBar = document.getElementById('expBar');
    const expText = document.getElementById('expText');
    if (expBar) expBar.style.width = expPercent + '%';
    if (expText) expText.textContent = `${experience}/${experienceToNext} (${expPercent.toFixed(0)}%)`;
    
    // 퀘스트 업데이트
    updateQuestUI();
    
    // 스테이지 정보 업데이트
    const currentStage = document.getElementById('currentStage');
    const currentPlanet = document.getElementById('currentPlanet');
    if (currentStage) currentStage.textContent = window.game.stage;
    if (currentPlanet) currentPlanet.textContent = window.game.getCurrentPlanet();
    
    // 몬스터/보스 정보 업데이트
    const currentMonster = document.getElementById('currentMonster');
    const monsterLevel = document.getElementById('monsterLevel');
    const bossHpBar = document.getElementById('bossHpBar');
    const bossHpText = document.getElementById('bossHpText');
    
    if (window.game.currentBoss) {
        if (currentMonster) currentMonster.textContent = window.game.currentBoss.name;
        if (monsterLevel) monsterLevel.textContent = window.game.currentBoss.level;
        
        // 안전한 HP 계산 (NaN 방지)
        const bossHp = Math.max(0, window.game.currentBoss.hp || 0);
        const bossMaxHp = Math.max(1, window.game.currentBoss.maxHp || 1); // 0으로 나누기 방지
        const bossHpPercent = (bossHp / bossMaxHp) * 100;
        
        if (bossHpBar) bossHpBar.style.width = Math.max(0, bossHpPercent) + '%';
        if (bossHpText) bossHpText.textContent = `${bossHp}/${bossMaxHp} (${Math.max(0, bossHpPercent).toFixed(0)}%)`;
    } else if (window.game.currentMonster) {
        if (currentMonster) currentMonster.textContent = window.game.currentMonster.name;
        if (monsterLevel) monsterLevel.textContent = window.game.currentMonster.level;
        
        // 안전한 HP 계산 (NaN 방지)
        const monsterHp = Math.max(0, window.game.currentMonster.hp || 0);
        const monsterMaxHp = Math.max(1, window.game.currentMonster.maxHp || 1); // 0으로 나누기 방지
        const monsterHpPercent = (monsterHp / monsterMaxHp) * 100;
        
        if (bossHpBar) bossHpBar.style.width = Math.max(0, monsterHpPercent) + '%';
        if (bossHpText) bossHpText.textContent = `${monsterHp}/${monsterMaxHp} (${Math.max(0, monsterHpPercent).toFixed(0)}%)`;
    }
    
    // 장비 슬롯 업데이트
    updateEquipmentUI();
    
    // 포션 UI 업데이트
    updatePotionUI();
    
    // 스킬 UI 업데이트
    if (typeof updateSkillUI === 'function') {
        updateSkillUI();
    }
    
    // 무기 선택 UI 업데이트 (패널이 열려있을 때만)
    const weaponSelector = document.getElementById('weaponSelector');
    if (weaponSelector && weaponSelector.style.display !== 'none' && typeof updateWeaponSelectorUI === 'function') {
        updateWeaponSelectorUI();
    }
}

// 퀘스트 UI 업데이트
function updateQuestUI() {
    const questList = document.getElementById('questList');
    if (!questList) return;
    
    questList.innerHTML = '';
    
    if (!window.game || !window.game.quests) return;
    
    window.game.quests.forEach(quest => {
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
    if (!window.game || !window.game.player || !window.game.player.equipment) return;
    
    Object.keys(window.game.player.equipment).forEach(slot => {
        const slotElement = document.querySelector(`[data-slot="${slot}"]`);
        if (!slotElement) return; // 요소가 없으면 건너뛰기
        
        const equipment = window.game.player.equipment[slot];
        
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
    const equipment = window.game.player.equipment[slot];
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
    if (!window.game || !window.game.healthPotions) return;
    
    // 포션 개수 업데이트
    const smallPotionCount = document.getElementById('smallPotionCount');
    const mediumPotionCount = document.getElementById('mediumPotionCount');
    const largePotionCount = document.getElementById('largePotionCount');
    
    if (smallPotionCount) smallPotionCount.textContent = window.game.healthPotions.small;
    if (mediumPotionCount) mediumPotionCount.textContent = window.game.healthPotions.medium;
    if (largePotionCount) largePotionCount.textContent = window.game.healthPotions.large;
}

// 포션 사용 함수
function usePotion(type) {
    window.game.useHealthPotion(type);
    updatePotionUI();
}

// 자동 포션 설정 함수들
function toggleAutoPotion() {
    const enabled = document.getElementById('autoPotionEnabled').checked;
    window.game.autoPotionSettings.enabled = enabled;
}

function updateAutoPotionPercent(value) {
    window.game.autoPotionSettings.triggerPercent = parseInt(value);
    document.getElementById('autoPotionPercentText').textContent = value + '%';
}

function updateAutoPotionPriority() {
    const priority = document.getElementById('autoPotionPriority').value;
    window.game.autoPotionSettings.priority = priority.split(',');
}

// 인벤토리 패널 토글 기능
let isInventoryCollapsed = false;

function toggleInventoryPanel() {
    const inventoryContainer = document.getElementById('inventoryContainer');
    const inventoryPanel = document.getElementById('inventory');
    const toggleButton = document.getElementById('inventoryToggle');
    const toggleArrow = toggleButton.querySelector('.toggle-arrow');
    
    if (!inventoryContainer || !inventoryPanel || !toggleButton || !toggleArrow) return;
    
    isInventoryCollapsed = !isInventoryCollapsed;
    
    if (isInventoryCollapsed) {
        inventoryContainer.classList.add('collapsed');
        inventoryPanel.classList.add('collapsed');
        toggleButton.classList.add('collapsed');
        toggleArrow.classList.add('collapsed');
        toggleButton.title = '장비 패널 열기 (Ctrl+I)';
        toggleButton.setAttribute('aria-label', '장비 패널 열기');
        
        if (typeof showNotification === 'function') {
            showNotification('장비 패널이 최소화되었습니다', 'info');
        }
    } else {
        inventoryContainer.classList.remove('collapsed');
        inventoryPanel.classList.remove('collapsed');
        toggleButton.classList.remove('collapsed');
        toggleArrow.classList.remove('collapsed');
        toggleButton.title = '장비 패널 닫기 (Ctrl+I)';
        toggleButton.setAttribute('aria-label', '장비 패널 닫기');
        
        if (typeof showNotification === 'function') {
            showNotification('장비 패널을 열었습니다', 'info');
        }
    }
    
    // 상태 저장
    try {
        localStorage.setItem('inventoryCollapsed', isInventoryCollapsed);
    } catch (e) {
        console.log('Failed to save inventory state:', e);
    }
}

// 키보드 단축키 지원(Ctrl+I)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key.toLowerCase() === 'i') {
        event.preventDefault();
        toggleInventoryPanel();
    }
});

// 페이지 로드 시 인벤토리 상태 복원
function restoreInventoryState() {
    try {
        const savedState = localStorage.getItem('inventoryCollapsed');
        if (savedState === 'true') {
            isInventoryCollapsed = false;
            
            const originalShowNotification = window.showNotification;
            window.showNotification = function() {};
            
            toggleInventoryPanel();
            
            setTimeout(() => {
                window.showNotification = originalShowNotification;
            }, 100);
        }
    } catch (e) {
        console.log('Failed to restore inventory state:', e);
    }
}

// 윈도우 로드 시 초기화
window.addEventListener('load', function() {
    restoreInventoryState();
});
