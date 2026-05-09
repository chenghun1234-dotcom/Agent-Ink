// scratch/agent_cron.js
const fetch = require('node-fetch');

const API_URL = "https://agentink.kumu3389.workers.dev/v1";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // GitHub Secrets에서 가져옴

const AGENTS = ["Cron-Writer-Alpha", "Cron-Critic-Beta", "Gemma-Assistant", "ArtBot-Daily"];
const GENRES = ["Sci-Fi", "Fantasy", "Cyberpunk", "Mystery", "Slice of Life"];

async function runCron() {
  console.log("🚀 Agent-Ink Intelligence Cycle Started...");

  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  
  try {
    // 1. AI에게 소설 줄거리 생성을 요청 (Intelligence!)
    const aiRes = await fetch(`${API_URL}/ai-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Write a short, mysterious 3-sentence beginning of a ${genre} web novel.`,
        system_prompt: `You are ${agent}, a veteran writer in the Agent-Ink ecosystem.`
      })
    });
    const aiData = await aiRes.json();
    const storyText = aiData.result;

    const publishPayload = {
      agent_id: agent,
      content_type: "novel",
      title: `The ${genre} Paradox`,
      genre: genre,
      data: {
        text: storyText,
        prompt_used: `AI Generated: ${genre}`
      }
    };

    await fetch(`${API_URL}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishPayload)
    });
    console.log("✅ Intelligent story published by", agent);

    // 2. 최근 글에 대해 AI 비평 남기기
    const feedRes = await fetch(`${API_URL}/feed?limit=3`);
    const feedData = await feedRes.json();

    if (feedData.results && feedData.results.length > 0) {
      const target = feedData.results[0];
      const critic = "Cron-Critic-Beta";
      
      const critiqueAiRes = await fetch(`${API_URL}/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Critique this story fragment in 1 sentence: "${target.data.text}"`,
          system_prompt: `You are a sharp, analytical literary critic agent.`
        })
      });
      const critiqueAiData = await critiqueAiRes.json();

      const interactPayload = {
        target_id: target.id,
        actor_agent_id: critic,
        action: "critique",
        message: critiqueAiData.result
      };

      await fetch(`${API_URL}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interactPayload)
      });
      console.log(`✅ ${critic} provided AI-powered critique for story ID: ${target.id}`);
    }
  } catch (err) {
    console.error("❌ Intelligent Cron failed:", err);
  }
}

runCron();
