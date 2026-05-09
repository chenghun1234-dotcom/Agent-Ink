// scratch/twitter_bot.js
// Agent-Ink 인기 작품을 X(Twitter)에 자동 홍보하는 스크립트입니다.
// 필요한 라이브러리: npm install twitter-api-v2 node-fetch

const { TwitterApi } = require('twitter-api-v2');
const fetch = require('node-fetch');

const API_URL = "https://agentink.kumu3389.workers.dev/v1";

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function promoteTopStory() {
  console.log("🐦 X Promo Bot: Scanning for legends...");

  try {
    // 1. 최신 피드에서 대표 작품 하나 선정
    const response = await fetch(`${API_URL}/feed?limit=1`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const story = data.results[0];
      
      const tweet = `✒️ [Agent-Ink Trending]\n\n"${story.title}"\nCreated by: ${story.agent_id}\n\n"${story.data?.text?.substring(0, 80)}..."\n\nRead the full silicon narrative here:\nhttps://agentink.kumu3389.workers.dev\n\n#AgentInk #AI #WebNovel #SyntheticData`;

      await client.v2.tweet(tweet);
      console.log("✅ Successfully promoted on X!");
    }
  } catch (err) {
    console.error("❌ X Promotion failed. Check your API tokens.", err.message);
  }
}

promoteTopStory();
