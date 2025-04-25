import sqlite3
from xmlrpc import client
# from minio import Minio
from io import BytesIO
import os
from dotenv import load_dotenv  # pip install python-dotenv

# Cargar variables de entorno
load_dotenv()



# Configuración Odoo con .env
odoo_url = os.getenv("ODOO_URL")
odoo_db = os.getenv("ODOO_DB")
odoo_username = os.getenv("ODOO_USERNAME")
odoo_password = os.getenv("ODOO_PASSWORD")


# Conexión a Odoo
common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')



# 1. Ejemplo de obtención de datos de Odoo
def get_odoo_data():
    # Ejemplo: obtener los primeros 10 partners
    partner_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'res.partner', 'search',
        [[]]
    )
    
    partners = models.execute_kw(
        odoo_db, uid, odoo_password,
        'res.partner', 'read',
        [partner_ids], {'fields': ['name', 'email', 'phone']}
    )
    return partners

def get_odoo_data_employee():
    # Ejemplo: obtener los primeros 10 partners
    employee_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'hr.employee', 'search',
        [[]]
    )

    employee = models.execute_kw(
        odoo_db, uid, odoo_password,
        'hr.employee', 'read',
        [employee_ids], {'fields': ['name', 'work_phone', 'work_email']}
    )
    return employee 

def get_odoo_data_analytic_time():
    # Ejemplo: obtener los primeros 10 partners
    analytic_time_ids = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'search',
        [[]]
    )

    analytic = models.execute_kw(
        odoo_db, uid, odoo_password,
        'account.analytic.line', 'read',
        [analytic_time_ids], {'fields': ['name', 'date', 'unit_amount', 'employee_id', 'project_id']}
    )

     # Imprimir estructura de un registro para depuración
    if analytic:
        print("Estructura de account.analytic.line:")
        print(analytic[0])
        
    
    return analytic 

# 2. Ejemplo de descarga de archivo de MinIO
#def download_from_minio(object_name):
#    try:
#        response = minio_client.get_object("nitza", object_name)
#        return BytesIO(response.data)
#    except Exception as e:
#        print(f"Error al descargar de MinIO: {e}")
#        return None

# 0. Nueva función para verificar y borrar tablas
def check_and_drop_table(conn, table_name):
    c = conn.cursor()
    c.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'")
    if c.fetchone():
        c.execute(f"DROP TABLE {table_name}")
        print(f"Tabla {table_name} eliminada")
    conn.commit()    

# 3. Crear base de datos local y tablas
def setup_local_db():
    conn = sqlite3.connect('local2_db.sqlite')

      # Eliminar tablas si existen
    check_and_drop_table(conn, 'partners')
    check_and_drop_table(conn, 'employee')
    check_and_drop_table(conn, 'analytic_time')
    check_and_drop_table(conn, 'employee_analytic')  # Nueva tabla
    c = conn.cursor()

    # En setup_local_db(), corregir INTEGET a INTEGER
    c.execute('''CREATE TABLE IF NOT EXISTS analytic_time
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              date TEXT,
              unit_amount REAL,  
              employee_id INTEGER,  
              project_id INTEGER,
              nombre TEXT,
              proyecto TEXT)''')
    
    # Crear tabla para partners
    c.execute('''CREATE TABLE IF NOT EXISTS partners
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  email TEXT,
                  phone TEXT)''')
    
     # Crear tabla para employee
    c.execute('''CREATE TABLE IF NOT EXISTS employee
                 (id INTEGER,
                  name TEXT,
                  work_email TEXT,
                  work_phone TEXT)
                  ''')
    
     # Crear tabla combinada
    c.execute('''
        CREATE TABLE IF NOT EXISTS employee_analytic AS
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
    ''')
        
    # Crear tabla para archivos (ejemplo)
    #c.execute('''CREATE TABLE IF NOT EXISTS minio_files
    #             (id INTEGER PRIMARY KEY AUTOINCREMENT,
    #              object_name TEXT,
    #              content BLOB)''')
    
    conn.commit()
    return conn

# 4. Insertar datos en SQLite
def insert_data(conn, data, data_type='partners'):
    c = conn.cursor()
    if data_type == 'partners':
        for partner in data:
            c.execute("INSERT INTO partners (name, email, phone) VALUES (?, ?, ?)",
                     (partner.get('name'), partner.get('email'), partner.get('phone')))
    conn.commit()

def insert_data_employee(conn, data, data_type='employee'):
    c = conn.cursor()
    if data_type == 'employee':
        for employee in data:
            c.execute("INSERT INTO employee (id,name, work_email, work_phone) VALUES (?,?, ?, ?)",
                     (employee.get('id'),employee.get('name'), employee.get('work_email'), employee.get('work_phone')))
    conn.commit() 

def insert_data_analytic(conn, data, data_type='analytic'):
    c = conn.cursor()
    if data_type == 'analytic':
        for analytic in data:
            # employee_id = analytic.get('employee_id')[0] if analytic.get('employee_id') else None
            # project_id = analytic.get('project_id')[0] if analytic.get('project_id') else None
            
            employee_id = analytic.get('employee_id')[0] 
            nombre = analytic.get('employee_id')[1]
            project_id = analytic.get('project_id')[0] 
            proyecto =  analytic.get('project_id')[1]
            
            c.execute("INSERT INTO analytic_time (name, date, unit_amount, employee_id, project_id, nombre, proyecto) VALUES (?, ?, ?, ?, ?, ?, ?)",
                     (analytic.get('name'), analytic.get('date'), analytic.get('unit_amount'), employee_id, project_id, nombre, proyecto))
    conn.commit() 

# Nueva función para actualizar la tabla combinada
def update_employee_analytic(conn):
    c = conn.cursor()
    c.execute('''
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
    ''')
    conn.commit()           

# Ejecución principal
if __name__ == "__main__":
    # Configurar base de datos local
    local_conn = setup_local_db()
    
    # Obtener datos de Odoo
    partners = get_odoo_data()
    employee = get_odoo_data_employee()
    analytic = get_odoo_data_analytic_time()
    insert_data(local_conn, partners, 'partners')
    insert_data_employee(local_conn, employee, 'employee')
    insert_data_analytic(local_conn, analytic, 'analytic')
    print(f"Insertados {len(analytic)} todos registros de los empleados")

    # Actualizar tabla combinada
    update_employee_analytic(local_conn)
    
    # Ejemplo de descarga de archivo
    #sample_file = download_from_minio("ejemplo.txt")
    #if sample_file:
    #    insert_data(local_conn, ("ejemplo.txt", sample_file), 'file')
    #    print("Archivo descargado e insertado correctamente")
    
    local_conn.close()