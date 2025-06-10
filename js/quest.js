// Quest 클래스 - 퀘스트 관련 로직
class Quest {
    constructor(id, description, target, current = 0, reward = {}) {
        this.id = id;
        this.description = description;
        this.target = target;
        this.current = current;
        this.reward = reward;
        this.completed = false;
    }

    updateProgress(amount) {
        if (!this.completed) {
            this.current = Math.min(this.target, this.current + amount);
            if (this.current >= this.target) {
                this.completed = true;
            }
        }
    }
} 