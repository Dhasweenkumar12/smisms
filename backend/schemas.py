from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class ProductOut(ProductCreate):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str