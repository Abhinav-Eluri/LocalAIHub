from typing import List, Dict, Generator

from anthropic import Anthropic
from .base import AIProvider


class ClaudeProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)

    def format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        pass

    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        with self.client.messages.stream(
                max_tokens=5000,
                messages=messages,
                model=model,
        ) as stream:
            for text in stream.text_stream:
                yield text