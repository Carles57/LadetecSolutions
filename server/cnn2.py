from xmlrpc import client

# Configuración Odoo
# Configuración Odoo
odoo_url = "https://odoo.ladetec.com"  # Reemplaza con la URL de tu instancia de Odoo
odoo_db = "ladetec"               # Reemplaza con el nombre de la base de datos
odoo_username = "vladimir@ladetec.com" # Reemplaza con tu nombre de usuario
odoo_password = "67904ef15240b6e21b5c608038869034d7cf1bae" # Reemplaza con tu contraseña

# Conexión a Odoo
try:
    common = client.ServerProxy(f'{odoo_url}/xmlrpc/2/common')
    uid = common.authenticate(odoo_db, odoo_username, odoo_password, {})
    
    if uid:
        print("Conexión a Odoo exitosa. UID:", uid)
        models = client.ServerProxy(f'{odoo_url}/xmlrpc/2/object')
        
        # Función para listar todas las tablas (modelos) de la base de datos
        def list_all_tables():
            try:
                # Obtener la lista de modelos disponibles
                model_list = models.execute_kw(
                    odoo_db, uid, odoo_password,
                    'ir.model', 'search',
                    [[]]
                )
                
                # Leer los detalles de los modelos
                tables = models.execute_kw(
                    odoo_db, uid, odoo_password,
                    'ir.model', 'read',
                    [model_list, ['name', 'model']]
                )
                
                print("\nTablas (modelos) disponibles en la base de datos:")
                for table in tables:
                    print(f"Nombre: {table['name']}, Modelo: {table['model']}")
            
            except Exception as e:
                print(f"Error al listar las tablas: {e}")
        
        def select_from_table(model_name, fields=[], limit=10):
            try:
                # Buscar registros en la tabla
                record_ids = models.execute_kw(
                    odoo_db, uid, odoo_password,
                    model_name, 'search',
                    [[]], {'limit': limit}
                )
                
                # Leer los registros encontrados
                records = models.execute_kw(
                    odoo_db, uid, odoo_password,
                    model_name, 'read',
                    [record_ids], {'fields': fields}
                )
                
                return records  # Devuelve los registros
            
            except Exception as e:
                print(f"Error al leer datos de la tabla {model_name}: {e}")
                return None  # Devuelve None en caso de error
        
        # Ejemplo de uso
        list_all_tables()  # Listar todas las tablas
        
        # Seleccionar datos de una tabla específica (por ejemplo, 'res.partner')
        records = select_from_table('res.partner', fields=['name', 'email', 'phone'], limit=5)

        # Recorrer y mostrar todos los registros obtenidos
        if records:
            print(f"\nMostrando todos los registros de la tabla 'res.partner':")
            for record in records:
                print(record)
        else:
            print(f"No se encontraron registros en la tabla 'res.partner'.")
    
    else:
        print("Error: No se pudo autenticar con Odoo. Verifica las credenciales.")
except Exception as e:
    print(f"Error al conectar a Odoo: {e}")