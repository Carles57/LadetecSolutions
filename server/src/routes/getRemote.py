import mariadb
from xmlrpc import client
import os
import sys
from dotenv import load_dotenv

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
DB_PORT = int(os.getenv("DB_PORT", 3306))

# Conexión a Odoo
common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')

def get_connection():
    try:
        return mariadb.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB: {e}")
        sys.exit(1)

def get_odoo_data_analytic_time(date):
    analytic_time_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'search',
        [[['date', '=', date]]]
    )

    if not analytic_time_ids:
        return []

    analytic = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'read',
        [analytic_time_ids], {'fields': ['name', 'date', 'unit_amount', 'employee_id', 'project_id']}
    )

    if analytic:
        print(f"Encontrados {len(analytic)} registros para la fecha {date}")
        
    return analytic

def insert_data_analytic(conn, data):
    cursor = conn.cursor()
    
    # Limpiar datos existentes para la fecha
    try:
        cursor.execute('DELETE FROM analytic_time WHERE date = ?', (data[0]['date'],))
    except IndexError:
        return  # No hay datos para limpiar
    
    insert_query = '''
    INSERT INTO analytic_time 
        (name, date, unit_amount, employee_id, project_id, nombre, proyecto) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    '''
    
    values = []
    for analytic in data:
        employee = analytic.get('employee_id', [None, ''])
        project = analytic.get('project_id', [None, ''])
        
        values.append((
            analytic.get('name', 'Sin nombre'),
            analytic.get('date'),
            float(analytic.get('unit_amount', 0.0)),
            employee[0],
            project[0],
            employee[1] if len(employee) > 1 else 'Sin nombre',
            project[1] if len(project) > 1 else 'Sin proyecto'
        ))
    
    try:
        cursor.executemany(insert_query, values)
        conn.commit()
        print(f"Insertados {len(values)} registros en MariaDB")
    except mariadb.Error as e:
        print(f"Error inserting data: {e}")
        conn.rollback()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python script.py <fecha_en_formato_YYYY-MM-DD>")
        sys.exit(1)
    
    date = sys.argv[1]
    
    # Validar formato de fecha
    if not len(date) == 10 or date[4] != '-' or date[7] != '-':
        print("Formato de fecha inválido. Use YYYY-MM-DD")
        sys.exit(1)
    
    # Obtener datos de Odoo
    analytic_data = get_odoo_data_analytic_time(date)
    
    if not analytic_data:
        print(f"No se encontraron registros para la fecha {date}")
        sys.exit(0)
    
    # Insertar en MariaDB
    conn = get_connection()
    try:
        insert_data_analytic(conn, analytic_data)
    finally:
        conn.close()