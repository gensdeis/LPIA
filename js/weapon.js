// 무기 선택 시스템 - 무기 선택 관련 함수들

// 현재 선택된 무기 타입을 임시 저장
let tempSelectedWeaponType = null;

// 무기 타입 임시 선택 (라디오 버튼 선택만 함)
function selectWeaponType(weaponType) {
    if (!game.player) return;
    
    // 무기가 장착되어 있는지 확인
    if (weaponType === 'melee' && !game.player.equipment.lightsaber) {
        if (typeof showNotification === 'function') {
            showNotification('근접 무기가 장착되어 있지 않습니다!', 'error');
        }
        return;
    }
    
    if (weaponType === 'ranged' && !game.player.equipment.laser) {
        if (typeof showNotification === 'function') {
            showNotification('원거리 무기가 장착되어 있지 않습니다!', 'error');
        }
        return;
    }
    
    // 임시로 선택된 무기 타입 저장
    tempSelectedWeaponType = weaponType;
    
    // UI 업데이트 (라디오 버튼과 시각적 선택 상태)
    updateWeaponSelectorUI();
}

// 무기 선택 확인 버튼 클릭
function confirmWeaponSelection() {
    if (!game.player || !tempSelectedWeaponType) {
        if (typeof showNotification === 'function') {
            showNotification('먼저 무기를 선택해주세요!', 'error');
        }
        return;
    }
    
    // 실제 무기 타입 변경
    game.player.selectedWeaponType = tempSelectedWeaponType;
    
    // 알림 표시
    const weaponName = tempSelectedWeaponType === 'melee' ? '근접 무기 (광선검)' : '원거리 무기 (레이저총)';
    if (typeof showNotification === 'function') {
        showNotification(`${weaponName} 선택됨`, 'success');
    }
    
    // 무기 선택 패널 숨기고 변경 버튼 표시
    hideWeaponSelector();
    
    // 임시 선택 초기화
    tempSelectedWeaponType = null;
}

// 무기 선택 UI 업데이트 (패널 내부 UI만)
function updateWeaponSelectorUI() {
    if (!game.player) return;
    
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
    const rangedWeapon = game.player.equipment.laser;
    if (rangedWeapon) {
        const accuracySpan = document.getElementById('rangedAccuracy');
        const criticalSpan = document.getElementById('rangedCritical');
        
        if (accuracySpan) accuracySpan.textContent = Math.round(rangedWeapon.accuracy) + '%';
        if (criticalSpan) criticalSpan.textContent = Math.round(rangedWeapon.criticalChance) + '%';
    }
}

// 무기 선택 전체 UI 업데이트 (현재 선택된 무기 기준)
function updateWeaponSelector() {
    if (!game.player) return;
    
    const meleeRadio = document.getElementById('meleeWeapon');
    const rangedRadio = document.getElementById('rangedWeapon');
    const meleeChoice = meleeRadio?.parentElement?.parentElement;
    const rangedChoice = rangedRadio?.parentElement?.parentElement;
    
    // 라디오 버튼 업데이트 (실제 선택된 무기 기준)
    if (meleeRadio) meleeRadio.checked = game.player.selectedWeaponType === 'melee';
    if (rangedRadio) rangedRadio.checked = game.player.selectedWeaponType === 'ranged';
    
    // 선택 상태 시각적 표시 (실제 선택된 무기 기준)
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
    
    // 임시 선택을 현재 선택된 무기로 초기화
    tempSelectedWeaponType = game.player.selectedWeaponType;
    
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
            currentWeaponIconInline.textContent = game.player.selectedWeaponType === 'melee' ? '??' : '?';
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
    
    // 임시 선택을 현재 선택된 무기로 초기화
    if (game.player) {
        tempSelectedWeaponType = game.player.selectedWeaponType;
    }
    
    // UI 업데이트
    updateWeaponSelector();
} 