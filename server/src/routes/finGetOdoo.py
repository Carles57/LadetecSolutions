from xmlrpc import client
import os
import sys
from dotenv import load_dotenv
import mariadb

from urllib.parse import urlparse

# Cargar variables de entorno
load_dotenv()

# Configuración Odoo
odoo_url = os.getenv("ODOO_URL")
odoo_db = os.getenv("ODOO_DB")
odoo_username = os.getenv("ODOO_USERNAME")
odoo_password = os.getenv("ODOO_PASSWORD")
print(f"🔍 URL: {odoo_url}")
print(f"🔍 PASS: {odoo_password}")


# Configuración MariaDB
DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'database': os.getenv("DB_NAME"),
    'port': int(os.getenv("DB_PORT", 3306))
}

# Conexión a Odoo (sin cambios)

print(f"🔍 LLego a conexion...")
common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')
print(f"🔍 Paso la conexion...")



def connect_to_odoo():
    try:
        # Validación básica de URL
        print(f"🔍 Entrando a conexion...")
        if not urlparse(odoo_url).scheme:
            raise ValueError("La URL de Odoo debe incluir el protocolo (http/https)")
            
        print("🔍 Intentando conexión con Odoo...")
        
        with xmlrpc.client.ServerProxy(odoo_url, allow_none=True) as common:
            uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
            
            if not uid:
                raise PermissionError("Credenciales inválidas o usuario inactivo")
                
            models = xmlrpc.client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')
            print("✅ Conexión exitosa con Odoo")
            return uid, models
            
    except xmlrpc.client.ProtocolError as err:
        print(f"⚠️ Error de red: Verifica que el servidor esté disponible en {odoo_url}")
        print(f"Detalle técnico: {err}")
        raise
    except Exception as err:
        print(f"❌ Error durante la conexión: {str(err)}")
        raise

def get_db_connection():
    """Establece conexión a MariaDB"""
    try:
        return mariadb.connect(**DB_CONFIG)
    except mariadb.Error as e:
        print(f"Error conectando a MariaDB: {e}")
        sys.exit(1)

def get_odoo_data_analytic_time(date):
    """Obtiene datos de Odoo filtrados por fecha (única función modificada)"""
    analytic_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'search',
        [[['date', '=', date]]]
    )

    return models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'read',
        [analytic_ids], {'fields': ['name', 'date', 'unit_amount', 'employee_id', 'project_id']}
    ) if analytic_ids else []

def insert_analytic_data(conn, data):
    """Inserta datos en MariaDB (versión modificada)"""
    cursor = conn.cursor()
    try:
        # Limpiar datos existentes para la fecha
        if data:
            delete_query = "DELETE FROM analytic_time WHERE date = %s"
            cursor.execute(delete_query, (data[0]['date'],))
        
        # Insertar nuevos registros
        insert_query = '''INSERT INTO analytic_time 
            (name, date, unit_amount, employee_id, project_id, nombre, proyecto)
            VALUES (%s, %s, %s, %s, %s, %s, %s)'''
        
        values = [
            (
                item.get('name', 'Sin nombre'),
                item.get('date'),
                item.get('unit_amount', 0.0),
                item.get('employee_id', [None, ''])[0],
                item.get('project_id', [None, ''])[0],
                item.get('employee_id', [None, ''])[1] or 'Sin nombre',
                item.get('project_id', [None, ''])[1] or 'Sin proyecto'
            )
            for item in data
        ]
        
        cursor.executemany(insert_query, values)
        conn.commit()
        print(f"Insertados {len(values)} registros")
        
    except mariadb.Error as e:
        print(f"Error en operación de base de datos: {e}")
        conn.rollback()
    finally:
        cursor.close()

if __name__ == "__main__":
    # Validar parámetro de fecha
    print("✅ Inicio del script")  # Confirmación de entrada al main
    
    # Validar parámetro de fecha
    if len(sys.argv) != 2:
        print("Uso: python script.py <YYYY-MM-DD>")
        sys.exit(1)
    
    date = sys.argv[1]
    print(f"🔍 Fecha recibida: {date}")

   
    
    date = sys.argv[1]
    if not (len(date) == 10 and date[4] == '-' and date[7] == '-'):
        print("Formato de fecha inválido. Use YYYY-MM-DD")
        sys.exit(1)

    # Obtener y procesar datos
    conn = get_db_connection()
    try:
        analytic_data = get_odoo_data_analytic_time(date)
        if analytic_data:
            insert_analytic_data(conn, analytic_data)
        else:
            print(f"No se encontraron registros para {date}")
    finally:
        conn.close()