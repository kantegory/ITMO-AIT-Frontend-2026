from sqlalchemy.orm import Session
from typing import TypeVar, Generic, Type, List
from .database import Base

T = TypeVar("T", bound=Base)

class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db

    def get_all(self) -> List[T]:
        return self.db.query(self.model).all()

    def create(self, obj_in: dict) -> T:
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

class AgentRepository(BaseRepository):
    pass

class SimulationRepository(BaseRepository):
    pass
