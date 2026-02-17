# Definimos la imagen base para la aplicación Django
FROM python:3.11.6-slim-bullseye

RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev build-essential -y

COPY requirements/ requirements/

RUN pip install -r requirements/production.txt

# Instalamos los paquetes necesarios
   
COPY . code/

WORKDIR /code

# Definimos las variables de entorno
ENV PYTHONUNBUFFERED=1
