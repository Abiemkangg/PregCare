"""
Start FastAPI server script - wrapper to avoid multiprocessing issues
"""
import sys
import os
from pathlib import Path

# Add training to path
TRAINING_PATH = Path(__file__).parent.parent.parent / "training"
sys.path.insert(0, str(TRAINING_PATH))

# Set environment
from dotenv import load_dotenv
load_dotenv(TRAINING_PATH / ".env")

# Import app
from chat_api import app

if __name__ == "__main__":
    import uvicorn
    print("Starting PregCare RAG API Server...")
    print("Server at: http://localhost:8001")
    print("API docs: http://localhost:8001/docs")
    print("Press CTRL+C to stop")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info",
        access_log=True
    )
