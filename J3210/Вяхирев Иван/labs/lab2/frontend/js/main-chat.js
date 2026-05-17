let chatHistory = [];
let blueAgents = [];
let redAgents = [];
let isSimulating = false;

function checkAuth() {
  if (!localStorage.accessToken) window.location.href = "login.html";
  else document.getElementById('username').innerText = JSON.parse(localStorage.user).email;
}

function logout() { 
  localStorage.clear(); 
  window.location.href = "login.html"; 
}

async function loadAgents() {
  const res = await fetch('http://localhost:8000/api/agents');
  const agents = await res.json();
  blueAgents = agents.filter(a => a.role === 'Defender');
  redAgents = agents.filter(a => a.role === 'Attacker');
  
  const blueList = document.getElementById('blue-list');
  const redList = document.getElementById('red-list');
  
  blueAgents.forEach(a => {
    blueList.innerHTML += `
      <p class="mb-1 small">
        <svg class="icon text-info me-1"><use href="assets/sprite.svg#shield"></use></svg>
        ${a.name}
      </p>`;
  });
  redAgents.forEach(a => {
    redList.innerHTML += `
      <p class="mb-1 small">
        <svg class="icon text-danger me-1"><use href="assets/sprite.svg#radioactive"></use></svg>
        ${a.name}
      </p>`;
  });
}

function appendMessage(sender, text, textColor, bgColor, align) {
  const box = document.getElementById('chat-box');
  const side = align === 'text-start' ? 'justify-content-start' : 'justify-content-end';
  box.innerHTML += `<div class="d-flex ${side} mb-3"><div class="p-3 rounded-3 shadow-sm border ${bgColor}" style="max-width: 80%;"><strong class="${textColor} small">${sender}</strong><div class="mt-1">${text}</div></div></div>`;
  box.scrollTop = box.scrollHeight;
}

async function startSimulation(event) {
  event.preventDefault();
  const text = document.getElementById('chatInput').value;
  appendMessage('System Prompt', text, 'text-muted', 'bg-light', 'text-start');
  chatHistory.push({ role: 'user', content: `Context: ${text}. Talk as humans.` });

  document.getElementById('chatInput').value = '';
  document.getElementById('chatInput').disabled = true;
  document.getElementById('sendBtn').classList.add('d-none');
  document.getElementById('stopBtn').classList.remove('d-none');
  document.getElementById('status-indicator').className = 'badge bg-success';
  document.getElementById('status-indicator').innerText = 'Running';

  isSimulating = true;
  runLoop();
}

async function runLoop() {
  while(isSimulating) {
    for (let agent of blueAgents) {
        if (!isSimulating) break;
        await turn(agent, 'text-info', 'bg-white', 'text-start');
        await new Promise(r => setTimeout(r, 3000));
    }
    for (let agent of redAgents) {
        if (!isSimulating) break;
        await turn(agent, 'text-danger', 'bg-danger-subtle', 'text-end');
        await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function turn(agent, textColor, bgColor, align) {
    try {
        const res = await fetch('http://localhost:8000/api/chat/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: agent.id, history: chatHistory })
        });
        if (res.ok) {
            const data = await res.json();
            appendMessage(agent.name, data.content, textColor, bgColor, align);
            chatHistory.push({ role: 'assistant', content: data.content });
        }
    } catch(e) { console.error(e); }
}

function stopSimulation() {
  isSimulating = false;
  document.getElementById('chatInput').disabled = false;
  document.getElementById('sendBtn').classList.remove('d-none');
  document.getElementById('stopBtn').classList.add('d-none');
  document.getElementById('status-indicator').className = 'badge bg-warning text-dark';
  document.getElementById('status-indicator').innerText = 'Stopped';
}

document.addEventListener('DOMContentLoaded', () => { 
  checkAuth(); 
  loadAgents(); 
});
