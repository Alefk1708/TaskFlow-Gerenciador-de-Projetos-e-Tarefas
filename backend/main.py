from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

import routers.auth
import routers.projects

Base.metadata.create_all(bind=engine)
origins = ["*"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"]
)
@app.get('/')
def status():
    return {"app": "TaskFlow API", "status": "Online"}

app.include_router(routers.auth.router)
app.include_router(routers.projects.router)