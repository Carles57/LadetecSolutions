import MySQLdb
from xmlrpc import client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys

# Cargar variables de entorno
load_dotenv()

# Configuración MariaDB
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

try:
	db = MySQLdb.connect(DB_HOST,DB_USER ,DB_PASSWORD, DB_NAME )
except MySQLdb.Error as e:
	print("No puedo conectar a la base de datos:",e)
	sys.exit(1)
print("Conexión correcta.")
db.close()