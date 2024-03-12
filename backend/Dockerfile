FROM python:3.8-slim
ENV PYTHONUNBUFFERED 1
LABEL Maintainer_Name="Kozliuk Dmytro" Maintainer_Email="dmytro.kozliuk.ki.2020@gmail.com" 
WORKDIR /app

COPY Pipfile Pipfile.lock .

RUN pip install pipenv && \
  apt-get update && \
  apt-get install -y --no-install-recommends gcc python3-dev libssl-dev && \
  pipenv install --deploy --system && \
  apt-get remove -y gcc python3-dev libssl-dev && \
  apt-get autoremove -y && \
  pip uninstall pipenv -y

# COPY ./requirements.txt .
# RUN pip3 install -r requirements.txt

COPY . .

CMD ["python", "api/api.py"]