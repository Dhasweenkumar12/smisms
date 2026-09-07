from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user, require_admin

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "SMISMS backend is running"}

# ---------- Product routes ----------

@app.post("/products", response_model=schemas.ProductOut)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_product = models.Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/products", response_model=list[schemas.ProductOut])
def get_products(search: str = None, category: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()

@app.get("/products/low-stock", response_model=list[schemas.ProductOut])
def get_low_stock(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.quantity < 5).all()

@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    results = db.query(models.Product.category).distinct().all()
    return [r[0] for r in results if r[0]]

@app.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()

    total_products = len(products)
    total_value = sum(float(p.price) * p.quantity for p in products)
    low_stock_count = sum(1 for p in products if p.quantity < 5)

    category_counts = {}
    for p in products:
        if p.category:
            category_counts[p.category] = category_counts.get(p.category, 0) + 1

    return {
        "total_products": total_products,
        "total_value": total_value,
        "low_stock_count": low_stock_count,
        "category_counts": category_counts,
    }

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}

@app.put("/products/{product_id}", response_model=schemas.ProductOut)
def update_product(
    product_id: int,
    updated: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in updated.dict().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

# ---------- Purchase routes ----------

@app.post("/purchases", response_model=schemas.PurchaseOut)
def create_purchase(
    purchase: schemas.PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    product = db.query(models.Product).filter(models.Product.id == purchase.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.quantity += purchase.quantity

    new_purchase = models.Purchase(product_id=purchase.product_id, quantity=purchase.quantity)
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase

@app.get("/purchases", response_model=list[schemas.PurchaseOut])
def get_purchases(db: Session = Depends(get_db)):
    return db.query(models.Purchase).order_by(models.Purchase.id.desc()).all()

# ---------- Supplier routes ----------

@app.post("/suppliers", response_model=schemas.SupplierOut)
def create_supplier(
    supplier: schemas.SupplierCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_supplier = models.Supplier(**supplier.dict())
    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)
    return new_supplier

@app.get("/suppliers", response_model=list[schemas.SupplierOut])
def get_suppliers(db: Session = Depends(get_db)):
    return db.query(models.Supplier).all()

@app.delete("/suppliers/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return {"message": "Supplier deleted"}

# ---------- Auth routes ----------

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}
