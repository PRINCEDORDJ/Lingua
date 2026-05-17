import os
from pathlib import Path

from dotenv import load_dotenv

_ROOT = Path(__file__).resolve().parent
_REPO_ROOT = _ROOT.parent


def load_env() -> None:
    """Load Stream and Gemini keys from the Expo app env, then local overrides."""
    load_dotenv(_REPO_ROOT / ".env.local")
    load_dotenv(_ROOT / ".env")

    # Match Expo server alias (lib/stream/server.ts)
    if not os.getenv("STREAM_API_SECRET") and os.getenv("STREAM_SECRET_KEY"):
        os.environ["STREAM_API_SECRET"] = os.environ["STREAM_SECRET_KEY"]
