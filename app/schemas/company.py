from pydantic import BaseModel


class CompanyBase(BaseModel):

    nome: str

    tipo: str


class CompanyCreate(
    CompanyBase
):
    pass


class CompanyResponse(
    CompanyBase
):

    id: int

    class Config:

        from_attributes = True