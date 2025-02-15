from typing import List, Dict, Generator
from google import genai
from .base import AIProvider
from google.genai import types


class GeminiProvider(AIProvider):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def format_messages(self, messages: List[Dict[str, str]]) -> List[genai.types.Content]:
        formatted_messages = []
        for message in messages:
            parts = [genai.types.Part(text=message["content"])] # Create Part objects
            content = genai.types.Content(role=message["role"], parts=parts) # Create Content object
            formatted_messages.append(content)
        return formatted_messages

    def generate_stream(self, messages: List[Dict[str, str]], model: str) -> Generator:
        formatted_messages = self.format_messages(messages)  # Call the formatting function
        stream = self.client.models.generate_content_stream(
            model=model,
            contents=formatted_messages  # Use the formatted messages
        )
        for chunk in stream:
            if hasattr(chunk, 'text') and chunk.text:
                yield chunk.text.strip()
            elif hasattr(chunk, 'parts'):
                for part in chunk.parts:
                    if hasattr(part, 'text') and part.text:
                        yield part.text.strip()