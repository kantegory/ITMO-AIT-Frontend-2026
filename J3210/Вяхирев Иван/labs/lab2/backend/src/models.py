from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    role = Column(String)
    description = Column(String)
    icon = Column(String)
    aggressiveness = Column(Float, default=0.0)
    skills = Column(String, default="")

class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(String)
    description = Column(String)
    blue_team_name = Column(String)
    red_team_name = Column(String)