// KonamiCommand 클래스 - 히든 스킬 관련 로직
class KonamiCommand {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'Space'];
        this.inputSequence = [];
        this.lastInputTime = 0;
        this.cooldownTime = 10000; // 10초 쿨다운
        this.lastActivatedTime = 0;
        
        this.initKeyListener();
    }
    
    initKeyListener() {
        document.addEventListener('keydown', (event) => {
            // 입력 필드나 모달이 활성화된 경우 무시
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA' ||
                document.getElementById('loginModal').style.display !== 'none' ||
                document.getElementById('characterModal').style.display !== 'none') {
                return;
            }
            
            // 게임이 실행 중이지 않으면 무시
            if (!game || !game.player || !gameRunning) {
                return;
            }
            
            console.log('Key pressed:', event.code); // 디버깅용
            
            const now = Date.now();
            
            // 마지막 입력으로부터 0.5초가 지나면 시퀀스 초기화
            if (now - this.lastInputTime > 500) {
                this.inputSequence = [];
            }
            
            this.lastInputTime = now;
            this.inputSequence.push(event.code);
            
            // 시퀀스가 너무 길어지면 앞부분 제거
            if (this.inputSequence.length > this.sequence.length) {
                this.inputSequence.shift();
            }
            
            console.log('Current sequence:', this.inputSequence); // 디버깅용
            
            this.checkSequence();
        });
    }
    
    checkSequence() {
        if (this.inputSequence.length === this.sequence.length) {
            const isMatch = this.inputSequence.every((key, index) => key === this.sequence[index]);
            
            if (isMatch) {
                this.activateHiddenSkill();
                this.inputSequence = []; // 시퀀스 초기화
            }
        }
    }
    
    activateHiddenSkill() {
        const now = Date.now();
        
        // 쿨다운 체크
        if (now - this.lastActivatedTime < this.cooldownTime) {
            const remainingCooldown = Math.ceil((this.cooldownTime - (now - this.lastActivatedTime)) / 1000);
            if (typeof showNotification === 'function') {
                showNotification(`Hidden skill on cooldown: ${remainingCooldown}s`, 'info');
            }
            return;
        }
        
        // 타겟 확인
        const target = game.currentBoss || game.currentMonster;
        if (!target) {
            if (typeof showNotification === 'function') {
                showNotification('No target for hidden skill!', 'info');
            }
            return;
        }
        
        this.lastActivatedTime = now;
        
        if (typeof showNotification === 'function') {
            showNotification('? Hidden Skill: Body Slam!', 'success');
        }
        
        this.executeBodySlam(target);
    }
    
    executeBodySlam(target) {
        if (game && typeof game.performBodySlam === 'function') {
            game.performBodySlam(target);
        }
    }
} 