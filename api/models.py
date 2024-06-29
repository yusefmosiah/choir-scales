from typing import List, Dict, Any
from enum import Enum

class Message(Dict):
    role: str
    content: str

class VowelLoopState:
    def __init__(self):
        self.messages: List[Message] = []
        self.current_step: VowelLoopStep = VowelLoopStep.ACTION
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
        self.current_step = VowelLoopStep.ACTION

class VowelLoopStep(Enum):
    ACTION = "action"
    EXPERIENCE = "experience"
    INTENTION = "intention"
    OBSERVATION = "observation"
    UPDATE = "update"
    YIELD = "yield"
