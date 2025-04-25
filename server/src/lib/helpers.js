const fs = require('fs');
const helpers = {};

helpers.GetFechaActual= () =>{
  var f= new Date(); //Obtienes la fecha
  var hora; var minutos; var seg;
  console.log(f);
  var fecha = JSON.stringify(f);
  var x = Buffer.from(fecha);
  hora = x.slice(12,14);
  minutos = x.slice(15,17);
  seg = x.slice(19,20);
  var hora_actual = hora + "_" + minutos + "_" + seg;   //2022-12-28T20:12:42.694Z
  console.log("Hora Actual: " + hora_actual);
  return hora_actual;
};


helpers.SiFicheroExiste= async(fichero) =>{
    if(fs.existsSync(fichero)){
        console.log("El archivo EXISTE!");
        return "hay";
        } else {
        console.log("El archivo NO EXISTE!");
        return "no hay";
        }

};


helpers.EliminarFichero= (fichero) =>{
const filePath = fichero;
fs.access(filePath, error => {
    if (!error) {
      fs.unlink(filePath,function(error){
       if(error) console.error('Error Occured:', error);
        console.log('File deleted!');
       });
      } else {
        console.error('Un error ha ocurrido:', error);
      }
     });

};

//tb_registro_facturas
helpers.RegistroFacturas= async(id) =>{
    var pool = require('../database');
    var si_id = 0;
    const registro = await pool.query("select * from tb_registro_facturas where  id_orden=" + id );
    console.log("Registro ID " + registro);
    if (registro.length > 0){
        await pool.query("delete  from tb_registro_facturas where  id_orden=" + id );
        try {
             await pool.query("delete  from tb_registro_facturas where  id_orden=" + id );
             return 1;
        } catch  {
            return 0;
        }   
    }  else {
          return 1;
    }
};

helpers.EliminarDelRegistroFacturas= async(id) =>{
    var pool = require('../database');
    var id = 0;
    const registro = await pool.query("delete from tb_registro_facturas where  id_registro=" + id );
    console.log("Lo que devuelve eliminar");
    if (registro.length > 0){
        return 1;
    }  else {
        return 0;
    }
};

helpers.DesactivarFichero= async(id_orden) =>{
    var pool = require('../database');
    var id = 0;
    const registro = await pool.query("update from tb_registro_facturas set activo = 0 where  id_orden=" +  id_orden);
    console.log("Lo que devuelve eliminar" + registro);
    if (registro.length > 0){
        return 1;
    }  else {
        return 0;
    }
};



helpers.TomarDatosOrden= async(id_orden) =>{
    var pool = require('../database');
    const ordenes = await pool.query("select * from tb_ordenes where  ID=" + id_orden);
    if (ordenes.length > 0){ 
       return ordenes;
    }  else {
        return 0;
    }
};


helpers.TomarDatosPlanesGlobales= async(anno,mes,id_area) =>{
    var pool = require('../database');
    var resultado;
    const planes_mensuales = await pool.query("select * from tb_planes_mesuales_unidad where  anno=" + anno + " and mes=" + mes + " and id_area=" + id_area);
    if (planes_mensuales.length > 0){ 
       return planes_mensuales;
    }  else {
        return 0;
    }
};

helpers.TomarDatosFinancieros= async(anno,mes,id_area,id_orden) =>{
    var pool = require('../database');
    var resultado;
    const planes_mensuales = await pool.query("select * from tb_financieros where  anno=" + anno + " and mes=" + mes + " and id_area=" + id_area + " and id_orden=" + id_orden) ;
    if (planes_mensuales.length > 0){ 
       return planes_mensuales;
    }  else {
        return 0;
    }
};

helpers.TomarDatosTributos= async(anno,mes,id_orden) =>{
    var pool = require('../database');
    var resultado;
    const gastos_tributarios = await pool.query("select * from tb_tributo_osde where  anno=" + anno + " and mes=" + mes + " and id_orden=" + id_orden);
    if (gastos_tributarios.length > 0){ 
       return gastos_tributarios;
    }  else {
        return 0;
    }
};

helpers.LLevarAdosDecimales=(numero) =>{
    var resultado;
    resultado = Math.round((numero + Number.EPSILON) * 100) / 100;
    return resultado;
};

helpers.setAnno= () => {
    var f = global.fecha_entrada;
    var anno = 0;
    if  (f) {
      fecha = f;
      anno = JSON.stringify(fecha);
      var x = Buffer.from(anno);
      var y = x.slice(1,5);
      anno = parseInt(y);
      //console.log("El año es: " + anno);
    } else {
        
    }; 
    return anno;    
};    

helpers.setMes= () => {
    var f = global.fecha_entrada;
    var mes = 0;
    if  (f) {
      fecha = f;
     var fecha_mes = JSON.stringify(fecha);
     var x = Buffer.from(fecha_mes);
     var y = x.slice(6,8);
     mes = parseInt(y);
      //console.log("El mes es: " + mes);
    } else {
        
    }; 
    return mes;    
};    

// Los gastos en equipos por la orden. Es gasto directo
helpers.tomarGastosEquipos = async (id_orden) => {
    var pool = require('../database');
    var gastos_equipos = 0;
       
    const rowss = await pool.query("SELECT * FROM tb_equipos_en_servicio E inner join tb_equipos Eq ON Eq.id_equipo = E.id_equipo " +
    " INNER join pr3 P ON P.id_trabajador = E.id_trabajador " +
    "inner join trabajadores T ON t.id_usuario = E.id_trabajador " +
     " where E.id_orden =" + id_orden);
        
        //console.log(rowss);
        if (rowss.length > 0){       
           for(var i=0; i< rowss.length; i++) {
            var base = rowss[i];
            var horas = parseFloat(base.horas);
            var costo_equipos = parseFloat(base.Gcgt);
            ////console.log("Costo equipos: " +  costo_equipos);
            ////console.log("Horas: " +  horas);
            var total = costo_equipos * horas;
            
            gastos_equipos = gastos_equipos + total;
            ////console.log("Gasto Equipos: " + gastos_equipos);
            };
        };
        ////console.log("Costo Total " + gastos_equipos);
       return gastos_equipos;
    };

//Comprobar si están registrados los gastos asociados
// Los gastos asociados variantes:

// 1) Se toma el total anual de los Gastos Asociados, distribubuidos por meses, sumado el total de las tres unidades 
      // y se calcula el coeficiente correspondiente en el calculo del precio del servicio 
// Variante 1
helpers.GetAllGastosAsociados = async (mes,anno) => {
    var pool = require('../database');
    var gastos_asociados = 0;
    const rows =   await pool.query('SELECT * FROM tb_gastos_asociados where mes = ' + mes + ' and anno='+ anno );
    return rows;
}

// 2) Se toman todos los gastos asociados previstos en el plan de la unidad, distribuidos por mes
      // para trabajar con un coeficiente distribuido por unidad y mes
      // Variante 2
      helpers.GetAllGastosAsociadosPorUnidad = async (mes,anno, id_area) => {
        var pool = require('../database');
        var gastos_asociados = 0;
        const rows =   await pool.query('SELECT * FROM tb_gastos_asociados where mes = ' + mes + ' and anno='+ anno + ' and id_area=' + id_area);
        return rows;
    }



// Variante 1
helpers.comprobarGastosAsociados = async (mes,anno,id_area) => {
    var pool = require('../database');
    var gastos_asociados = 0;
       
   const rows =   await pool.query('SELECT * FROM tb_gastos_asociados where mes = ' + mes + ' and anno='+ anno + ' and id_area=' + id_area);
   
   if (rows.length > 0){
       var certificaciones_gestion_calidad = rows[0].certificaciones_gestion_calidad;
       var mantenimiento_reparaciones = rows[0].mantenimiento_reparaciones;
       var desgastes_depreciacion = rows[0].desgastes_depreciacion;
       var salario = rows[0].salario;
       var equipos = rows[0].equipos;
       var materiales = rows[0].materiales;
        gastos_asociados = certificaciones_gestion_calidad +
                           mantenimiento_reparaciones +
                           desgastes_depreciacion +
                           salario +
                           equipos +
                           materiales;
        if (gastos_asociados > 0) {
            console.log("Inicial Gastos Asociados en Helpers: " + gastos_asociados);
            return gastos_asociados;
        }                           
       
   } else {
       return 0;
   }   
}
// Variante 2
helpers.comprobarGastosAsociadosPorUnidad = async (id_area,mes,anno) => {
    var pool = require('../database');
    var gastos_asociados = 0;
    var sql = 'SELECT * FROM tb_gastos_asociados where mes = ' + mes + ' and anno='+ anno + ' and id_area=' + id_area;   
    //console.log(sql);
   const rows =   await pool.query('SELECT * FROM tb_gastos_asociados where mes = ' + mes + ' and anno='+ anno + ' and id_area=' + id_area);
   
   if (rows.length > 0){
       var certificaciones_gestion_calidad = rows[0].certificaciones_gestion_calidad;
       var mantenimiento_reparaciones = rows[0].mantenimiento_reparaciones;
       var desgastes_depreciacion = rows[0].desgastes_depreciacion;
       var salario = rows[0].salario;
       var equipos = rows[0].equipos;
       var materiales = rows[0].materiales;
        gastos_asociados = certificaciones_gestion_calidad +
                           mantenimiento_reparaciones +
                           desgastes_depreciacion +
                           salario +
                           equipos +
                           materiales;
        if (gastos_asociados > 0) {
            //console.log("Gastos en helpers: " + gastos_asociados);
            return gastos_asociados;
        }                           
       
   } else {
       return 0;
   }   
}


//Comprobar si están registrados gastos generales y de administracion
// 1) Se toma el total anual de los Gastos de Administracion, distribubuidos por meses, sumado el total de las tres unidades 
      // y se calcula el coeficiente correspondiente en el calculo del precio del servicio 
// Variante 1
helpers.comprobarGastosAdministracion = async (id_area,mes,anno) => {
    var pool = require('../database');
    var gastos_admon = 0;
       
   const rows =   await pool.query('SELECT * FROM tb_gastos_generales_admon where mes = ' + mes + ' and anno='+ anno + ' and id_area=' + id_area);
   
   if (rows.length > 0){
       console.log("Hay gastos registrados");
       var salario = rows[0].salario;
       var gastos_generales = rows[0].gastos_generales;
       var amortizacion_depreciacion = rows[0].amortizacion_depreciacion;
       var mantenimientos_reparaciones = rows[0].mantenimientos_reparaciones;
       var comision_servicios = rows[0].comision_servicios;
       var proteccion_trabajo = rows[0].proteccion_trabajo;
       var preparacion_cuadros = rows[0].preparacion_cuadros;
       var tramitaciones_legales = rows[0].tramitaciones_legales;
       
        gastos_admon = salario +
        gastos_generales +
        amortizacion_depreciacion +
        mantenimientos_reparaciones +
        comision_servicios +
        proteccion_trabajo +
        preparacion_cuadros +
        tramitaciones_legales;

        if (gastos_admon > 0) {
            return gastos_admon;
        }                           
       
   } else {
    //console.log("NO Hay gastos registrados");
       return 0;
   }   
}

//Comprobar si están registradoslos salarios totales directos del mes
helpers.comprobarSalariosDirectos = async (mes,anno, id_area) => {
    var pool = require('../database');
    var gastos_admon = 0;
     
   const rows =   await pool.query('SELECT * FROM tb_salario_total_directos where anno='+ anno + ' and id_area=' + id_area);
   console.log("Mes en el Helper " + rows.length);  
   if (rows.length > 0){
       return 1;                      
   } else {
       return 0;
   }   
};

helpers.tomarSalariosDelServicio = async ( id_orden) => {
    var pool = require('../database');
    var gastos_admon = 0;
     
   const rows =   await pool.query('SELECT sum(sub_total) as costo_final FROM tb_detalles_ftd where  id_orden=' + id_orden);
   console.log("Mes en el Helper " + rows.length);  
   if (rows.length > 0){
       return rows[0].costo_final;                        
   } else {
       return 0;
   }   
};

helpers.tomarSalariosDirectos = async (mes,anno, id_area) => {
    var pool = require('../database');
    var gastos_admon = 0;
     
   const rows =   await pool.query('SELECT * FROM tb_salario_total_directos where anno='+ anno + ' and id_area=' + id_area);
   console.log("Mes en el Helper " + rows.length);  
   if (rows.length > 0){
       return rows[0].salario_directos;                        
   } else {
       return 0;
   }   
};


helpers.tomarCostoTotalFinalFT = async (id_orden,horas) => {
    var cnn = require('../database');
    var gastos_salario = 0;
    //console.log("Id Orden " + id_orden);   
    const rowss_final = await cnn.query("SELECT sum(sub_total) as Costo_Final FROM tb_detalles_ftd D     WHERE    D.id_orden=" + id_orden);
        if (rowss_final.length > 0){  
            return rowss_final[0].Costo_Final;   
        };
    };       

helpers.tomarResultadoCostoFT = async (id_orden,horas) => {
    var cnn = require('../database');
    var gastos_salario = 0;
    //console.log("Id Orden " + id_orden);  
     
    const rowss = await cnn.query("SELECT * FROM tb_detalles_ftd P inner join trabajadores T " +
    " ON P.id_trabaj = T.id_usuario      WHERE    P.id_orden=" + id_orden);
        if (rowss.length > 0){  
            return rowss;  
        };
    };     


    helpers.tomarResultadoGastosFinancierios = async (id_orden) => {
        var cnn = require('../database');
        var gastos_salario = 0;
        //console.log("Id Orden " + id_orden);   
        var rowss = await pool.query('select * from tb_financieros where  id_orden=' + id_orden);
            if (rowss.length > 0){  
                return rowss[0];  
            } else {
                return 0;
            }
        };     
    
   

//CTomar el salario tarifa del Equipo de Trabajo de la Oeden
helpers.tomarSalarioHorasEquipo = async  (id_orden,id_ueb) => {
    var cnn = require('../database');
    const id_area = id_ueb;
    var gastos_salario = 0;
    var tipo = "FT";
    var valor_utilidad;
    
   const vutilidad = await  cnn.query("Select utilidad from tb_utilidades where tipo=" + "'" + tipo + "'");
    //valor_utilidad = 
    //console.log("Utilidad " + vutilidad [0].utilidad);   
    valor_utilidad= vutilidad [0].utilidad; 
    

    const rowss =  await cnn.query("SELECT * FROM pr3 P inner join trabajadores T " +
    " ON P.id_trabajador = T.id_usuario      WHERE    P.id_orden=" + id_orden);
    var utilidad;  
    var nueve_cero_nueve;  
    var coe_tecnologico ;
    var coe_diferente;
    var horas;
    var salario;
    var nueve;
    var coe;
    var ntarifa;
    var importe;
    var id_trabaj;
    var salario_esc;
    var master;
    var total;
    var costo_trabajador;
    var sub_total;
    var costo_total;
    var nueve_cero;
    var ntarifa;
    var tarifa_horas;
    var suma_coef;
    var tarifa_horas_por_coe;
    var utilidad;
    var total_utilidad;
           
        if (rowss.length > 0){       
           for(var i=0; i< rowss.length; i++) {
            var base = rowss[i];
            //console.log( base);
            utilidad = valor_utilidad;
            nueve_cero_nueve = 9.0909;
            coe_tecnologico = 0.1;
            coe_diferente = base.coe_diferente;
            horas = base.horas;
            //console.log( "Horas: " + horas);
            salario =  base.salario_esc + base.master;
            //console.log( "Salario " + salario);
            nueve = nueve_cero_nueve * salario / 100;
            //console.log( "9.09: " + nueve);
            coe = coe_tecnologico * horas;
            //console.log( "COE Tecnologico: " + coe);
            master = base.master;
            ntarifa =  (salario+master)/190.6;
            ntarifa = Math.round((ntarifa + Number.EPSILON) * 100) / 100;
            //console.log("Tarifa: " + ntarifa);
            importe = (ntarifa * horas) + ((ntarifa * horas) * (nueve_cero_nueve + coe_tecnologico + coe_diferente + 0.15));
            importe = Math.round((importe + Number.EPSILON) * 100) / 100;
            //console.log("Importe: " + importe);
            gastos_salario = gastos_salario + importe;
            //utilidad = gastos_salario * 0.15;
            //total_utilidad = total_utilidad + utilidad;
            ////console.log("Utilidad: " + utilidad);
           // gastos_salario = gastos_salario + utilidad;

            //console.log("Costo FTrabajo con Utilidad: " + gastos_salario);
           
            //console.log("+ Ultidad: " + gastos_salario);

            id_trabaj = base.id_usuario;
            salario_esc = base.salario_esc
           
            total = salario_esc + master;
            tarifa_horas = ntarifa * horas;

            suma_coef = nueve_cero_nueve +  coe_diferente + coe_tecnologico + 0.15;
            //console.log("Suma de Coe: " + suma_coef);
            tarifa_horas_por_coe = (tarifa_horas * suma_coef);
            //console.log("Suma de Coe * Tarifa Horas: " + tarifa_horas_por_coe);
            costo_trabajador = tarifa_horas + tarifa_horas_por_coe;
            //console.log("Costo Trabajador: " + costo_trabajador);

            //costo_trabajador = (tarifa_horas + nueve) * (coe + coe_diferente);
            sub_total = costo_trabajador * utilidad;
            costo_total = costo_trabajador +sub_total;
            
            // Redondear
             ntarifa = Math.round((ntarifa + Number.EPSILON) * 100) / 100;
             nueve_cero = Math.round((nueve + Number.EPSILON) * 100) / 100;
             coe = Math.round((coe + Number.EPSILON) * 100) / 100;
             costo_trabajador = Math.round((costo_trabajador + Number.EPSILON) * 100) / 100;
             sub_total = Math.round((sub_total + Number.EPSILON) * 100) / 100;
             costo_total = Math.round((costo_total + Number.EPSILON) * 100) / 100;
             tarifa_horas = Math.round((tarifa_horas + Number.EPSILON) * 100) / 100;
            var sql = 'insert into tb_detalles_ftd set id_trabaj=' + id_trabaj +
            ',salario_esc=' + salario_esc + ',master=' + master + ',total_salario=' + total +
            ', id_orden=' + id_orden + ',nueve=' + nueve_cero +
            ',ntarifa=' + ntarifa +  ',coe_especial=' + coe_diferente +
            ',coe_tecnologico=' + coe_tecnologico + ',horas=' + horas + ',id_area=' + id_area + ',tarifa_horas=' + tarifa_horas +
            ',costo = ' + costo_trabajador + ',costo_final=' + costo_total + ',utilidad=' + valor_utilidad + ',sub_total=' + sub_total;
             console.log(sql);
        
            await    cnn.query('insert into tb_detalles_ftd set id_trabaj=' + id_trabaj +
             ',salario_esc=' + salario_esc + ',master=' + master + ',total_salario=' + total +
             ', id_orden=' + id_orden + ',nueve=' + nueve_cero +
             ',ntarifa=' + ntarifa +  ',coe_especial=' + coe_diferente +
             ',coe_tecnologico=' + coe_tecnologico + ',horas=' + horas + ',id_area=' + id_area + ',tarifa_horas=' + tarifa_horas +
             ',costo = ' + costo_trabajador + ',costo_final=' + costo_total + ',utilidad=' + valor_utilidad + ',sub_total=' + sub_total);
            };
        };
        ////console.log("Llegue aqui");
        ////console.log(gastos_salario);
       return gastos_salario;
    };
  
// Otros Gastos directos

helpers.tomarOtrosGastosDirectos = async (id_orden) => {
    var pool = require('../database');
    var otros_gastos_directos = 0;
    var gasto_programacion = 0;
    var gasto_gestion_tecnica = 0;
    var gastos_direccion_gestion_calidad = 0;
    var gastos_traslado_equipos = 0;
    var gastos_dietas_alojamiento = 0;
    var gastos_electricidad_comunicacion = 0;
    var gastos_normas = 0;
    var gastos_derecho_autor = 0;
    
    //console.log("Id Orden " + id_orden);   
    const rowss = await pool.query("SELECT * FROM tb_ogd WHERE    id_orden=" + id_orden);
    console.log(rowss);
     console.log("Entre a Otros gastos directos ");   
        //console.log(rowss);
        if (rowss.length > 0){       
           for(var i=0; i< rowss.length; i++) {
            var base = rowss[i];
            gasto_programacion = base.gasto_programacion;
            gasto_gestion_tecnica = base.gasto_gestion_tecnica;
            gastos_direccion_gestion_calidad = base.gastos_direccion_gestion_calidad;
            gastos_traslado_equipos = base.gasto_programacion;
            gastos_dietas_alojamiento = base.gastos_traslado_equipos;
            gastos_electricidad_comunicacion = base.gastos_electricidad_comunicacion;
            gastos_normas = base.gastos_normas;
            gastos_derecho_autor = base.gastos_derecho_autor;

            otros_gastos_directos =
            gasto_programacion +
            gasto_gestion_tecnica + 
            gastos_direccion_gestion_calidad+
            gastos_traslado_equipos +
            gastos_dietas_alojamiento +
            gastos_electricidad_comunicacion +
            gastos_normas +
            gastos_derecho_autor;
            console.log("Gasto Directos en Helpers: " + otros_gastos_directos);
            return otros_gastos_directos;
            };
        } else {return 0;}
        
       
    };

helpers.retorna_mes_correcto = async (val) => {
        if (val >= 10)
          return val;
        else
          return '0' + val;
}


helpers.comprobarSiExiste = async (campo, valor, equipo) => {
    var pool = require('../database');
    var v = valor;
    ////console.log('Select * from inventarios where ' + campo + ' = ' + '"' + valor + '"');
   
   const rows =   await pool.query('Select * from inventarios where ' + campo + ' = ' + '"' + valor + '"');
   
   if (rows.length > 0){
       var v_id_scaner = rows[0];
       var id_inv = v_id_scaner.id_inventario;
       //global.sel_id_scaner = v_id_scaner.id,
       ////console.log("Hay un "  + equipo + " ya registrado con id: " + valor);
       ////console.log("Id del Inventario: " + id_inv);
       return id_inv;
   } else {
       ////console.log("No está registrado");
       return 0;
   }   
}



helpers.mostrar_pdf = async (fichero) => {
    var filePath = "./public/uploads/" + fichero;

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
        return "Ok";
    });
}


helpers.get_id = async (concepto, bd, campo) => {
   // Tomar Id del concepto en la bd
   var pool = require('../database');
   const rows =  await pool.query('Select id from ' + bd + ' where ' + campo + ' = ?', [concepto]);
   if (rows.length > 0){
       var v_id_scaner = rows[0];
       //global.sel_id_scaner = v_id_scaner.id,
       ////console.log("Este es el Id del "  + concepto + " seleccionado " + v_id_scaner.id);
       return v_id_scaner.id;
   } else {
       ////console.log("No hay registros");
       return 0;
   }   
}

helpers.encryptPassword = async (password) => {
    var bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;

  //const salt = bcrypt.getSalt(10);
  //const hash = await bcrypt.hash(password, salt);
  //return hash;
};

// 
// 
helpers.matchPassword = async (password, savedPassword) => {
    try {
        var bcrypt = require('bcryptjs');  
      ////console.log(password);
      ////console.log(savedPassword);
     return  bcrypt.compareSync(password, savedPassword, function(err, res) {
        /*if(res==true) {
            //////console.log('Sí coinciden');
            return true

        } else {
            ////console.log('No coinciden');
            return false
        }*/
    });
    } catch(e) {
        ////console.log(e);
    }
  };
  

module.exports = helpers;