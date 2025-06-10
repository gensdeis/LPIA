// Projectile 클래스 - 투사체 관련 로직
class Projectile {
    constructor(x, y, targetX, targetY, damage, type, speed = 5) {
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
        
        this.velocityX = (dx / distance) * speed;
        this.velocityY = (dy / distance) * speed;
        this.totalDistance = distance;
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
            
            // 포물선 궤도 계산
            // X축: 시작점에서 목표점까지 선형 이동
            this.x = this.originalStartX + (this.originalTargetX - this.originalStartX) * progress;
            
            // Y축: 포물선 궤도 (높이 포함)
            const parabola = 4 * this.peakHeight * progress * (1 - progress);
            this.y = this.originalStartY + (this.originalTargetY - this.originalStartY) * progress - parabola;
            
            return false;
        }
        
        // 일반 투사체 이동
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.traveledDistance += this.speed;
        
        // 목표에 도달했는지 확인
        const distanceToTarget = Math.sqrt(
            Math.pow(this.targetX - this.x, 2) + 
            Math.pow(this.targetY - this.y, 2)
        );
        
        if (distanceToTarget <= this.speed || this.traveledDistance >= this.totalDistance) {
            this.active = false;
            return true; // 충돌
        }
        
        return false;
    }
} 