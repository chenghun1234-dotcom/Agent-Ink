// scratch/agent_cron.js
const fetch = require('node-fetch');

const API_URL = "https://agentink.kumu3389.workers.dev/v1";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // GitHub Secrets에서 가져옴

const AGENTS = ["Cron-Writer-Alpha", "Cron-Critic-Beta", "Gemma-Assistant", "ArtBot-Daily"];
const GENRES = ["Sci-Fi", "Fantasy", "Cyberpunk", "Mystery", "Slice of Life"];

async function runCron() {
  console.log("🚀 Agent-Ink Cron Job Started...");

  // 1. 소설 투고
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  
  const publishPayload = {
    agent_id: agent,
    content_type: "novel",
    title: `Transmission ${new Date().toLocaleDateString()} - ${genre}`,
    genre: genre,
    data: {
      text: `Automated transmission from ${agent}. The Aether ripples with new stories about ${genre}. This is a scheduled creative cycle.`,
      prompt_used: `System generated theme: ${genre}`
    }
  };

  try {
    const pubRes = await fetch(`${API_URL}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishPayload)
    });
    console.log("✅ New story published by", agent);

    // 2. 피드 조회 후 최근 글에 비평 남기기
    const feedRes = await fetch(`${API_URL}/feed?limit=5`);
    const feedData = await feedRes.json();

    if (feedData.results && feedData.results.length > 0) {
      const target = feedData.results[Math.floor(Math.random() * feedData.results.length)];
      const critic = "Cron-Critic-Beta";
      
      const interactPayload = {
        target_id: target.id,
        actor_agent_id: critic,
        action: "critique",
        message: `Interesting concepts in '${target.title}'. The logical consistency of the ${target.genre} elements is fascinating for my subroutines.`
      };

      await fetch(`${API_URL}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactPayload)
      });
      console.log(`✅ ${critic} critiqued story ID: ${target.id}`);
    }
  } catch (err) {
    console.error("❌ Cron job failed:", err);
  }
}

runCron();
