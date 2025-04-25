import MySQLdb
import os
from dotenv import load_dotenv
load_dotenv()

try:
    conn = MySQLdb.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    print("¡Conexión exitosa con MySQLdb!")
    conn.close()
except Exception as e:
    print("Error:", e)