from pydantic import BaseModel, HttpUrl


class URLRequest(BaseModel):
    original_url: HttpUrl

    class Config:
        from_attributes = True


class URLResponse(BaseModel):
    id: int
    original_url: str
    short_url: str

    class Config:
        from_attributes = True