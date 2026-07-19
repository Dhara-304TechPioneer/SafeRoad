from sqlalchemy import create_engine, text

url = 'postgresql+psycopg://postgres:postgres@127.0.0.1:5432/postgres'
engine = create_engine(url)
with engine.connect() as conn:
    print(conn.execute(text('select version()')).scalar())
