import MySQLdb
from xmlrpc import client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys
import calendar

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

def setup_maria_db():
    try:
        conn = MySQLdb.connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
    except MySQLdb.Error as e:
        print("No puedo conectar a la base de datos:", e)
        sys.exit(1)
    print("Conexión correcta.")
    return conn

def get_odoo_analytic_data(domain):
    analytic_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'search',
        [domain]
    )

    analytics = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'read',
        [analytic_ids], {'fields': ['name', 'date', 'unit_amount', 'employee_id', 'project_id']}
    )
    
    if analytics:
        print(f"Encontrados {len(analytics)} registros para el dominio especificado")
        # print("Estructura de ejemplo:", analytics[0])
    else:
        print("No se encontraron registros para el dominio especificado.")
    
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

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python script.py <año YYYY> <mes MM>")
        sys.exit(1)
    
    year = sys.argv[1]
    month = sys.argv[2]
    print("Entre a : python script.py <año YYYY> <mes MM>")
    # Validar parámetros
    if len(year) != 4 or not year.isdigit():
        print("El año debe ser un número de 4 dígitos.")
        sys.exit(1)
        
    if not month.isdigit() or len(month) > 2 or int(month) < 1 or int(month) > 12:
        print("El mes debe ser un número entre 1 y 12.")
        sys.exit(1)
    
    # Formatear mes a dos dígitos
    month = month.zfill(2)
    
    try:
        year_int = int(year)
        month_int = int(month)
        # Calcular último día del mes
        last_day = calendar.monthrange(year_int, month_int)[1]
        date_start = f"{year}-{month}-01"
        date_end = f"{year}-{month}-{last_day}"
    except Exception as e:
        print(f"Error calculando el rango de fechas: {e}")
        sys.exit(1)

    # Configurar base de datos
    conn = setup_maria_db()
    
    # Crear dominio de búsqueda
    domain = [
        ['date', '>=', date_start],
        ['date', '<=', date_end]
    ]
    
    # Obtener datos de Odoo
    analytics = get_odoo_analytic_data(domain)
    
    # Insertar datos en MariaDB
    try:
        if analytics:
            insert_analytic_data(conn, analytics)
            print(f"Datos sincronizados exitosamente para {month}/{year}")
        else:
            print("No hay datos para sincronizar.")
    finally:
        conn.close()