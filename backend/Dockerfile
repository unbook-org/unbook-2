FROM python:3.12-slim

# Evita criação de arquivos .pyc e garante logs em tempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Copia e instala as dependências Python (camada em cache e sem verificação de versão do pip)
COPY requirements.txt ./
RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

# Copia o código da aplicação
COPY . ./

# Porta padrão de exposição
EXPOSE 8080

# Comando padrão para ambiente de desenvolvimento com hot-reload
CMD ["uvicorn", "config.asgi:application", "--host", "0.0.0.0", "--port", "8080", "--reload"]
