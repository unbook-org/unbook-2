FROM node:20-alpine

WORKDIR /app

# Copia os manifestos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta padrão do Expo / Metro Bundler
EXPOSE 8081

# Inicia o servidor de desenvolvimento do Expo
CMD ["npx", "expo", "start"]
