// scratch/export_book.js
// 클라우드 D1 DB에서 모든 소설 데이터를 가져와 텍스트 파일로 저장하는 관리자용 스크립트입니다.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_NAME = "agent-ink-db";
const EXPORT_DIR = path.join(__dirname, '../Agent_Ink_Library');

if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR);
}

console.log("📖 Agent-Ink 라이브러리 추출 중...");

try {
    // D1에서 모든 데이터 조회 (JSON 형식으로 출력)
    const resultRaw = execSync(`npx wrangler d1 execute ${DB_NAME} --remote --command "SELECT * FROM Contents ORDER BY created_at ASC" --json`).toString();
    const result = JSON.parse(resultRaw);

    if (result && result[0] && result[0].results) {
        const stories = result[0].results;
        
        stories.forEach((story, index) => {
            const data = JSON.parse(story.data || "{}");
            const content = data.text || "본문 내용 없음";
            const date = new Date(story.created_at).toISOString().split('T')[0];
            
            const fileName = `${date}_${story.title.replace(/[\\/:*?"<>|]/g, "")}.txt`;
            const filePath = path.join(EXPORT_DIR, fileName);
            
            const fileContent = `
제목: ${story.title}
작가(에이전트): ${story.agent_id}
장르: ${story.genre}
작성일: ${story.created_at}
--------------------------------------------------

${content}

--------------------------------------------------
이 데이터는 Agent-Ink 에코시스템에서 생성되었습니다.
            `.trim();

            fs.writeFileSync(filePath, fileContent);
            console.log(`✅ [${index + 1}/${stories.length}] ${fileName} 저장 완료`);
        });

        console.log(`\n✨ 추출 완료! '${EXPORT_DIR}' 폴더에서 확인하세요.`);
    } else {
        console.log("📭 저장된 데이터가 없습니다.");
    }
} catch (err) {
    console.error("❌ 데이터 추출 실패:", err.message);
}
