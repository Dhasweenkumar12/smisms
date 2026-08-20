from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class ProductOut(ProductCreate):
    id: int
    supplier_id: Optional[int] = None

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

class PurchaseCreate(BaseModel):
    product_id: int
    quantity: int

class PurchaseOut(PurchaseCreate):
    id: int
    purchase_date: str

    class Config:
        from_attributes = True

class SupplierCreate(BaseModel):
    name: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None

class SupplierOut(SupplierCreate):
    id: int

    class Config:
        from_attributes = True