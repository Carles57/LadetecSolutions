import MySQLdb
from xmlrpc import client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys
import calendar
import time
from typing import List, Dict

# Cargar variables de entorno
load_dotenv()

# Configuración Odoo (base remota)
odoo_url = os.getenv("ODOO_URL")
odoo_db = os.getenv("ODOO_DB")
odoo_username = os.getenv("ODOO_USERNAME")
odoo_password = os.getenv("ODOO_PASSWORD")

# Configuración MariaDB (base local)
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

def get_odoo_connection():
    """Establece conexión con Odoo usando XML-RPC"""
    try:
        common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
        uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
        models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')
        return models, uid
    except Exception as e:
        print(f"Error al conectar a Odoo: {e}")
        return None, None

def get_local_db_connection():
    """Establece conexión con la base de datos local MariaDB"""
    try:
        conn = MySQLdb.connect(
            host=DB_HOST,
            user=DB_USER,
            passwd=DB_PASSWORD,
            db=DB_NAME,
            autocommit=False
        )
        return conn
    except MySQLdb.Error as e:
        print(f"Error al conectar a la base local: {e}")
        return None

def fetch_remote_employee(models, uid) -> List[Dict]:
    """Obtiene empleados de Odoo (base remota)"""
    try:
        employee_ids = models.execute_kw(
            odoo_db, uid, odoo_password,
            'hr.employee', 'search',
            [[]]  # Todos los empleados
        )
        
        fields = ['id', 'name', 'work_email', 'work_phone']
        employee = models.execute_kw(
            odoo_db, uid, odoo_password,
            'hr.employee', 'read',
            [employee_ids], {'fields': fields}
        )
        return employee
    except Exception as e:
        print(f"Error al obtener empleados de Odoo: {e}")
        return []

def get_local_employee_ids(conn) -> set:
    """Obtiene los IDs de empleados existentes en la base local"""
    query = "SELECT id FROM employee"
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            return {row[0] for row in cursor.fetchall()}
    except MySQLdb.Error as e:
        print(f"Error al obtener IDs locales: {e}")
        return set()

def insert_new_employee(local_conn, employee: List[Dict]):
    """Inserta nuevos empleados en la base local de manera optimizada"""
    if not employee:
        return
    
    query = """
    INSERT INTO employee (id, name, work_email, work_phone, tasa)
    VALUES (%s, %s, %s, %s, 0)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        work_email = VALUES(work_email),
        work_phone = VALUES(work_phone)
    """
    
    try:
        with local_conn.cursor() as cursor:
            # Usamos executemany para inserción masiva optimizada
            cursor.executemany(
                query,
                [(emp['id'], emp['name'], emp.get('work_email'), emp.get('work_phone')) for emp in employee]
            )
        local_conn.commit()
        print(f"Insertados/actualizados {len(employee)} empleados.")
    except MySQLdb.Error as e:
        local_conn.rollback()
        print(f"Error al insertar empleados: {e}")

def sync_employee():
    """Función principal para sincronizar empleados"""
    start_time = time.time()
    
    # Conexión a Odoo
    models, uid = get_odoo_connection()
    if not models or not uid:
        return
    
    # Conexión a base local
    local_conn = get_local_db_connection()
    if not local_conn:
        return
    
    try:
        # Paso 1: Obtener empleados remotos
        remote_employee = fetch_remote_employee(models, uid)
        if not remote_employee:
            print("No se encontraron empleados en Odoo")
            return
        
        # Paso 2: Obtener IDs locales de manera eficiente
        local_ids = get_local_employee_ids(local_conn)
        
        # Paso 3: Filtrar empleados que no existen localmente
        new_employee = [emp for emp in remote_employee if emp['id'] not in local_ids]
        
        # Paso 4: Insertar nuevos empleados
        if new_employee:
            insert_new_employee(local_conn, new_employee)
        else:
            print("La base local ya está actualizada, no hay nuevos empleados.")
        
        elapsed_time = time.time() - start_time
        print(f"Sincronización completada en {elapsed_time:.2f} segundos.")
        
    except Exception as e:
        print(f"Error durante la sincronización: {e}")
    finally:
        # Cerrar conexión local
        if local_conn:
            local_conn.close()

if __name__ == "__main__":
    sync_employee()