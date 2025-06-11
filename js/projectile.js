// Projectile 클래스 - 투사체 관련 로직
class Projectile {
    constructor(x, y, targetX, targetY, damage, type, speed = 5) {
        // 입력값 유효성 검사
        if (!isFinite(x) || !isFinite(y) || !isFinite(targetX) || !isFinite(targetY)) {
            console.warn('Invalid projectile coordinates provided:', { x, y, targetX, targetY });
            // 기본값으로 설정
            x = isFinite(x) ? x : 0;
            y = isFinite(y) ? y : 0;
            targetX = isFinite(targetX) ? targetX : 100;
            targetY = isFinite(targetY) ? targetY : 100;
        }
        
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
        
        // 거리가 0이면 기본값 설정
        if (distance === 0 || !isFinite(distance)) {
            this.velocityX = 0;
            this.velocityY = 0;
            this.totalDistance = 0;
        } else {
            this.velocityX = (dx / distance) * speed;
            this.velocityY = (dy / distance) * speed;
            this.totalDistance = distance;
        }
        
        // 속도 유효성 재검증
        if (!isFinite(this.velocityX) || !isFinite(this.velocityY)) {
            console.warn('Invalid velocity calculated, setting to zero:', { velocityX: this.velocityX, velocityY: this.velocityY });
            this.velocityX = 0;
            this.velocityY = 0;
        }
        
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
            
            // 포물선 궤도 계산 - 안전성 검사 포함
            if (isFinite(this.originalStartX) && isFinite(this.originalTargetX) && 
                isFinite(this.originalStartY) && isFinite(this.originalTargetY) && 
                isFinite(this.peakHeight)) {
                // X축: 시작점에서 목표점까지 선형 이동
                this.x = this.originalStartX + (this.originalTargetX - this.originalStartX) * progress;
                
                // Y축: 포물선 궤도 (높이 포함)
                const parabola = 4 * this.peakHeight * progress * (1 - progress);
                this.y = this.originalStartY + (this.originalTargetY - this.originalStartY) * progress - parabola;
                
                // 계산된 좌표 유효성 검사
                if (!isFinite(this.x) || !isFinite(this.y)) {
                    console.warn('Invalid missile coordinates calculated, deactivating projectile');
                    this.active = false;
                    return false;
                }
            } else {
                console.warn('Invalid missile parameters, deactivating projectile');
                this.active = false;
                return false;
            }
            
            return false;
        }
        
        // 일반 투사체 이동 - 안전성 검사 포함
        if (isFinite(this.velocityX) && isFinite(this.velocityY)) {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.traveledDistance += this.speed;
            
            // 계산된 좌표 유효성 검사
            if (!isFinite(this.x) || !isFinite(this.y)) {
                console.warn('Invalid projectile coordinates after movement, deactivating');
                this.active = false;
                return false;
            }
        } else {
            console.warn('Invalid projectile velocity, deactivating');
            this.active = false;
            return false;
        }
        
        // 목표에 도달했는지 확인
        const distanceToTarget = Math.sqrt(
            Math.pow(this.targetX - this.x, 2) + 
            Math.pow(this.targetY - this.y, 2)
        );
        
        // 거리 계산 유효성 검사
        if (!isFinite(distanceToTarget)) {
            console.warn('Invalid distance calculation, deactivating projectile');
            this.active = false;
            return false;
        }
        
        if (distanceToTarget <= this.speed || this.traveledDistance >= this.totalDistance) {
            this.active = false;
            return true; // 충돌
        }
        
        return false;
    }
} 