from typing import List, Dict, Generator

import openai
from .base import AIProvider


class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    def format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        return messages

    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        stream = self.client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content