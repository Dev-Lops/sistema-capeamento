from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    role: str


class UserResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    role: str
    ativo: bool

    class Config:
        from_attributes = True