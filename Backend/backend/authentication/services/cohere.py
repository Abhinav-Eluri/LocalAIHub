from typing import List, Dict, Generator

from .base import AIProvider
from cohere import ClientV2


class CohereProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = ClientV2(api_key=api_key)

    def format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        pass

    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        try:
            stream = self.client.chat_stream(
                model=model,
                messages=messages
            )
            for chunk in stream:
                if chunk:
                    if chunk.type == "content-delta":
                        yield chunk.delta.message.content.text
        except Exception as e:
            raise Exception("Hacing Trouble", e)
