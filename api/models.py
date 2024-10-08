from typing import List, Dict, Any
from enum import Enum
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str

class ChorusState:
    def __init__(self):
        self.messages: List[Message] = []
        self.current_step: ChorusStep = ChorusStep.ACTION
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
        self.current_step = ChorusStep.ACTION

class ChorusStep(Enum):
    ACTION = "action"
    EXPERIENCE = "experience"
    INTENTION = "intention"
    OBSERVATION = "observation"
    UPDATE = "update"
    YIELD = "yield"
