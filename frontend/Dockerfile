FROM node:20-alpine

WORKDIR /app

# Copia os manifestos de dependências
COPY package*.json ./

# Instala dependências de forma reproduzível e limpa o cache do npm na mesma camada
RUN npm ci --no-audit --no-fund && \
    npm cache clean --force

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Expo / Metro Bundler
EXPOSE 8081

# Inicia o servidor de desenvolvimento do Expo
CMD ["npx", "expo", "start"]
