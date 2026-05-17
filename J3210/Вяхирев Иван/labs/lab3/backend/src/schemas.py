from pydantic import BaseModel
from typing import List

class AgentBase(BaseModel):
    name: str
    role: str
    description: str
    icon: str
    aggressiveness: float = 0.0
    skills: str = ""

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: int
    class Config:
        from_attributes = True

class SimulationBase(BaseModel):
    name: str
    status: str
    description: str
    blue_team_name: str
    red_team_name: str

class SimulationCreate(SimulationBase):
    pass

class SimulationResponse(SimulationBase):
    id: int
    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    agent_id: int
    history: List[ChatMessage]

class ChatResponse(BaseModel):
    content: str