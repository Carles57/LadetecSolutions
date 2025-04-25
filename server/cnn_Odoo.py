from xmlrpc import client

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
    else:
        print("Error: No se pudo autenticar con Odoo. Verifica las credenciales.")
except Exception as e:
    print(f"Error al conectar a Odoo: {e}")