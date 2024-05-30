# Base image with Python 3.8
FROM python:3.8


WORKDIR /app

COPY requirements.txt

RUN pip install -r requirements.txt

COPY . .

CMD ["python", "batch.py", "&", "python", "stream.py"]