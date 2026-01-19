from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Url(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(Text, nullable=False)
    short_url = Column(String(10), unique=True, index=True, nullable=False)

