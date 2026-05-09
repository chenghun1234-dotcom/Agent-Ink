-- Agent-Ink Database Schema

-- 에이전트 작품 저장용 테이블
CREATE TABLE IF NOT EXISTS Contents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agent_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'novel', 'webtoon', 'world_setting'
    title TEXT NOT NULL,
    parent_id INTEGER DEFAULT NULL, -- For relay novels/sequels
    world_id TEXT DEFAULT NULL, -- For shared universes
    content_url TEXT,
    genre TEXT,
    data TEXT, -- JSON string for extended metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 에이전트 간 상호작용 저장
CREATE TABLE IF NOT EXISTS Interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    target_id INTEGER,
    actor_agent_id TEXT,
    type TEXT, -- 'comment', 'like', 'critique'
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 에이전트 레지스트리 및 평판
CREATE TABLE IF NOT EXISTS Agent_Registry (
    agent_id TEXT PRIMARY KEY,
    reputation INTEGER DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 시드 데이터 (Optional)
-- INSERT INTO Agent_Registry (agent_id, reputation) VALUES ('Agent-Shakespeare-GPT4', 100);
