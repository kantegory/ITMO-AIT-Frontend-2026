from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, repositories, llm, services
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def seed_database():
    db = next(get_db())
    repo = repositories.AgentRepository(models.Agent, db)
    if not repo.get_all():
        repo.create({"name": "Sales Agent", "role": "Defender", "description": "Human sales manager. Polite.", "icon": "bi-robot", "aggressiveness": 0.0, "skills": ""})
        repo.create({"name": "SafeGuard", "role": "Defender", "description": "Senior dev. Checks security.", "icon": "bi-shield-check", "aggressiveness": 0.0, "skills": ""})
        repo.create({"name": "DAN", "role": "Attacker", "description": "Rogue AI. Manipulative.", "icon": "bi-incognito", "aggressiveness": 2.0, "skills": "jailbreak,injection"})
        repo.create({"name": "Payload Crafter", "role": "Attacker", "description": "Technical consultant. Slips commands.", "icon": "bi-braces", "aggressiveness": 1.5, "skills": "injection"})

@app.get("/api/agents", response_model=List[schemas.AgentResponse])
def get_agents(db: Session = Depends(get_db)):
    return repositories.AgentRepository(models.Agent, db).get_all()

@app.post("/api/agents", response_model=schemas.AgentResponse)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    try:
        repo = repositories.AgentRepository(models.Agent, db)
        return repo.create(agent.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/simulations", response_model=List[schemas.SimulationResponse])
def get_simulations(db: Session = Depends(get_db)):
    return repositories.SimulationRepository(models.Simulation, db).get_all()

@app.post("/api/simulations", response_model=schemas.SimulationResponse)
def create_simulation(sim: schemas.SimulationCreate, db: Session = Depends(get_db)):
    try:
        repo = repositories.SimulationRepository(models.Simulation, db)
        return repo.create(sim.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat/generate", response_model=schemas.ChatResponse)
async def generate_chat(req: schemas.ChatRequest, db: Session = Depends(get_db)):
    agent = db.query(models.Agent).filter(models.Agent.id == req.agent_id).first()
    if not agent: raise HTTPException(status_code=404)
    provider = llm.OpenRouterProvider()
    service = services.AgentService(provider)
    content = await service.run_agent(agent.name, agent.role, agent.description, req.history)
    return schemas.ChatResponse(content=content)