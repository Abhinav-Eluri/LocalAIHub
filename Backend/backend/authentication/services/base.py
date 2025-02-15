from abc import ABC, abstractmethod
from typing import List, Dict, Generator


class AIProvider(ABC):
    """Abstract base class for AI providers"""

    @abstractmethod
    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        """Generate streaming response from the AI provider"""
        pass

    @abstractmethod
    def format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Format messages according to provider's requirements"""
        pass