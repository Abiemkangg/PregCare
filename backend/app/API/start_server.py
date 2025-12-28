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
    
    try:
        uvicorn.run(
            "chat_api:app",  # Use string reference instead of direct app object
            host="0.0.0.0",
            port=8001,
            log_level="info",
            access_log=True,
            reload=False  # Disable reload for production
        )
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Server stopped by user")
    except Exception as e:
        print(f"\n[ERROR] Server crashed: {e}")
        import traceback
        traceback.print_exc()

