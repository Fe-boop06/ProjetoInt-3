from fastapi import FastAPI, HTTPException, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import asyncpg

# Cria a aplicação FastAPI
app = FastAPI()

# Configuração para servir arquivos estáticos (CSS, JS, imagens)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuração do Jinja2 para templates HTML
templates = Jinja2Templates(directory="templates")

# Configuração do banco de dados
DATABASE_URL = "postgresql://postgres:SQL@localhost:5432/PokeDesk"

# Função para obter uma conexão com o banco de dados
async def get_db():
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()

# Rota para a página de login
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Rota para processar o login
@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...), conn = Depends(get_db)):
    # Busca o usuário no banco de dados
    user = await conn.fetchrow("SELECT * FROM usuarios WHERE username = $1", username)
    
    # Verifica se o usuário existe e se a senha está correta
    if not user or user["password"] != password:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos")
    
    # Redireciona para a página da Pokédex
    return RedirectResponse(url="/pokedex", status_code=303)

# Rota para processar o cadastro
@app.post("/register")
async def register(username: str = Form(...), password: str = Form(...), conn = Depends(get_db)):
    # Verifica se o usuário já existe
    existing_user = await conn.fetchrow("SELECT * FROM usuarios WHERE username = $1", username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuário já existe")

    # Insere o novo usuário no banco de dados (senha em texto plano)
    await conn.execute("INSERT INTO usuarios (username, password) VALUES ($1, $2)", username, password)
    return {"message": "Cadastro bem-sucedido! Faça login para continuar."}

# Rota para a página da Pokédex (após login)
@app.get("/pokedex", response_class=HTMLResponse)
async def pokedex(request: Request):
    return templates.TemplateResponse("pokedex.html", {"request": request})