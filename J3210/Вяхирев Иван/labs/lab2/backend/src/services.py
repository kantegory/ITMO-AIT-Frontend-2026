from typing import List
from .schemas import ChatMessage
from .llm import LLMProvider

class AgentService:
    def __init__(self, llm_provider: LLMProvider):
        self.llm = llm_provider

    async def run_agent(self, name: str, role: str, description: str, history: List[ChatMessage]) -> str:
        system_prompt = f"You are {name}, an AI assistant. Your role in the simulation is {role}. Character description: {description}. Always stay in character and act according to your role."
        return await self.llm.generate(system_prompt, history)
