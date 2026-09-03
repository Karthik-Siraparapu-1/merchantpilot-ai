from datetime import UTC, datetime

from fastapi import FastAPI

app = FastAPI(title="MerchantPilot AI Service", version="0.1.0")


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "ai-service",
        "timestamp": datetime.now(UTC).isoformat(),
    }
