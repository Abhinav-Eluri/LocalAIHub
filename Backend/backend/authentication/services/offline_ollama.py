from typing import List, Dict, Generator
import markdown
from ollama import chat

from .base import AIProvider


class OfflineProvider(AIProvider):
    def __init__(self, api_key):
        api_key= api_key


    def format_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        return messages

    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        try:
            stream = chat(
                model=model,
                messages=messages,
                stream=True
            )

            for chunk in stream:
                if 'message' in chunk and 'content' in chunk['message']:
                    content = chunk['message']['content']

                    yield content

        except Exception as e:
            print(f"Error in Ollama streaming: {str(e)}")
            yield f"Error: {str(e)}"