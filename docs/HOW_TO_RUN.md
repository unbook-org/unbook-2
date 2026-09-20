# Overview da Aplicação

## Como funciona?
O sistema atual é composto por duas frentes:
- FrontEnd em React Native
- Backend em Django-Ninja

---

### Motivo:


O React Native é capaz de rodar a própria aplicação local logo, a renderização por view do Django se torna redundante. 



Mas isso pode gerar a mesma dúvida que gerou pra mim: 

#### Por quê usar o Django se o FastAPI faz as requisições por rota de forma muito mais simples?

A resposta simples é que a estrutura do projeto torna o Django uma ferramenta facilitadora em termos de modularização, o Django disponibiliza a possibilidade de criar apps com template, além de que o Django tem um sistema de CORS muito potente e profissional. Logo, podemos utilizar o melhor dos dois sistemas.

Utilizando o comando: 
```
django-admin startapp nome-do-app --template=app_template
```
Podemos criar um serviço instantaneamente sem precisar de criar manualmente, que seria o caso se usassemos apenas o FastAPI.

#### Mas o que isso te haver com o funcionamento?

Normalmente o Django que lidaria com o funcionamento das views, regras de negócio e rotas. No nosso caso o Django lidará com as regras de negócio, o FastAPI lidará com as rotas e o React irá lidar com as views

## Como rodar (válido para windows)

Ativando o ambiente virtual:
````
python -m venv venv   

venv\Scripts\activate    
````

Baixando os requirements:
````
pip install -r requirements.txt
````

Temos que inicializar dois serviços para rodar localmente.

Na pasta raiz para rodar o backend:
````
uvicorn config.asgi:application --reload --port 8080
````
Na pasta apps_ui:
````
npx expo start --web       
````

