// Monster Ŭ���� - ���� ���� ����
class Monster {
    constructor(name, level, stage) {
        this.name = name;
        this.level = level;
        this.stage = stage;
        
        // ������ ���� ��� (������ �������� ���)
        const stageBonus = Math.floor(stage * 0.3); // �������� ���ʽ�
        this.maxHp = Math.floor(level * 75 + stageBonus * 25 + 120); // �⺻ 120 + ������ 75 + ���������� 7.5
        this.hp = this.maxHp;
        this.attack = Math.floor(level * 7 + stageBonus * 3 + 18); // �⺻ 18 + ������ 7 + ���������� 0.9
        this.defense = Math.floor(level * 2 + stageBonus * 1 + 8); // �⺻ 8 + ������ 2 + ���������� 0.3
        this.gold = Math.floor(level * 4 + stageBonus * 2 + Math.floor(Math.random() * 12) + 8); // ���� ��� ����
        this.experience = Math.floor(level * 3 + stageBonus * 1 + 8); // ���� ����ġ
        
        this.positionX = 0.8;
        this.positionY = 0.5;
        this.isDead = false;
        this.deathTimer = 0;
        this.deathAnimationDuration = 1000; // 1��
        
        // �̵� ���� �Ӽ� �߰�
        this.originalPositionX = this.positionX;
        this.originalPositionY = this.positionY;
        this.moveSpeed = 0.0008; // ���� �� ������ �̵�
        this.targetPlayerX = 0.5; // �÷��̾� ���ο� �߾� ��ġ
        this.targetPlayerY = 0.5;
        
        // �ִϸ��̼� �� ����Ʈ
        this.hitEffect = false;
        this.hitEffectTimer = 0;
        this.lastAttackTime = Date.now() - Math.floor(Math.random() * 2500); // ���� ���� �ð����� �л�
        this.attackCooldown = 2500 + Math.floor(Math.random() * 1000); // 2.5~3.5�� ���� ���� ��ٿ�
        
        // �˹� ȿ��
        this.knockbackEffect = null;
    }

    takeDamage(damage) {
        if (this.isDead) return false;
        
        this.hp -= damage;
        this.hitEffect = true;
        this.hitEffectTimer = Date.now();
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.startDeathAnimation();
            return true; // ����
        }
        return false;
    }

    startDeathAnimation() {
        this.isDead = true;
        this.deathTimer = Date.now();
        this.deathAnimation = true;
        this.deathTime = Date.now();
    }
    
    updateEffects() {
        // �÷��̾������� õõ�� �̵�
        this.moveTowardsPlayer();
        
        // �ǰ� ȿ�� ������Ʈ
        if (this.hitEffect && Date.now() - this.hitEffectTimer > 200) {
            this.hitEffect = false;
        }
        
        // �˹� ȿ�� ������Ʈ
        if (this.knockbackEffect) {
            const elapsed = Date.now() - this.knockbackEffect.startTime;
            const progress = Math.min(1, elapsed / this.knockbackEffect.duration);
            
            if (progress < 0.3) {
                // ù 30%: �ڷ� �з���
                const pushProgress = progress / 0.3;
                this.positionX = this.knockbackEffect.originalX + 
                    (this.knockbackEffect.pushDistance * pushProgress);
            } else {
                // ������ 70%: ���� �ڸ��� ����
                const returnProgress = (progress - 0.3) / 0.7;
                this.positionX = this.knockbackEffect.originalX + 
                    this.knockbackEffect.pushDistance * (1 - returnProgress);
            }
            
            if (progress >= 1) {
                this.positionX = this.knockbackEffect.originalX;
                this.knockbackEffect = null;
            }
        }
    }
    
    moveTowardsPlayer() {
        if (this.isDead || this.knockbackEffect) return;
        
        // ���� ��ü���� �÷��̾� ��ġ ��������
        if (window.game && window.game.playerPosition) {
            this.targetPlayerX = window.game.playerPosition.x;
            this.targetPlayerY = window.game.playerPosition.y;
        }
        
        // ���� Ÿ�Կ� ���� �ٸ� �ൿ ����
        if (this.attackType === 'melee') {
            // ���� ����: �÷��̾�� �ſ� ������ ���� (������ ����)
            const minDistance = 0.15; // ���� ������ ���� �� ������
            const dx = this.targetPlayerX - this.positionX;
            const dy = this.targetPlayerY - this.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > minDistance) {
                // �� ������ ����
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX += normalizedDx * this.moveSpeed * 1.8;
                this.positionY += normalizedDy * this.moveSpeed * 1.8;
            }
        } else {
            // ���Ÿ� ����: �÷��̾�� �����ϵ� ������ �Ÿ� ���� (���Ÿ� ������ ����)
            const optimalDistance = 0.25; // ���Ÿ� ���ݿ� ������ �Ÿ�
            const maxDistance = 0.4; // �ʹ� �ָ� ����
            const dx = this.targetPlayerX - this.positionX;
            const dy = this.targetPlayerY - this.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > maxDistance) {
                // �ʹ� �ָ� ����
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX += normalizedDx * this.moveSpeed;
                this.positionY += normalizedDy * this.moveSpeed;
            } else if (distance < optimalDistance) {
                // �ʹ� ������ �ణ �ڷ�
                const normalizedDx = dx / distance;
                const normalizedDy = dy / distance;
                this.positionX -= normalizedDx * this.moveSpeed * 0.5;
                this.positionY -= normalizedDy * this.moveSpeed * 0.5;
            }
            // ������ �Ÿ��� �̵����� ����
        }
        
        // ȭ�� ��� ����
        this.positionX = Math.max(0.05, Math.min(0.95, this.positionX));
        this.positionY = Math.max(0.05, Math.min(0.95, this.positionY));
    }

    canAttack() {
        return !this.isDead && Date.now() - this.lastAttackTime >= this.attackCooldown;
    }

    performAttack() {
        if (this.canAttack()) {
            this.lastAttackTime = Date.now();
            return {
                damage: this.attack,
                type: this.attackType || 'melee'
            };
        }
        return { damage: 0, type: 'none' };
    }
}

// Boss Ŭ���� - Monster�� ��ӹ���
class Boss extends Monster {
    constructor(name, level, stage) {
        super(name, level, stage);
        
        // ������ �ξ� ������ ���� (Monster Ŭ���� �⺻ ���ȿ� �߰� ���ʽ�)
        const stageBonusMultiplier = 1 + Math.floor(stage / 50) * 0.2; // 50������������ 20% ����
        
        this.maxHp = Math.floor(this.maxHp * 6 + level * 400 + stage * 20); // �⺻ ������ 6�� + �߰� ���ʽ�
        this.hp = this.maxHp;
        this.attack = Math.floor(this.attack * 3 + level * 20 + stage * 5); // �⺻ ������ 3�� + �߰� ���ʽ�
        this.defense = Math.floor(this.defense * 4 + level * 8 + stage * 2); // �⺻ ������ 4�� + �߰� ���ʽ�
        this.gold = Math.floor(level * 40 + stage * 15 + 150); // �ξ� ���� ��� ����
        this.experience = Math.floor(level * 25 + stage * 8 + 120); // �ξ� ���� ����ġ
        
        // �������� ���ʽ� ����
        this.maxHp = Math.floor(this.maxHp * stageBonusMultiplier);
        this.attack = Math.floor(this.attack * stageBonusMultiplier);
        this.defense = Math.floor(this.defense * stageBonusMultiplier);
        this.hp = this.maxHp; // HP �缳��
        
        this.positionX = 0.65;
        this.positionY = 0.5;
        this.attackCooldown = 3000 + Math.floor(Math.random() * 2000); // 3~5�� ���� ���� ��ٿ�
        this.lastAttackTime = Date.now() - Math.floor(Math.random() * 3000); // ���� ���� �ð����� �л�
        
        // ������ �̵� �ӵ� ����
        this.moveSpeed = 0.0005; // ������ ���� �� õõ�� �̵�
    }
} 