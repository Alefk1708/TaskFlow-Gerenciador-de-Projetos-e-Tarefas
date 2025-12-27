from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Verifica se a URL foi carregada
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no .env")

# Cria a engine com configurações específicas para Supabase + Render
engine = create_engine(
    DATABASE_URL,
    pool_size=20,           # Aumentei um pouco para garantir fluidez
    max_overflow=0,         # Evita criar conexões extras desnecessárias
    pool_pre_ping=True,     # CRUCIAL: Testa a conexão antes de usar (evita erros de queda)
    connect_args={"prepare_threshold": None} 
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()