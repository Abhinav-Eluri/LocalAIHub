from .base import AIProvider
from .offline_ollama import OfflineProvider
from .openai import OpenAIProvider
from .claude import ClaudeProvider
from .gemini import GeminiProvider


class AIProviderFactory:
    """Factory for creating AI providers"""

    @staticmethod
    def create_provider(provider_type: str, api_key: str) -> AIProvider:
        providers = {
            "openai": OpenAIProvider,
            "claude": ClaudeProvider,
            "gemini": GeminiProvider,
            "offline": OfflineProvider
        }

        if provider_type not in providers:
            raise ValueError(f"Unsupported provider: {provider_type}")

        return providers[provider_type](api_key)