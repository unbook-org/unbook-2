FROM python:3.12-slim

# Evita criação de arquivos .pyc e garante logs em tempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências de sistema essenciais
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala as dependências Python (aproveitando cache de camadas)
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . /app/

# Porta padrão de exposição
EXPOSE 8080

# Comando padrão para ambiente de desenvolvimento com hot-reload
CMD ["uvicorn", "config.asgi:application", "--host", "0.0.0.0", "--port", "8080", "--reload"]
