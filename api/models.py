from typing import List, Dict, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import json

class ChorusStepEnum(str, Enum):
    # todo: merge yield and final
    ACTION = "action"
    EXPERIENCE = "experience"
    INTENTION = "intention"
    OBSERVATION = "observation"
    UPDATE = "update"
    YIELD = "yield"
    FINAL = "final"
    ERROR = "error"

class Message(BaseModel):
    role: str
    content: str

class ChorusState:
    def __init__(self):
        self.messages: List[Message] = []
        self.current_step: ChorusStepEnum = ChorusStepEnum.ACTION
        self.is_complete: bool = False
        self.is_interrupted: bool = False

    def reset(self):
        self.__init__()

    def complete(self):
        self.is_complete = True

    def interrupt(self):
        self.is_interrupted = True

    def clear_interrupt(self):
        self.is_interrupted = False

    def loop(self):
        self.current_step = ChorusStepEnum.ACTION

class Source(BaseModel):
    id: str
    content: str
    created_at: Optional[datetime] = None
    agent: Optional[str] = None
    token_value: Optional[int] = 0
    similarity: Optional[float] = 0.0

    @field_validator('created_at', mode='before')
    def parse_created_at(cls, value):
        if value in (None, ''):
            return None
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            try:
                return datetime.fromisoformat(value)
            except ValueError:
                return None
        return None

    model_config = {
        "json_encoders": {
            datetime: lambda v: v.isoformat() if v else None
        }
    }

class ChorusResponse(BaseModel):
    step: str
    content: str
    sources: Optional[List[Source]] = None

    model_config = {
        "json_encoders": {
            datetime: lambda v: v.isoformat() if v else None
        }
    }

    def to_json(self):
        return json.dumps(self.dict(), default=str)
