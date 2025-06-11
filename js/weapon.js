// 무기 선택 시스템 - 무기 선택 관련 함수들

// 임시 선택된 무기 타입 (확인 버튼 누르기 전까지)
let tempSelectedWeaponType = null;

// 무기 타입 선택 (라디오 버튼 클릭 시)
function selectWeaponType(weaponType) {
    if (!window.game || !window.game.player) return;
    
    // 선택한 무기가 장착되어 있는지 확인
    if (weaponType === 'melee' && !window.game.player.equipment.lightsaber) {
        if (typeof showNotification === 'function') {
            showNotification('근접 무기가 장착되어 있지 않습니다!', 'error');
        }
        // 이전 선택 상태로 복원
        setTimeout(() => updateWeaponSelectorUI(), 10);
        return;
    }
    
    if (weaponType === 'ranged' && !window.game.player.equipment.laser) {
        if (typeof showNotification === 'function') {
            showNotification('원거리 무기가 장착되어 있지 않습니다!', 'error');
        }
        // 이전 선택 상태로 복원
        setTimeout(() => updateWeaponSelectorUI(), 10);
        return;
    }
    
    // 임시로 선택된 무기 타입 저장
    tempSelectedWeaponType = weaponType;
    
    console.log('Selected weapon type:', weaponType); // 디버깅용
    
    // UI 업데이트 (시각적 선택 상태)
    updateWeaponSelectorUI();
}

// 무기 선택 확인 버튼 클릭
function confirmWeaponSelection() {
    if (!window.game || !window.game.player || !tempSelectedWeaponType) {
        showNotification('먼저 무기를 선택해주세요!', 'error');
        return;
    }
    
    // 선택한 무기가 장착되어 있는지 확인
    if (tempSelectedWeaponType === 'melee' && !window.game.player.equipment.lightsaber) {
        if (typeof showNotification === 'function') {
            showNotification('근접 무기가 장착되어 있지 않습니다!', 'error');
        }
        return;
    }
    
    if (tempSelectedWeaponType === 'ranged' && !window.game.player.equipment.laser) {
        if (typeof showNotification === 'function') {
            showNotification('원거리 무기가 장착되어 있지 않습니다!', 'error');
        }
        return;
    }
    
    // 실제 무기 타입 변경
    window.game.player.selectedWeaponType = tempSelectedWeaponType;
    
    // 알림 표시
    const weaponName = tempSelectedWeaponType === 'melee' ? '근접 무기 (광선검)' : '원거리 무기 (레이저총)';
    if (typeof showNotification === 'function') {
        showNotification(`${weaponName} 선택됨`, 'success');
    }
    
    // 게임 데이터 저장 (로그인된 경우)
    if (typeof currentUser !== 'undefined' && currentUser && typeof saveUserGameData === 'function') {
        saveUserGameData(currentUser);
    }
    
    // 임시 선택 초기화
    tempSelectedWeaponType = null;
    
    // 무기 선택 패널 숨기고 변경 버튼 표시
    hideWeaponSelector();
}

// 무기 선택 UI 업데이트 (패널 내부 UI만)
function updateWeaponSelectorUI() {
    if (!window.game || !window.game.player) return;
    
    const meleeRadio = document.getElementById('meleeWeapon');
    const rangedRadio = document.getElementById('rangedWeapon');
    const meleeChoice = meleeRadio?.parentElement?.parentElement;
    const rangedChoice = rangedRadio?.parentElement?.parentElement;
    
    // 라디오 버튼 업데이트 (임시 선택 기준)
    if (meleeRadio) meleeRadio.checked = tempSelectedWeaponType === 'melee';
    if (rangedRadio) rangedRadio.checked = tempSelectedWeaponType === 'ranged';
    
    // 선택 상태 시각적 표시 (임시 선택 기준)
    if (meleeChoice) {
        meleeChoice.classList.toggle('selected', tempSelectedWeaponType === 'melee');
    }
    if (rangedChoice) {
        rangedChoice.classList.toggle('selected', tempSelectedWeaponType === 'ranged');
    }
    
    // 원거리 무기 스탯 업데이트
    const rangedWeapon = window.game.player.equipment.laser;
    if (rangedWeapon) {
        const accuracySpan = document.getElementById('rangedAccuracy');
        const criticalSpan = document.getElementById('rangedCritical');
        
        if (accuracySpan) accuracySpan.textContent = Math.round(rangedWeapon.accuracy) + '%';
        if (criticalSpan) criticalSpan.textContent = Math.round(rangedWeapon.criticalChance) + '%';
    }
}

// 무기 선택 전체 UI 업데이트 (현재 선택된 무기 기준)
function updateWeaponSelector() {
    if (!window.game || !window.game.player) return;
    
    const meleeRadio = document.getElementById('meleeWeapon');
    const rangedRadio = document.getElementById('rangedWeapon');
    const meleeChoice = meleeRadio?.parentElement?.parentElement;
    const rangedChoice = rangedRadio?.parentElement?.parentElement;
    
    // 라디오 버튼 업데이트 (실제 선택된 무기 기준)
    if (meleeRadio) meleeRadio.checked = window.game.player.selectedWeaponType === 'melee';
    if (rangedRadio) rangedRadio.checked = window.game.player.selectedWeaponType === 'ranged';
    
    // 선택 상태 시각적 표시 (실제 선택된 무기 기준)
    if (meleeChoice) {
        meleeChoice.classList.toggle('selected', window.game.player.selectedWeaponType === 'melee');
    }
    if (rangedChoice) {
        rangedChoice.classList.toggle('selected', window.game.player.selectedWeaponType === 'ranged');
    }
    
    // 원거리 무기 스탯 업데이트
    const rangedWeapon = window.game.player.equipment.laser;
    if (rangedWeapon) {
        const accuracySpan = document.getElementById('rangedAccuracy');
        const criticalSpan = document.getElementById('rangedCritical');
        
        if (accuracySpan) accuracySpan.textContent = Math.round(rangedWeapon.accuracy) + '%';
        if (criticalSpan) criticalSpan.textContent = Math.round(rangedWeapon.criticalChance) + '%';
    }
    
    // 임시 선택을 현재 선택된 무기로 초기화
    tempSelectedWeaponType = window.game.player.selectedWeaponType;
}

// 무기 선택 상태 확인
function checkWeaponSelectionState() {
    if (!window.game || !window.game.player) return;
    
    console.log('Checking weapon selection state...'); // 디버깅용
    console.log('Selected weapon type:', window.game.player.selectedWeaponType);
    console.log('Has lightsaber:', !!window.game.player.equipment.lightsaber);
    console.log('Has laser:', !!window.game.player.equipment.laser);
    
    // 무기가 장착되어 있고 선택되어 있으면 패널 숨기기
    const hasWeaponSelected = window.game.player.selectedWeaponType && 
                              ((window.game.player.selectedWeaponType === 'melee' && window.game.player.equipment.lightsaber) ||
                               (window.game.player.selectedWeaponType === 'ranged' && window.game.player.equipment.laser));
    
    console.log('Has weapon selected:', hasWeaponSelected); // 디버깅용
    
    if (hasWeaponSelected) {
        hideWeaponSelector();
    } else {
        // 무기가 장착되어 있지만 선택되지 않은 경우 패널 표시
        const hasAnyWeapon = window.game.player.equipment.lightsaber || window.game.player.equipment.laser;
        if (hasAnyWeapon && !window.game.player.selectedWeaponType) {
            // 무기는 있지만 선택하지 않은 경우에만 패널 표시
            setTimeout(() => showWeaponSelector(), 100);
        } else {
            hideWeaponSelector();
        }
    }
}

// 무기 선택 패널 숨기기
function hideWeaponSelector() {
    console.log('Hiding weapon selector...'); // 디버깅용
    
    const weaponSelector = document.getElementById('weaponSelector');
    const weaponSelectBtn = document.getElementById('weaponSelectBtn');
    
    if (weaponSelector) {
        weaponSelector.style.display = 'none';
        console.log('Weapon selector hidden');
    }
    
    if (weaponSelectBtn) {
        weaponSelectBtn.style.display = 'inline-block';
        // 현재 선택된 무기에 따라 버튼 텍스트 변경
        if (window.game && window.game.player && window.game.player.selectedWeaponType) {
            const icon = window.game.player.selectedWeaponType === 'melee' ? '⚔️' : '🔫';
            weaponSelectBtn.innerHTML = `<span id="weaponSelectIcon">${icon}</span> 무기 변경`;
        } else {
            weaponSelectBtn.innerHTML = `<span id="weaponSelectIcon">⚔️</span> 무기 선택`;
        }
    }
}

// 무기 선택 패널 표시
function showWeaponSelector() {
    console.log('Showing weapon selector...'); // 디버깅용
    
    const weaponSelector = document.getElementById('weaponSelector');
    const weaponSelectBtn = document.getElementById('weaponSelectBtn');
    
    if (weaponSelector) {
        weaponSelector.style.display = 'block';
        console.log('Weapon selector shown');
    }
    
    if (weaponSelectBtn) {
        weaponSelectBtn.style.display = 'none';
    }
    
    // UI 상태 업데이트
    updateWeaponSelector();
} 