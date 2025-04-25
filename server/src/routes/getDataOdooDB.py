#import mariadb
import MySQLdb
from xmlrpc import client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys

# Cargar variables de entorno
load_dotenv()

# Configuración Odoo con .env
odoo_url = os.getenv("ODOO_URL")
odoo_db = os.getenv("ODOO_DB")
odoo_username = os.getenv("ODOO_USERNAME")
odoo_password = os.getenv("ODOO_PASSWORD")

# Configuración MariaDB
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# Conexión a Odoo
common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')

#def get_db_connection():

def setup_maria_db():
    #conn = get_maria_connection()

    try:
           conn = MySQLdb.connect(DB_HOST,DB_USER ,DB_PASSWORD, DB_NAME )
    except MySQLdb.Error as e:
	       print("No puedo conectar a la base de datos:",e)
	       sys.exit(1)
    print("Conexión correcta.")
    return conn
    
    #conn.commit()
    #conn.close()

def get_odoo_data_analytic_time(date_filter):
    analytic_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'search',
        [[['date', '=', date_filter]]]
    )

    analytics = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'read',
        [analytic_ids], {'fields': ['name', 'date', 'unit_amount', 'employee_id', 'project_id']}
    )
    
    if analytics:
        print(f"Encontrados {len(analytics)} registros para la fecha {date_filter}")
        print("Estructura de ejemplo:", analytics[0])
    
    return analytics




def insert_analytic_data(conn, data):
    cursor = conn.cursor()
    for analytic in data:
        try:
            employee_id = analytic['employee_id'][0] if analytic['employee_id'] else None
            nombre = analytic['employee_id'][1] if analytic['employee_id'] else None
            project_id = analytic['project_id'][0] if analytic['project_id'] else None
            proyecto = analytic['project_id'][1] if analytic['project_id'] else None
            
            cursor.execute("""
                INSERT INTO analytic_time 
                (name, date, unit_amount, employee_id, project_id, nombre, proyecto) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (analytic.get('name'), analytic.get('date'), analytic.get('unit_amount'), 
                 employee_id, project_id, nombre, proyecto))
        except MySQLdb.Error as e:
            print(f"Error al insertar registro: {e}")
            conn.rollback()
            raise
    conn.commit()

def update_employee_analytic(conn, date_filter):
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO employee_analytic
        SELECT 
            e.id AS employee_id,
            e.name AS employee_name,
            e.work_email,
            e.work_phone,
            a.date,
            a.unit_amount,
            a.project_id,
            a.proyecto AS project_name,
            a.name AS analytic_name
        FROM employee e
        INNER JOIN analytic_time a ON e.id = a.employee_id
        WHERE a.date = %s
    ''', (date_filter,))
    conn.commit()
    

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python script.py <fecha YYYY-MM-DD>")
        sys.exit(1)
    
    date_filter = sys.argv[1]
    
    try:
        # Validar formato de fecha
        datetime.strptime(date_filter, '%Y-%m-%d')
    except ValueError:
        print("Formato de fecha inválido. Use YYYY-MM-DD")
        sys.exit(1)
    
    # Configurar base de datos
    conn = setup_maria_db()
    
    # Obtener datos de Odoo
    analytics = get_odoo_data_analytic_time(date_filter)
    
    # Insertar datos en MariaDB
    #conn = get_maria_connection()
    try:
        insert_analytic_data(conn, analytics)
        #update_employee_analytic(conn, date_filter)
        print(f"Datos sincronizados exitosamente para {date_filter}")
    finally:
        conn.close()