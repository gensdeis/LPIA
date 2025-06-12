// 계정 관리 및 인증 관련 함수들

// 전역 변수
let currentUser = null;
let isRegisterMode = false;

// 로그인 모달 관련 함수들
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('loginMessage').textContent = '';
    updateLoginModal();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginId').value = '';
    document.getElementById('loginPw').value = '';
    const messageEl = document.getElementById('loginMessage');
    messageEl.textContent = '';
    messageEl.style.color = '#ff6666'; // 기본 색상으로 리셋
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

// 사용자 데이터 관리
function saveUserGameData(userId) {
    if (!window.game) return;
    
    const gameData = {
        player: window.game.player,
        stage: window.game.stage,
        quests: window.game.quests,
        healthPotions: window.game.healthPotions,
        autoPotionSettings: window.game.autoPotionSettings,
        stageStartState: window.game.stageStartState,
        selectedWeaponType: window.game.player.selectedWeaponType,
        timestamp: Date.now()
    };
    
    const userDataKey = `gameData_${userId}`;
    localStorage.setItem(userDataKey, JSON.stringify(gameData));
}

function loadUserGameData(userId) {
    const userDataKey = `gameData_${userId}`;
    const saved = localStorage.getItem(userDataKey);
    
    if (saved && window.game) {
        const gameData = JSON.parse(saved);
        
        // 플레이어 데이터 복원
        Object.assign(window.game.player, gameData.player);
        window.game.stage = gameData.stage;
        window.game.quests = gameData.quests.map(q => Object.assign(new Quest(), q));
        
        if (gameData.healthPotions) {
            window.game.healthPotions = gameData.healthPotions;
        }
        
        if (gameData.autoPotionSettings) {
            window.game.autoPotionSettings = gameData.autoPotionSettings;
            
            // UI 동기화
            const autoPotionEnabled = document.getElementById('autoPotionEnabled');
            const autoPotionPercent = document.getElementById('autoPotionPercent');
            const autoPotionPercentText = document.getElementById('autoPotionPercentText');
            const autoPotionPriority = document.getElementById('autoPotionPriority');
            
            if (autoPotionEnabled) autoPotionEnabled.checked = gameData.autoPotionSettings.enabled;
            if (autoPotionPercent) autoPotionPercent.value = gameData.autoPotionSettings.triggerPercent;
            if (autoPotionPercentText) autoPotionPercentText.textContent = gameData.autoPotionSettings.triggerPercent + '%';
            
            if (autoPotionPriority) {
                const priorityString = gameData.autoPotionSettings.priority.join(',');
                autoPotionPriority.value = priorityString;
            }
        }
        
        if (gameData.stageStartState) {
            window.game.stageStartState = gameData.stageStartState;
        }
        
        // 무기 선택 정보 복원
        if (gameData.selectedWeaponType) {
            window.game.player.selectedWeaponType = gameData.selectedWeaponType;
        }
        
        // 새 몬스터 스폰
        window.game.spawnMonster();
        
        // 퀘스트 상태 체크 (레벨, 골드 등 현재 상태와 동기화)
        if (typeof window.game.checkQuestStatus === 'function') {
            window.game.checkQuestStatus();
        }
        
        // UI 업데이트
        if (typeof updateUI === 'function') {
            updateUI();
        }
        if (typeof updatePotionUI === 'function') {
            updatePotionUI();
        }
        
        // 무기가 선택되어 있으면 무기 패널 숨기기
        setTimeout(() => {
            if (window.game.player && window.game.player.selectedWeaponType) {
                if (typeof hideWeaponSelector === 'function') {
                    hideWeaponSelector();
                }
            }
        }, 100);
        
        showNotification('게임 데이터를 불러왔습니다.', 'success');
    } else {
        // 새 게임 시작
        showNotification('새 게임을 시작합니다.', 'info');
        
        // 새 게임에서는 무기 선택 필요
        setTimeout(() => {
            if (typeof checkWeaponSelectionState === 'function') {
                checkWeaponSelectionState();
            }
        }, 500);
    }
}

// 회원가입 및 로그인 처리
function register(id, pw) {
    const messageEl = document.getElementById('loginMessage');
    
    // 아이디 중복 체크
    const existingUser = localStorage.getItem(`user_${id}`);
    if (existingUser) {
        messageEl.textContent = '이미 존재하는 아이디입니다.';
        return;
    }
    
    // 닉네임 중복 체크 (아이디가 닉네임으로 사용될 때만)
    if (isNicknameTaken(id)) {
        messageEl.textContent = '이미 사용 중인 닉네임입니다.';
        return;
    }
    
    // 사용자 정보 저장
    const userData = {
        id: id,
        password: pw,
        createdAt: Date.now()
    };
    
    localStorage.setItem(`user_${id}`, JSON.stringify(userData));
    
    messageEl.textContent = '회원가입 완료! 캐릭터를 생성해주세요.';
    messageEl.style.color = '#27ae60';
    
    // 자동 로그인 처리
    setTimeout(() => {
        console.log('Starting auto-login process for:', id); // 디버깅용
        currentUser = id;
        updateAccountInfo();
        closeLoginModal();
        
        // 새 사용자이므로 게임 초기화 없이 바로 캐릭터 생성 모달 표시
        console.log('About to show character modal for new user'); // 디버깅용
        showCharacterModal();
        console.log('Character modal called'); // 디버깅용
        showNotification(`${id}님 환영합니다! 캐릭터를 생성해주세요.`, 'success');
    }, 1000);
}

function loginUser(id, pw) {
    const messageEl = document.getElementById('loginMessage');
    
    // 사용자 정보 확인
    const userData = localStorage.getItem(`user_${id}`);
    if (!userData) {
        messageEl.textContent = '존재하지 않는 아이디입니다.';
        return;
    }
    
    const user = JSON.parse(userData);
    if (user.password !== pw) {
        messageEl.textContent = '비밀번호가 틀렸습니다.';
        return;
    }
    
    // 로그인 성공
    currentUser = id;
    updateAccountInfo();
    closeLoginModal();
    
    // 게임이 아직 초기화되지 않았다면 초기화
    if (!window.game) {
        if (typeof initGame === 'function') {
            initGame();
        } else {
            console.error('initGame function not available');
            return;
        }
    }
    
    // 캐릭터 정보가 없으면 캐릭터 생성 모달 표시
    const characterData = localStorage.getItem(`character_${id}`);
    console.log('Character data for user', id, ':', characterData); // 디버깅용
    
    if (!characterData) {
        console.log('No character found, showing character modal'); // 디버깅용
        setTimeout(() => {
            showCharacterModal();
        }, 100);
    } else {
        console.log('Character found, loading game data'); // 디버깅용
        // 기존 캐릭터 정보 로드
        const character = JSON.parse(characterData);
        if (window.game && window.game.player) {
            window.game.player.character = character;
        }
        
        // 게임 데이터 로드
        loadUserGameData(id);
    }
    
    showNotification(`${id}님, 환영합니다!`, 'success');
}

// 캐릭터 생성 관련 함수들
function showCharacterModal() {
    console.log('showCharacterModal() called'); // 디버깅용
    
    const modal = document.getElementById('characterModal');
    console.log('Character modal element:', modal); // 디버깅용
    
    if (modal) {
        // hidden 클래스 제거 (CSS의 !important보다 우선하도록)
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        console.log('Character modal display set to flex and hidden class removed'); // 디버깅용
    } else {
        console.error('Character modal element not found!'); // 디버깅용
        return;
    }
    
    // 색상 선택기에 이벤트 리스너 추가
    document.getElementById('bodyColor').addEventListener('input', updateCharacterPreview);
    document.getElementById('helmetColor').addEventListener('input', updateCharacterPreview);
    document.getElementById('equipmentColor').addEventListener('input', updateCharacterPreview);
    
    updateCharacterPreview();
    console.log('Character modal setup complete'); // 디버깅용
}

function closeCharacterModal(skipGameLoad = false) {
    console.log('closeCharacterModal called with skipGameLoad:', skipGameLoad); // 디버깅용
    
    const modal = document.getElementById('characterModal');
    modal.style.display = 'none';
    modal.classList.add('hidden'); // hidden 클래스 다시 추가
    
    document.getElementById('characterNickname').value = '';
    document.getElementById('characterMessage').textContent = '';
    
    // 이벤트 리스너 제거
    document.getElementById('bodyColor').removeEventListener('input', updateCharacterPreview);
    document.getElementById('helmetColor').removeEventListener('input', updateCharacterPreview);
    document.getElementById('equipmentColor').removeEventListener('input', updateCharacterPreview);
    
    // skipGameLoad가 true면 게임 데이터 로드하지 않음 (캐릭터 생성 후 호출시)
    if (!skipGameLoad && currentUser && window.game && window.game.player) {
        console.log('Loading user game data after modal close'); // 디버깅용
        // 기본 캐릭터 정보로 게임 시작
        loadUserGameData(currentUser);
    } else if (skipGameLoad) {
        console.log('Skipping game data load as requested'); // 디버깅용
    }
}

function updateCharacterPreview() {
    const canvas = document.getElementById('characterPreview');
    const ctx = canvas.getContext('2d');
    
    // 캔버스 초기화
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 색상 가져오기
    const bodyColor = document.getElementById('bodyColor').value;
    const helmetColor = document.getElementById('helmetColor').value;
    const equipmentColor = document.getElementById('equipmentColor').value;
    
    // 간단한 캐릭터 미리보기 그리기
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // 몸
    ctx.fillStyle = bodyColor;
    ctx.fillRect(centerX - 15, centerY - 10, 30, 40);
    
    // 헬멧
    ctx.fillStyle = helmetColor;
    ctx.fillRect(centerX - 12, centerY - 25, 24, 20);
    
    // 장비 (작은 사각형들)
    ctx.fillStyle = equipmentColor;
    ctx.fillRect(centerX - 8, centerY - 5, 16, 8);
}

function createCharacter() {
    console.log('createCharacter() called'); // 디버깅용
    
    if (!currentUser) {
        console.log('No current user found'); // 디버깅용
        document.getElementById('characterMessage').textContent = '로그인이 필요합니다.';
        return;
    }
    
    const nickname = document.getElementById('characterNickname').value.trim();
    const messageEl = document.getElementById('characterMessage');
    
    console.log('Creating character with nickname:', nickname); // 디버깅용
    
    if (!nickname) {
        console.log('No nickname provided'); // 디버깅용
        messageEl.textContent = '닉네임을 입력해주세요.';
        return;
    }
    
    if (isNicknameTaken(nickname)) {
        console.log('Nickname already taken:', nickname); // 디버깅용
        messageEl.textContent = '이미 사용 중인 닉네임입니다.';
        return;
    }
    
    console.log('Proceeding with character creation...'); // 디버깅용
    
    // 캐릭터 정보 생성
    const characterData = {
        nickname: nickname,
        color: {
            body: document.getElementById('bodyColor').value,
            helmet: document.getElementById('helmetColor').value,
            equipment: document.getElementById('equipmentColor').value
        },
        createdAt: Date.now()
    };
    
    console.log('Character data created:', characterData); // 디버깅용
    
    // 캐릭터 정보 저장
    localStorage.setItem(`character_${currentUser}`, JSON.stringify(characterData));
    addUsedNickname(nickname);
    console.log('Character data saved to localStorage'); // 디버깅용
    
    // 게임이 아직 초기화되지 않았다면 초기화
    if (!window.game) {
        console.log('Initializing game after character creation'); // 디버깅용
        try {
            if (typeof initGame === 'function') {
                initGame();
                console.log('Game initialized successfully'); // 디버깅용
            } else {
                console.error('initGame function not available'); // 디버깅용
                return;
            }
        } catch (error) {
            console.error('Error initializing game:', error); // 디버깅용
            return;
        }
    } else {
        console.log('Game already initialized'); // 디버깅용
    }
    
    // 게임 플레이어에 적용
    if (window.game && window.game.player) {
        window.game.player.character = characterData;
        console.log('Character data applied to game player'); // 디버깅용
    } else {
        console.error('Game or game.player not available'); // 디버깅용
    }
    
    console.log('About to close character modal'); // 디버깅용
    closeCharacterModal(true); // skipGameLoad = true로 호출
    console.log('Character modal closed'); // 디버깅용
    
    // 새 사용자이므로 게임 데이터 로드 건너뛰고 바로 무기 선택으로
    console.log('Character created, proceeding to weapon selection'); // 디버깅용
    
    // UI 업데이트
    setTimeout(() => {
        if (typeof updateUI === 'function') {
            updateUI();
        }
        
        // 새 캐릭터이므로 무기 선택 상태 확인
        console.log('About to check weapon selection state'); // 디버깅용
        if (typeof checkWeaponSelectionState === 'function') {
            checkWeaponSelectionState();
            console.log('Weapon selection state checked'); // 디버깅용
        } else {
            console.error('checkWeaponSelectionState function not available'); // 디버깅용
        }
    }, 500);
    
    showNotification(`캐릭터 '${nickname}' 생성 완료!`, 'success');
    console.log('Character creation completed'); // 디버깅용
}

// 닉네임 관리
function isNicknameTaken(nickname) {
    const usedNicknames = JSON.parse(localStorage.getItem('usedNicknames') || '[]');
    return usedNicknames.includes(nickname);
}

function addUsedNickname(nickname) {
    const usedNicknames = JSON.parse(localStorage.getItem('usedNicknames') || '[]');
    if (!usedNicknames.includes(nickname)) {
        usedNicknames.push(nickname);
        localStorage.setItem('usedNicknames', JSON.stringify(usedNicknames));
    }
}

// 로그인 체크 및 강제
function checkLoginRequired() {
    // 게스트 모드 허용하므로 항상 false 반환
    return false;
}

function enforceLogin() {
    if (checkLoginRequired() && !currentUser) {
        showLoginModal();
        return true;
    }
    return false;
}

// 게임 데이터 관리
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
        if (typeof initGame === 'function') {
            initGame();
            showNotification('게임이 초기화되었습니다.', 'success');
        } else {
            console.error('initGame function not available');
        }
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
        if (typeof initGame === 'function') {
            initGame();
            showNotification('모든 데이터가 삭제되었습니다.', 'info');
        } else {
            console.error('initGame function not available');
        }
    }
} 