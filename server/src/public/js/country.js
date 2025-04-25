$("#certificaciones_gestion_calidad").blur(function(){
  var total;
  var uno = $("#certificaciones_gestion_calidad").val();
 
  //var uno = $("#certificaciones_gestion_calidad").val();
  var dos = $("#mantenimiento_reparaciones").val();
  var tres = $("#desgastes_depreciacion").val();
  var cuatro = $("#a_salario").val();
  var cinco = $("#equipos").val();
  var seis = $("#a_materiales").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
 
  $("#total_gastos").val(total);
});  

$('#certificaciones_gestion_calidad').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#certificaciones_gestion_calidad").val();
   
    //var uno = $("#certificaciones_gestion_calidad").val();
    var dos = $("#mantenimiento_reparaciones").val();
    var tres = $("#desgastes_depreciacion").val();
    var cuatro = $("#a_salario").val();
    var cinco = $("#equipos").val();
    var seis = $("#a_materiales").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#mantenimiento_reparaciones").focus();
  }
});

$("#mantenimiento_reparaciones").focus(function(){
  //$(this).hide("slow");
  $(this).css("background-color", "#FFFFCC");
  this.select();
});


$("#mantenimiento_reparaciones").blur(function(){
  var total;
  var uno = $("#mantenimiento_reparaciones").val();
   //var uno = $("#certificaciones_gestion_calidad").val();
  var dos = $("#certificaciones_gestion_calidad").val();
  var tres = $("#desgastes_depreciacion").val();
  var cuatro = $("#a_salario").val();
  var cinco = $("#equipos").val();
  var seis = $("#a_materiales").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
  $("#total_gastos").val(total);
});  

$('#mantenimiento_reparaciones').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#mantenimiento_reparaciones").val();
    //var uno = $("#certificaciones_gestion_calidad").val();
   var dos = $("#certificaciones_gestion_calidad").val();
   var tres = $("#desgastes_depreciacion").val();
   var cuatro = $("#a_salario").val();
   var cinco = $("#equipos").val();
   var seis = $("#a_materiales").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#desgastes_depreciacion").focus();
  }
});

$("#desgastes_depreciacion").focus(function(){
  //$(this).hide("slow");
  $(this).css("background-color", "#FFFFCC");
  this.select();
});

$("#desgastes_depreciacion").blur(function(){
  var total;
  var uno = $("#desgastes_depreciacion").val();
   //var uno = $("#certificaciones_gestion_calidad").val();
  var dos = $("#certificaciones_gestion_calidad").val();
  var tres = $("#mantenimiento_reparaciones").val();
  var cuatro = $("#a_salario").val();
  var cinco = $("#equipos").val();
  var seis = $("#a_materiales").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
  $("#total_gastos").val(total);
});  

$('#desgastes_depreciacion').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#desgastes_depreciacion").val();
    //var uno = $("#certificaciones_gestion_calidad").val();
   var dos = $("#certificaciones_gestion_calidad").val();
   var tres = $("#mantenimiento_reparaciones").val();
   var cuatro = $("#a_salario").val();
   var cinco = $("#equipos").val();
   var seis = $("#a_materiales").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#a_salario").focus();
  }
});

$("#a_salario").focus(function(){
  //$(this).hide("slow");
  $(this).css("background-color", "#FFFFCC");
  this.select();
});




$("#a_salario").blur(function(){
  var total;
  var uno = $("#a_salario").val();
  
  var dos = $("#certificaciones_gestion_calidad").val();
  var tres = $("#desgastes_depreciacion").val();
  var cuatro = $("#mantenimiento_reparaciones").val();
  var cinco = $("#equipos").val();
  var seis = $("#a_materiales").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
  $("#total_gastos").val(total);
});  

$('#a_salario').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#a_salario").val();
    
    var dos = $("#certificaciones_gestion_calidad").val();
    var tres = $("#desgastes_depreciacion").val();
    var cuatro = $("#mantenimiento_reparaciones").val();
    var cinco = $("#equipos").val();
    var seis = $("#a_materiales").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#equipos").focus();
  }
});

$("#equipos").focus(function(){
  //$(this).hide("slow");
  $(this).css("background-color", "#FFFFCC");
  this.select();
});

$("#equipos").blur(function(){
  var total;
  var uno = $("#equipos").val();
  
  var dos = $("#certificaciones_gestion_calidad").val();
  var tres = $("#desgastes_depreciacion").val();
  var cuatro = $("#a_salario").val();
  var cinco = $("#mantenimiento_reparaciones").val();
  var seis = $("#a_materiales").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
  $("#total_gastos").val(total);
});  

$('#equipos').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#mantenimiento_reparaciones").val();
    
    var dos = $("#certificaciones_gestion_calidad").val();
    var tres = $("#desgastes_depreciacion").val();
    var cuatro = $("#a_salario").val();
    var cinco = $("#equipos").val();
    var seis = $("#a_materiales").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#a_materiales").focus();
  }
});

$("#a_materiales").focus(function(){
  //$(this).hide("slow");
  $(this).css("background-color", "#FFFFCC");
  this.select();
});


$("#a_materiales").blur(function(){
  var total;
  var uno = $("#a_materiales").val();
  var dos = $("#certificaciones_gestion_calidad").val();
  var tres = $("#desgastes_depreciacion").val();
  var cuatro = $("#mantenimiento_reparaciones").val();
  var cinco = $("#equipos").val();
  var seis = $("#a_salario").val();
  total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
  $("#total_gastos").val(total);
});  

$('#a_materiales').on('keypress', function (e) {
  if(e.which === 13 || keyCode == 9)  {
     e.preventDefault(e);
    //alert("Ok");
    var total;
    var uno = $("#a_materiales").val();
    var dos = $("#certificaciones_gestion_calidad").val();
    var tres = $("#desgastes_depreciacion").val();
    var cuatro = $("#mantenimiento_reparaciones").val();
    var cinco = $("#equipos").val();
    var seis = $("#a_salario").val();
    total = parseFloat(uno) + parseFloat(dos) + parseFloat(tres) + parseFloat(cuatro) + parseFloat(cinco) + parseFloat(seis);
    $("#total_gastos").val(total);
    $("#certificaciones_gestion_calidad").focus();
  }
});









function show_data_unidad() {
  anno = $("#anno").val();
  mes = $("#mes").val();
  id_area = $("#id_por_unidad_planes").val();
  //alert("Unidad:" + id_area );
  //alert("El ID es: " + anno);
  
  $.ajax({
    url: "http://localhost:8081/links/get_data_unidad",
    type: "POST",
    data: {
      anno: anno,
      mes: mes,
      id_area: id_area,
      },
    dataType: 'json',
    success: function(result) {
      //alert("Ok");
      $.each(result.resultado, function(key, value) {

        salario = value.salario;
        
         materias_primas = value.materias_primas;
         combustible = value.combustible;
         energia = value.energia;
         depreciacion = value.depreciacion;
         costos_generales = value.costos_generales;
         financieros = value.financieros;
         gasto_osde = value.gasto_osde;
         tasas = value.tasas;
         otros_gastos =value.otros_gastos;
         ventas = value.ventas;
         faltantes = value.faltantes;
         desastres = value.desastres;
         monetarios = value.monetarios;
        
        $("#materias_primas").val(materias_primas);
        $("#combustible").val(combustible);
        $("#energia").val(energia);
        $("#depreciacion").val(depreciacion);
        $("#costos_generales").val(costos_generales);
        $("#financieros").val(financieros);
        $("#gasto_osde").val(gasto_osde);
        $("#tasas").val(tasas);
        $("#ventas").val(ventas);
        $("#faltantes").val(faltantes);
        $("#desastres").val(desastres);
        $("#otros_gastos").val(otros_gastos);
        $("#salario").val(salario);
        $("#monetarios").val(monetarios);
       
        

      });
       }  
      });
}


function show_data_monetarios() {
  anno = $("#anno").val();
  id_area = $("#id_monetarios_unidad").val();
  //alert("Unidad:" + id_area );
  //alert("El ID es: " + anno);
  
  $.ajax({
    url: "http://localhost:8081/links/get_data_monetarios",
    type: "POST",
    data: {
      anno: anno,
      id_area: id_area,
      },
    dataType: 'json',
    success: function(result) {
      //alert("Ok");
      $.each(result.resultado, function(key, value) {

        telefono_fijo = value.telefono_fijo;
        
        telefono_celular = value.telefono_celular;
        conectividad = value.conectividad;
        agua = value.agua;
        seguridad = value.seguridad;
        prestaciones = value.prestaciones;
        fletes = value.fletes;
        representacion = value.representacion;
        gratificaciones = value.gratificaciones;
        capacitacion =value.capacitacion;
        mantenimientos = value.mantenimientos;
        mantenimientos_transporte = value.mantenimientos_transporte;
        privados = value.privados;
        otros_gastos_diversos = value.otros_gastos_diversos;
        seguros = value.seguros;
        otros_servicios = value.otros_servicios;
        otros_productivos = value.otros_productivos;
        actividades_sociales = value.actividades_sociales;
        otros_comision = value.otros_comision;
        iso_9000 = value.iso_9000;
        alojamiento = value.alojamiento;
        dietas = value.dietas;
        pasajes = value.pasajes;

        $("#telefono_fijo").val(telefono_fijo);
        $("#telefono_celular").val(telefono_celular);
        $("#conectividad").val(conectividad);
        $("#agua").val(agua);
        $("#seguridad").val(seguridad);
        $("#prestaciones").val(prestaciones);
        $("#fletes").val(fletes);
        $("#representacion").val(representacion);
        $("#gratificaciones").val(gratificaciones);
        $("#capacitacion").val(capacitacion);

        $("#mantenimientos").val(mantenimientos);
        $("#mantenimientos_transporte").val(mantenimientos_transporte);
        $("#privados").val(privados);
        $("#otros_gastos_diversos").val(otros_gastos_diversos);
        $("#seguros").val(seguros);
        $("#otros_servicios").val(otros_servicios);
        $("#otros_productivos").val(otros_productivos);
        $("#actividades_sociales").val(actividades_sociales);
        $("#otros_comision").val(otros_comision); 
        $("#iso_9000").val(iso_9000);
        $("#alojamiento").val(alojamiento); 
        $("#dietas").val(dietas); 
        $("#pasajes").val(pasajes); 
        

      });
       }  
      });
}

$('#id_unidad_sel_planes').on('change', function() {
  var id =  $("#id_unidad_sel_planes option:selected").attr("id");
  //alert(id);
  $('#id_por_unidad_planes').val(id);
  show_data_unidad();
});

$('#id_unidad_sel_monetarios').on('change', function() {
  var id =  $("#id_unidad_sel_monetarios option:selected").attr("id");
  //alert(id);
  $('#id_monetarios_unidad').val(id);
  show_data_monetarios();
});


$('#id_editar_monetarios').on('change', function() {
  
  anno = $('#anno').val();
  if ($('input:checkbox[name=si_no_editar_monetarios]:checked').val()) {
   valor = 1;
   $('#id_por_unidad_monetarios').val(valor);
   $('#modalidad_monetarios').html("Actividad: <em>modificando</em>...el registro actual del año");
 } else {
   valor = 0;
   $('#id_por_unidad_monetarios').val(valor);
   $('#modalidad_monetarios').html("Actividad: nuevo registro...para el año actual");
 }
});

$('#ordenes_servicio').on('change', function() {
  //alert(this.value);
   var id = this.value;
   //$('#el_id').val(this.value);
   var link = "http://localhost:8081/links/equipos_servicio/" + id + "/1";
   //alert(link);
   window.location.assign(link);
 });

$('#ordenes').on('change', function() {
 //alert(this.value);
  var id = this.value;
  $('#el_id').val(this.value);
  var link = "http://localhost:8081/links/equipo/" + id + "/0";
  window.location.assign(link);
});

$('#ordenes_mat').on('change', function() {
  //alert(this.value);
  var id = this.value;
  var cat = 1;
  $('#el_id').val(this.value);
  //var id_orden = $('#id_orden').val();
  var link = "http://localhost:8081/links/sel_materiales/" + id + "/" + cat;
 // alert(link);
  window.location.assign(link);
});



$('#materiales').on('change', function() {
  //alert(this.value);
  var id = this.value;
  $('#el_id').val(this.value);
  var link = "http://localhost:8081/links/sel_materiales/" + id;
  window.location.assign(link);
});



$(".edit").blur(function(){
  $(this).css("background-color", "#FFFFFF");
  //$(this).removeClass("editMode");
  var id = this.id;
 // alert("El ID es: " + id);
  var split_id = id.split("_");
 // alert("El ID es: " + split_id);
  var edit_id = split_id[1];
 // alert("El ID es: " + edit_id);
  $("#el_id").val(edit_id);
});  

function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function deleteRow(id) {
  var orden =  $("#id_orden").val();
  //alert("El ID es: " + id);
  var id_del =  id;
  $.ajax({
    url: "http://localhost:8081/links/delete_linea_trabajador",
    type: "POST",
    data: {
      id_del: id_del,
      },
    dataType: 'json',
    success: function(result) {
        //alert(result.mensaje);
       }  
      });
}

function deleteRowMaterial(id) {
  var cat = 1;
  var orden =  $("#id_orden").val();
  //alert("El ID es: " + id);
  var id_del =  id;
  $.ajax({
    url: "http://localhost:8081/links/delete_linea_material",
    type: "POST",
    data: {
      id_del: id_del,
      orden,
      },
    dataType: 'json',
    success: function(result) {
        alert(result.mensaje);
        var link = "http://localhost:8081/links/sel_materiales/" + orden + "/" + cat;
        // alert(link);
         window.location.assign(link);
       }  
      }); 
}

function updateRowActMaterial(id) {
 
  var id =  id;
  var id_categoria =  $("#id_tipo_categoria").val();
  //alert("ID : " + id);
  //alert("Cat. : " + id_categoria);
  $.ajax({
    url: "http://localhost:8081/links/update_categoria_material",
    type: "POST",
    data: {
      id: id,
      id_categoria: id_categoria,
      },
    dataType: 'json',
    success: function(result) {
      var link = "http://localhost:8081/links/materialesUpdate/" + "1" + "/" +  id_categoria + "/none" ;
      window.location.assign(link);
       }  
      });

}

function updateRowMaterial(id) {
  var orden =  $("#id_orden").val();
  //alert("El ID_row row es: " + id);
  //alert("El ID row es: " + id);
  var edit_id =  id;
  //alert( "tr_" + id);
 // alert("id_" + id);
  var descripcion = $("#" + "tr_" + id).val();
  //alert("Des: " + descripcion);
  var cantidad = $("#" + "idd_" + id).val();
  //alert("Cantidad: " + cantidad);
  //alert(nombre);
 
  //alert( "Id Trabajador:" + id + " Horas:" + horas + " -Mes:" + mes + " -Año" + anno + " -Orden" + orden + " -Trabajador" + nombre);
  $.ajax({
    url: "http://localhost:8081/links/update_linea_material",
    type: "POST",
    data: {
     
      id: id,
      cantidad: cantidad,
      },
    dataType: 'json',
    success: function(result) {
        //alert(result.mensaje);
       }  
      });

}

function saveRowMaterial(id) {
  var id_orden =  $("#id_orden").val();
  //alert("El ID de la Orden  es: " + id_orden);
  var edit_id =  id;
 // alert( " tr_" + id);
 // alert("id_" + id);
  var descripcion = $("#" + "tr_" + edit_id).val();
  //alert(descripcion);
  var id_material; // = $("#" + "or_" + edit_id).val();
  id_material = id;
  //alert("Id Material: " + id_material);
  var cantidad = $("#" + "idd_" + edit_id).val();
  alert("Cantidad: " + cantidad);
  var mes_reporte = $("#mes").val();
  //alert(mes_reporte);
  var anno_reporte = $("#anno").val();
  //alert(anno_reporte);
  var precio = 0;
  var importe = 0;
  $.ajax({
    url: "http://localhost:8081/links/salvar_linea_materiales",
    type: "POST",
    data: {
      id_material: id_material,
      cantidad : cantidad,
      mes_reporte : mes_reporte,
      anno_reporte : anno_reporte,
      id_orden : id_orden,
      descripcion: descripcion,
      precio,
      importe
      },
    dataType: 'json',
    success: function(result) {
        alert(result.mensaje);
        var link = "http://localhost:8081/links/sel_materiales/" + id_orden + "/1";
        window.location.assign(link);
       }  
      });
}

$('#id_aceptar').click(function(e) { 
  var master = 0;
  var nombres = $("#id_nombres").val();
  var identidad = $("#id_identidad").val();
  var unidad = $("#id_unidad").val();
  var cargo = $("#id_cargo").val();
  var Escala = $("#id_escala").val();
  var salario_esc = $("#id_salario").val();
  master = $("#id_master").val();
  var coe_diferente = $("#id_coeficiente").val();
  if(coe_diferente.trim() === "" || nombres.trim() === "" || identidad.trim() === "" || unidad.trim() === "" || cargo.trim() === "" || Escala.trim() === "" || Escala.trim() === "" || salario_esc.trim() === "" || master.trim() === "") {
    //alert("Campos vacios");
  } else {



  }

}); 


function Top() {
  $(window).scrollTop(0);
}

$('.añadir').click(function(e) { 
  e.preventDefault;
  var descripcion = $('#sel_material option:selected').val();
  //alert(descripcion);
  
  var id =  $("#sel_material option:selected").attr("id");
  //alert("ID Material: " + id);

  var id_orden = $("#id_orden").val();
  //alert(id_orden);
  var idd = '"' + 'idd_'  +  id + '"';
  var idtr = '"' + 'tr_'  +  id + '"';
  var sal = '"' + 'sal_'  +  id + '"';
  var idpr = '"' + 'pre_'  +  id + '"';
  var idimp = '"' + 'imp_'  +  id + '"';
  
  
  //alert(idd);
  //alert(idd)
  var fila = "<tr><td><input type='text' class='form-control'  value='0' disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id_orden +" disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id +" disabled></td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idtr + "value="  + descripcion +"></td>" +
            
            "<td><input type='text' class='form-control' id=" + idd + " value='0'> </td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idpr + "value='0'></td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idimp + "value='0'></td>" +
            "<td><input type='button' class='deleteDep' value='Delete' onclick =" + "deleteRowMaterial(" + id + ")" + "></td>" +
            "<td><input type='button' class='save' value='Save' onclick =" + "saveRowMaterial(" + id + ")" + "></td>" +
            "<td><input type='button' class='update' value='Update' onclick =" + "UpdateRowMaterial(" + id + ")" + " disabled></td></tr>";
  //var fila = "<td>" + id + "</td><td>" + opcion + "</td><td contentEditable='true' class='edit' id=" +  id+"" + "></td>";
  //alert(fila);
  
  $('#myTableMateriales > tbody:last-child').append(fila);
  //$("#el_id").val(id);
  Top();
  
});

function buscarMaterial(id, idtr) {
 
  alert("El ID es: " + idtr);
  $.ajax({
    url: "http://localhost:8081/links/buscar_material",
    type: "POST",
    data: {
      id: id,
      },
    dataType: 'json',
    success: function(result) {
      $.each(result.resultado, function(key, value) {
        alert("Ajax: " + value.descripcion);
        $(idtr).val(value.descripcion);
        return value.descripcion;
       });  
    },
    error : function(xhr, status) {
      alert('Disculpe, existió un problema');
       }, 
  });  

} 

$('#material-dropdown').on('change', function(e) {
  
  e.preventDefault;
  var descripcion = $('#material-dropdown option:selected').text();
  alert(this.value);
  
  var id =  $("#material-dropdown option:selected").attr("id");
 

  var id_orden = $("#id_orden").val();
  //alert(id_orden);
  var idd = '"' + 'idd_'  +  id + '"';
  var idtr = '"' + 'tr_'  +  id + '"';
  var sal = '"' + 'sal_'  +  id + '"';
  var idpr = '"' + 'pre_'  +  id + '"';
  var idimp = '"' + 'imp_'  +  id + '"';
  
  
  //alert(idd);
  //alert(idd)
  var fila = "<tr><td><input type='text' class='form-control'  value='0' disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id_orden +" disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id +" disabled></td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idtr + "value="  + descripcion +"></td>" +
            
            "<td><input type='text' class='form-control' onClick='this.select();' id=" + idd + " value='0'> </td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idpr + "value='0' disabled></td>" +
            "<td><input type='text' width='100%' class='form-control' id=" + idimp + "value='0' disabled></td>" +
            "<td><input type='button' class='deleteDep' value='Delete' onclick = 'deleteRowMaterial(this)' disabled></td>" +
            "<td><input type='button' class='save' value='Save' onclick =" + "saveRowMaterial(" + id + ")" + "></td>" +
            "<td><input type='button' class='update' value='Update' onclick =" + "UpdateRowMaterial(" + id + ")" + " disabled></td></tr>";
  //var fila = "<td>" + id + "</td><td>" + opcion + "</td><td contentEditable='true' class='edit' id=" +  id+"" + "></td>";
  //alert(fila);
  
  $('#myTableMateriales > tbody:last-child').append(fila);
  //$("#el_id").val(id);
  //descripcion = buscarMaterial(id,idtr)
  //alert("Material: " + descripcion);
 
});

$('#origen_trabajadores').click(function(e) { 
    e.preventDefault;
    var nombres = $('#origen_trabajadores option:selected').val();
    //alert(nombres);
    $("#id_nombre").val(nombres);
    var id =  $("#origen_trabajadores option:selected").attr("id");
    $("#el_id_trabajador").val(id);
    var id_orden = $("#id_orden").val();
  });



  $('#origen_transporte').click(function(e) { 
    var id =  $("#origen_transporte option:selected").attr("id");
    //alert(id);
    $("#el_id_equipo").val(id);
     var id_orden = $("#id_orden").val();

    var id_trabajador = $("#el_id_trabajador").val();

    var idd = '"' + 'ide_'  + id   + '"';
    var id_or = '"' + 'or_'  + id   + '"';
    //alert(id_or);
    var id_tr = '"' + 'tr_'  +  id + '"';
    //alert(id_tr);
    var nombres = $("#id_nombre").val();

    var fila = "<tr><td><input type='text' class='form-control'  value='0' disabled></td>" +
            "<td><input type='text' class='form-control'  id=" + idd + " value=" + id +"></td>" +
            "<td><input type='text' class='form-control'  value=" + id_orden +"></td>" +
            "<td><input type='text' class='form-control' id=" + id_or + " value=" + id_trabajador +"></td>" +
            "<td><input type='text' class='form-control' id=" + id_tr + "value="  + nombres +"></td>" +
           
           
            "<td><input type='button' class='deleteDep' value='Delete' onclick = 'deleteRow(this)'></td>" +
            "<td><input type='button' class='save' value='Save' onclick =" + "saveRowEquipo(" + id + ")" + "></td>" +
            "<td><input type='button' class='update' value='Update' onclick =" + "UpdateRow(" + id + ")" + " disabled></td></tr>";
  //alert(fila);          
  $('#myTableEquipos > tbody:last-child').append(fila);         

  });

  function saveRowEquipo(id) {
    var id_orden = $("#id_orden").val();

    var id_trabajador = $("#el_id_trabajador").val();

    var id_equipo = $("#el_id_equipo").val();
    //alert("ID Equipo: " + id_equipo);
    var mes = $("#mes").val();
    //alert(mes);
    var anno = $("#anno").val();
    //alert(id_or);
    //var id_tr = '"' + 'tr_'  +  id + '"';
    //alert(id_tr);
    
    //alert( "Id Trabajador:" + id + " Horas:" + horas + " -Mes:" + mes + " -Año" + anno + " -Orden" + orden + " -Trabajador" + nombre);
    var mensaje = "Salvados con èxito los datos!"
    $.ajax({
      url: "http://localhost:8081/links/salvar_equipos_servicio",
      type: "POST",
      data: {
        id_orden: id_orden,
        id_trabajador : id_trabajador,
        mes_reporte : mes,
        anno_reporte : anno,
        id_equipo : id_equipo,
        },
      dataType: 'json',
      success: function(result) {
          alert(result.mensaje);
          var link = "http://localhost:8081/links/equipos_servicio/" + id_orden + "/1";
          alert(link);
          window.location.assign(link);
         }  
        });
  }


  function saveRow(id,ir) {
    var orden =  $("#id_orden").val();
    var option = $("#id_opcion").val();
    //alert("El ID es: " + id);
    var edit_id =  id;
    //alert( " tr_" + id);
   // alert("id_" + id);
    var nombre = $("#" + "tr_" + edit_id).val();
    //alert(nombre);
    var horas = $("#" + "id_" + edit_id).val();
    var nueve_cero_nueve =  $("#" + "9_" + edit_id).val();
    var mes = $("#mes").val();
    //alert(mes)
    var anno = $("#anno").val();
    //alert( "Id Trabajador:" + id + " Horas:" + horas + " -Mes:" + mes + " -Año" + anno + " -Orden" + orden + " -Trabajador" + nombre);
    $.ajax({
      url: "http://localhost:8081/links/salvar_linea_trabajador",
      type: "POST",
      data: {
        id: id,
        horas : horas,
        mes : mes,
        anno : anno,
        orden : orden,
        nueve_cero_nueve,
        },
      dataType: 'json',
      success: function(result) {
             
            var link = "http://localhost:8081/links/equipo/" + orden + "/0";
            //alert(link);
            window.location.assign(link);
            
         
         }  
        });
  }
  
  
  function updateRow(id, id_row) {
    var orden =  $("#id_orden").val();
    //alert("El ID row es: " + id_row);
    var edit_id =  id;
    //alert( "tr_" + id);
   // alert("id_" + id);
    var nombre = $("#" + "tr_" + edit_id).val();
    //alert(nombre);
    var horas = $("#" + "id_" + edit_id).val();
    var nueve_cero_nueve = $("#" + "9_" + edit_id).val();
    var mes = $("#mes").val();
    var anno = $("#anno").val();
    //alert( "Id Trabajador:" + id + " Horas:" + horas + " -Mes:" + mes + " -Año" + anno + " -Orden" + orden + " -Trabajador" + nombre);
    $.ajax({
      url: "http://localhost:8081/links/update_linea_trabajador",
      type: "POST",
      data: {
        id_row : id_row,
        id: id,
        horas : horas,
        mes : mes,
        anno : anno,
        orden : orden,
        nueve_cero_nueve : nueve_cero_nueve,
        },
      dataType: 'json',
      success: function(result) {
          //alert(result.mensaje);
         }  
        });
  
  }




  $('#origen').dblclick(function(e) { 
  
    e.preventDefault;
    var nombres = $('#origen option:selected').val();
    //alert(nombres);
    var id =  $("#origen option:selected").attr("id")
    var id_orden = $("#id_orden").val();
    var idd = '"' + 'id_'  +  id + '"';
    var idtr = '"' + 'tr_'  +  id + '"';
    var nueve = '"' + '9_'  +  id + '"';
    //alert(idtr);
    //alert(idd)
    var fila = "<tr><td><input type='text' class='form-control'  value='0' disabled></td>" +
              "<td><input type='text' class='form-control'  value=" + id_orden +" disabled></td>" +
              "<td><input type='text' class='form-control'  value=" + id +" disabled></td>" +
              "<td><input type='text' class='form-control' id=" + idtr + "value="  + nombres +"></td>" +
              "<td><input type='text' class='form-control' id=" + idd + " value='0'> </td>" +
              "<td><input type='text' class='form-control' id=" + nueve + " value='0'> </td>" +
              "<td><input type='button' class='deleteDep' value='Delete' onclick = 'deleteRow(this)'></td>" +
              "<td><input type='button' class='save' value='Save' onclick =" + "saveRow(" + id + ")" + "></td>" +
              "<td><input type='button' class='update' value='Update' onclick =" + "UpdateRow(" + id + ")" + " disabled></td></tr>";
    //var fila = "<td>" + id + "</td><td>" + opcion + "</td><td contentEditable='true' class='edit' id=" +  id+"" + "></td>";
    //alert(fila);
    
    $('#myTable > tbody:last-child').append(fila);
    $("#origen").prop('disabled', true);
    //$("#el_id").val(id);
   
  
  });

$('.pasar').click(function(e) { 
  e.preventDefault;
  var nombres = $('#origen option:selected').html();
  var id =  $("#origen option:selected").attr("id")
  var id_orden = $("#id_orden").val();
  var idd = '"' + 'id_'  +  id + '"';
  var idtr = '"' + 'tr_'  +  id + '"';
  var nueve = '"' + '9_'  +  id + '"';
  alert(idtr);
  //alert(idd)
  var fila = "<tr><td><input type='text' class='form-control'  value='0' disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id_orden +" disabled></td>" +
            "<td><input type='text' class='form-control'  value=" + id +" disabled></td>" +
            "<td><input type='text' class='form-control' id=" + idtr + "value=" + nombres +"></td>" +
            "<td><input type='text' class='form-control' id=" + idd + " value='0'> </td>" +
            "<td><input type='text' class='form-control' id=" + nueve + " value='0'> </td>" +

            "<td><input type='button' class='deleteDep' value='Delete' onclick = 'deleteRow(this)'></td>" +
            "<td><input type='button' class='save' value='Save' onclick =" + "saveRow(" + id + ")" + "></td>" +
            "<td><input type='button' class='update' value='Update' onclick =" + "UpdateRow(" + id + ")" + " disabled></td></tr>";
  //var fila = "<td>" + id + "</td><td>" + opcion + "</td><td contentEditable='true' class='edit' id=" +  id+"" + "></td>";
  //alert(fila);
  
  $('#myTable > tbody:last-child').append(fila);
  //$("#el_id").val(id);
  Top();
  
});



$('.pasar1').click(function() { 
  return !$('#origen option:selected').appendTo('#destino'); });  


  $('.quitar').click(function() { return !$('#destino option:selected').remove().appendTo('#origen'); });
$('.pasartodos').click(function() { $('#origen option').each(function() { $(this).remove().appendTo('#destino'); }); });
$('.quitartodos').click(function() { $('#destino option').each(function() { $(this).remove().appendTo('#origen'); }); });
$('.submit').click(function() { $('#destino option').prop('selected', 'selected'); });

$('#salvar_opciones').click(function(e){
  alert("Entré");
  var text = $('#destino option:selected').toArray().map(item => item.text).join();  
  alert(text);  
  var array = text.split(',');
  $.ajax({
    url: "http://localhost:8081/links/salvar_trabajadores",
    type: "POST",
    data : {'array': JSON.stringify(array)},
    dataType: 'json',
    success: function(result) {
        alert(result.mensaje);
       }  
      });
 });




function getCountryList(p1, p2) {
    var country_id = this.value;
    $("#country-dropdown").html('');
    $.ajax({
    url: "http://localhost:8081/links/countries-list",
    type: "GET",
    dataType: 'json',
    success: function(result) {
    $('#country-dropdown').html('<option value="">Provincias</option>');
    $.each(result.countries, function(key, value) {
    $("#country-dropdown").append('<option value="' + value.id + '">' + value.name + '</option>');
        });
       }  
      });
     
    }

 

 $(document).on("click","#ordenes_ir",function(event){
  event.preventDefault();
  var href= $(this).attr('href');
  //alert(href);
  var link = "http://localhost:8081" + href;
  var position = href.lastIndexOf("/");   // returns 3
  //alert(position);
  var temp=href.slice(position+1);
  //alert("Cadena: " + temp);
   $.ajax({
    url: "http://localhost:8081/links/SiExistenOrdenes",
    type: "POST",
    data : { enlace : temp },
    dataType: 'json',
    success: function (result) {
      $.each(result.resultado, function(key, value) {
             if (value.cantidad == 0) {
              //alert("Cantidad en cero: " + value.cantidad);
              var alerta="Este contrato no tiene ordenes registradas";
              var titulo = "Buscar Contratos por el Año";
              //$('#warning').html("No hay registros de órdenes");
              $('#informacion').show();
               $('#informacion').html("<h5><strong>" + alerta + "</strong></h5>");
               $("#informacion").css("color", "#000000");
               $("informacion").addClass("form-control")

               setTimeout(function () {
                $("#informacion").css("color", "#f9f4f3");
               $('#informacion').html("<h5><strong>" + titulo + "</strong></h5>");
               }, 2500);
               //Buscar Contratos por el Año
             } else {
              window.location.assign(link);
             }
          });
   
},
     error : function(xhr, status) {
     alert('Disculpe, existió un problema');
   }, 
 });
 
});

$('#filtra_codigo').on('change', function() {
  var link = this.value;
  var cod = 2019;
  //(link);
  window.location.assign(link);

});

$('#id_categorias_equipos').on('change', function() {
  var link = this.value;
     
$('#id_categoria_sel').val(link);

});

$('#filtra').on('change', function() {
  //e.preventDefault();
      //alert("Entré");
      var anno =  this.value;
      //$("#el_body").empty();
      alert("Opcion: " + anno);
      //data= $('#form_1').serialize();
      //$('#id_country > option[value="3"]').attr('selected', 'selected');
      $.ajax({
      url: "http://localhost:8081/links/test_actualizar",
      type: "POST",
      data : { anno_contrato : anno },
      dataType: 'json',
      success: function (result) {
        var employeeTable = $('#mitabla tbody');
        $("#mitabla tbody").empty()
       
        $.each(result.resultado, function(key, value) {
var  newtr = '<tr><td><input type="text" class="form-control" id="id_proyecto" name="id_proyecto" value=' +  '"' + value.id_row_contrato + '"' + '/></td>';
newtr = newtr + '<td><input type="text" class="form-control" id="codigo_contrato" name="codigo_contrato" value=' +  '"' + value.codigo_contrato + '"' + '/></td>';
newtr = newtr + '<td><textarea class="form-control" id="nombre_contrato" name="nombre_contrato">' +   value.nombre_contrato +  '</textarea></td>';
newtr = newtr + '<td><textarea class="form-control" id="descripcion_contrato" name="descripcion_contrato">' +   value.descripcion_contrato +  '</textarea></td>';
newtr = newtr + '<td><input type="text" class="form-control" id="codigo_contrato" name="valor_contratado" value=' +  '"' + value.valor_contratado + '"' + '/></td>';
newtr = newtr + '<td><input type="text" class="form-control" name="fecha_inicio" value=' +  '"' + value.fecha_inicio + '"' + '/></td>';
newtr = newtr + '<td><input type="text" class="form-control" name="fecha_terminacion" value=' +  '"' + value.fecha_terminacion + '"' + '/></td>';
newtr = newtr + '<td><a class="form-control" href="/links/ver_ordenes/1/' + value.id_row_contrato + '"' + '>Ir</a></td>';
newtr = newtr +'</tr>'; 
employeeTable.append(newtr); 
         
    });
       
 },
  error : function(xhr, status) {
  alert('Disculpe, existió un problema');
   }, 
  });
 });



 $('#id_servicio').on('change', function() {
    
 });

 $('#id_servicio').on('change', function() {
  var servicio = this.value;
  //servicio = zeroPadded(servicio);
  //alert(servicio);
  $('#id_tipo_servicio').val(servicio);
 });

 $('#id_cat_material').on('change', function() {
  var categoria = this.value;
  //servicio = zeroPadded(servicio);
  //alert(servicio);
  $('#id_tipo_categoria').val(categoria);
  if ($('input:checkbox[name=filtrar_name]:checked').val()) {
    resultado = 1;
    //alert("Filtrar");
    var link = "http://localhost:8081/links/materialesUpdate/" + "1" + "/" +  categoria + "/none";
    window.location.assign(link);
  
  } 
 });

 /*$('#filtrar_consecutivo').on('change', function() {
  var consecutivo = this.value;
  alert(consecutivo);
  
 });*/



 $('#id_obra').on('change', function() {
  var obra = this.value;
  //obra = zeroPadded(servicio);
  //alert(servicio);
  $('#id_tipo_obra').val(obra);
 });

 var consecutivo_original = $('#consecutivo_contrato').val();
 var codigo_original = $('#codigo_contrato').val();

 $('#filtrar_si').click(function(e){
  var resultado = 0;
  var id_categoria =  $("#id_tipo_categoria").val();
  if ($('input:checkbox[name=filtrar_name]:checked').val()) {
    resultado = 1;
    result = "Filtrando...";
    $('#lblInfo').html("<strong><em>" + result + "</em></strong>");
    
    //alert("Filtrar");
   // var link = "http://localhost:8081/links/materialesUpdate/" + "1" + "/" +  id_categoria + "/none";
   // window.location.assign(link);
  
  } else {
    result = "Actualizando...";
    $('#lblInfo').html("<strong><em>" + result + "</em></strong>");
  } 
  
});



 
  
    $("#myTextBoxMaterial").keypress(function(e) {
  if(e.which == 13) {
  var modalidad =   $('#myTextBoxMaterial').val();
  //modalidad = "%" + modalidad + "%";
  var id_categoria = 1;
  //alert("La modalidad es " + modalidad);
  var link = "http://localhost:8081/links/materialesUpdate/" + "1" + "/" +  id_categoria + "/" + modalidad;
  //alert(link);
  window.location.assign(link);
  }

 });

 $('#id_actualizar').click(function(e){
  var resultado = 0;
  if ($('input:checkbox[name=actualizar]:checked').val()) {
    resultado = 1;
    $('#consecutivo_contrato').val(consecutivo_original);
    $('#codigo_contrato').val(codigo_original);
    $('#grabar_consecutivo').val(resultado);
   // var codigo_actual = $('#codigo_contrato').val();
   // alert(codigo_actual);
  } else {
  
  var codigo_actual = $('#codigo_contrato').val();
  var consecutivo_manual = $('#consecutivo_contrato').val();
  var pos_ini = codigo_actual.indexOf("-");   // returns 3
  //alert(pos_ini);
  var p = codigo_actual.slice(0,2);
  var s = consecutivo_manual;
  var t = codigo_actual.slice(6,9); 
  //alert("Primera cadena " + p);
  //alert("Ultima cadena " + t);
  var codigo_nuevo = p + "-" + s + "-" + t
  $('#codigo_contrato').val(codigo_nuevo);
  } 
  $('#grabar_consecutivo').val(resultado);
}); 


$('#id_vendido_add').click(function(e){
  var resultado = 0;
  if ($('input:checkbox[name=vendido]:checked').val()) {
    resultado = 1;
    $('#id_venta').val(resultado);
    acum = $('#acumulado').val();
    $('#mercantil').val(acum);
  } else {
   resultado = 0;
   $('#id_venta').val(resultado);
   acum = 0; 
   
   $('#mercantil').val(0);
  }
});


  $('#id_vendido').click(function(e){
     var resultado = 0;
     if ($('input:checkbox[name=vendido]:checked').val()) {
       resultado = 1;
       $('#id_venta').val(resultado);
       acum = $('#el_acumulado').val();
       $('#mercantil').val(acum);
     } else {
      resultado = 0;
      $('#id_venta').val(resultado);
      acum = 0; 
      
      $('#mercantil').val(0);
     }
  });

  $('#consecutivo').blur(function() {
     var conse = this.value;
     $('#el_consecutivo').val(conse);
  });

  $('#el_consecutivo').blur(function() {
    var conse = this.value;
    $('#consecutivo').val(conse);
    var codigo_contrato 
    codigo_contrato = $('#codigo_contrato').val();
    var position = codigo_contrato.lastIndexOf("-"); 
    var frag = codigo_contrato.slice(0,position);
    frag = frag + "-" + conse;
    $('#codigo_contrato').val(frag);
 });

 $('#mi_consecutivo').blur(function() {
  var conse = this.value;
  $('#consecutivo').val(conse);
  //var codigo_contrato 
  //codigo_contrato = $('#codigo_contrato').val();
  //var position = codigo_contrato.lastIndexOf("-"); 
  //var frag = codigo_contrato.slice(0,position);
  //frag = frag + "-" + conse;
  //$('#codigo_contrato').val(frag);
});

 $('#select_link2').click(function(e){
      e.preventDefault();
      alert(this.value);
    $.ajax({
      url: "http://localhost:8081/links/SiHayRegistros",
      type: "POST",
      data: {
        anno: 2020,
        },
      dataType: 'json',
      success: function(result) {
        var employeeTable = $('#mitabla tbody');
        employeeTable.empty();
        $('#mitabla').show();
        
      $.each(result.resultado, function(key, value) {
        employeeTable.append('<tr><td>' + value.id_proyecto + '</td><td>' +
        value.id_contrato + '</td><td>' +
        value.nombre_proyecto + '</td><td>' +
        value.fecha_i + '</td><td>' +
        value.fecha_f + '</td></tr>');
          });
         }  
        });
      });  
  
function setCategoriasSelected(p1, p2) {
        $('categorias').change(function(){
          var data= $(this).val();
          alert(data);            
        });
        
        $('#categorias')
            .val('Piezas')
            .trigger('change');
    };  

  function setItemSelected(p1, p2) {
      $('id_provincia').change(function(){
        var data= $(this).val();
        //alert(data);            
      });
      
      $('#id_provincia')
          .val('Camaguey')
          .trigger('change');
  };
  

   $('#fecha_inicio').on('change', function() {
    
    var fecha_inicio =  this.value;
    //alert("Inicio: " + fecha_inicio);
    var fecha_fin = $("#fecha_fin").val();
    //alert("Final: " + fecha_fin);
    $.ajax({
    url: "http://localhost:8081/links/comprobar_fechas",
    type: "POST",
    data: {
    fechaIni: fecha_inicio,
    fechaFin: fecha_fin,
    },
    dataType: 'json',
    success: function(result) {
    //alert(result.organ);
    $('#id_advertencia').show();
    $('#id_advertencia').html("<strong>" + result.organ + "</strong>");
    setTimeout(function () {
      $('#id_advertencia').hide();
    }, 1500);
      }
    });
  });

  var CodCliente = 0;

  function FillOrganismos() {
    $("#organismo-dropdown").prop('disabled', false);
    //var cod = this.value;
    var cod = $("#cod_orga").val();
    //alert("Asì: " + cod);
    $("#str_organismo").html('');
    $.ajax({
    url: "http://localhost:8081/links/get-orga-by-empresa",
    type: "POST",
    data: {
    name: 'produccion',
    cod: cod,
    },
    dataType: 'json',
    success: function(result) {
    $('#organismo-dropdown').html('<option value="">Confirme Organismo</option>');
      $.each(result.organ, function(key, value) {
        //console.log("Asi se llena el combo de Organismos" + value.cod);
    $("#organismo-dropdown").append('<option value="' + value.cod + '">' + value.nombre_inversionista + '</option>');
      });
    }
  });
  $("#id_save").prop('disabled', false); 
  $("#fecha_inicio").prop('disabled', false); 
  $("#fecha_fin").prop('disabled', false); 




  }

  function buscarPorCodigo() {
    var codigo = $('#codigo_a_buscar').val();
    //alert("Código: "+ codigo);
    $.ajax({
      url: "http://localhost:8081/links/buscar_por_codigo_inversionista",
      type: "POST",
      data: {
      codigo: codigo,
      },
      dataType: 'json',
      success: function(result) {
        $.each(result.resultado, function(key, value) {
          
          nombre = value.nombre_inversionista;
          cod = value.id_inver;
          reup = value.COD;
          CodCliente = value.ORGA;
          $('#cod_orga').val(CodCliente); 
          //alert("Nombre: " + nombre + " Código Reup: " + reup + " ORGA:" + CodCliente );
          if (nombre == null) {
             alert("No existe ese cliente");
          } else {
            $("#state-dropdown option[value="+ cod +"]").attr("selected",true);
            //$('#state-dropdown').trigger('click');
            $('#codigo_inversionista').val(cod); 
            $("#organismo-dropdown").prop('disabled', false);  
            buscarOrganismo();
            $("#id_save").prop('disabled', false); 
            //FillOrganismos();
          }
        });
        }
      });
  }

  function Ok() {
    alert("Ok");
  }
  
  function buscarOrganismo() {
    //e.preventDefault;
    $("#organismo-dropdown").html("");
    var cod_orga = $('#cod_orga').val();
    //alert("Código ORGA: "+ cod_orga);
    $.ajax({
      url: "http://localhost:8081/links/buscar_organismo_inversionista",
      type: "POST",
      data: {
      codigo: cod_orga,
      },
      dataType: 'json',
      success: function(result) {
        $.each(result.resultado, function(key, value) {
          nombre = value.nombre_inversionista;
          code = value.COD;
          //alert("Nombre: " + nombre + " Código: " + code);
          if (nombre == null) {
             alert("No existe ese organismo");
          } else {
           // $("#organismo-dropdown option[value="+ code +"]").attr("selected",true);
            //$('#state-dropdown').trigger('click');
            $("#organismo-dropdown").append('<option value="' + value.code + '">' + value.nombre_inversionista + '</option>');
            $("#organismo-dropdown option[value="+ value.code +"]").attr("selected",true);
            $('#codigo_organismo').val(code); 
            //$("#organismo-dropdown").prop('disabled', false);  
          }
        });
       },
       error: function(xhr, status, error) {
        alert("No existe");
    }
    });
  }

  $("#codigo_a_buscar").keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      buscarPorCodigo();
      $('#id_valor').focus(); 
    }
  });


  $("#buscar_por_codigo" ).click(function() {
    //alert("Buscando...");
    buscarPorCodigo();
  });

  //Vre = Vae * 0.1;
  //Vade = Vae - Vre;
  //const Vadeh = Vade / vida_util;

  $("#Cchc" ).blur(function() {
    var cchc;
    var kpmc;
    var pme;
    var pam;
    var factor;
    var gam;
    var factor_pme;
    var resultado;
    pme = $("#Pme" ).val();
   
    cchc = $("#Cchc" ).val();
    kpmc = 1.1;
    pam = $("#Pam" ).val();
    $("#pama" ).val(pam);
    factor = 0.0034065;
    factor_pme = factor * pme;
    gam = factor_pme * cchc * pam;
    resultado = gam.toFixed(2);
    alert("Resultado (gam): " + gam)
    
       $("#Gam" ).val(resultado);
     
  });  


  $("#Gaph" ).blur(function() {
    var cue = 0;
    var vadeh = 0;
    var Gch = 0;
    var Gelh = 0;
    var Gam = 0;
    var Gahh = 0;
    var Gath = 0;
    var Gghh = 0;
    var Gneh = 0;
    var Cmrh_gasto = 0;
    var Coo = 0;
    var Gaph = 0;
    var Cue = 0;
    var Gitt = 0;
    var Gocg = 0;
    var Ggue = 0; // sub total
    var Gcgt = 0; // Costos mas gastos
    var resultado = 0;
    var sub_total = 0;
    vadeh = $("#Vadeh" ).val();
    resultado = resultado + parseFloat(vadeh);
    alert(resultado);
    Gch = $("#Gch" ).val();
    resultado = resultado + parseFloat(Gch);
    alert(resultado);
    Gelh = $("#Gelh" ).val();
    resultado = resultado + parseFloat(Gelh);
    alert(resultado);
    Gam = $("#Gam" ).val();
    resultado = resultado + parseFloat(Gam);
    alert(resultado);
    Gahh = $("#Gahh" ).val();
    resultado = resultado + parseFloat(Gahh);
    alert(resultado);
    Gath = $("#Gath" ).val();
    resultado = resultado + parseFloat(Gath);
    alert(resultado);
    Gghh = $("#Gghh" ).val();
    resultado = resultado + parseFloat(Gahh);
    alert(resultado);
    Gneh = $("#Gneh").val();
    resultado = resultado + parseFloat(Gneh);
    alert(resultado);
    Cmrh_gasto = $("#gasto").val();
    resultado = resultado + parseFloat(Cmrh_gasto);
    alert(Cmrh_gasto);
    Coo = $("#Coo").val();
    resultado = resultado + parseFloat(Coo);
    alert("Resultado antes de Cue: " + resultado);
    Gaph = $("#Gaph").val();
    resultado = resultado + parseFloat(Gaph);
   
   
    cue = resultado;

    cue = parseFloat(vadeh) +
    parseFloat(Gch) +
    parseFloat(Gelh) +
    parseFloat(Gam) +
    parseFloat(Gahh) +
    parseFloat(Gath) +
    parseFloat(Gghh) +
    parseFloat(Gneh) +
    parseFloat(Cmrh_gasto) +
    parseFloat(Coo) +
    parseFloat(Gaph);
    //alert(cue);
    sub_total = cue;
    $("#Cue" ).val(resultado);

     
    
  });  

  
  $("#Gocg" ).blur(function() {
   
    var Cue = 0;
    var Gitt = 0;
    var Gocg = 0;
    var Ggue = 0; // sub total
    var Gcgt = 0; // Costos mas gastos
    var resultado  = 0;
    var sub_total = 0;
   
    cue =  $("#Cue" ).val();
    sub_total = cue;
   

    resultado = 0;
    Gitt = $("#Gitt" ).val();
    resultado = resultado + parseFloat(Gitt);
    //alert(resultado);
    
    Gocg = $("#Gocg" ).val();
    resultado = parseFloat(resultado) + parseFloat(Gocg);
    //alert(resultado);

    Ggue = resultado + parseFloat(Cue);
    $("#Ggue").val(Ggue);

    Gcgt = parseFloat(Ggue) + parseFloat(sub_total);

    $("#Gcgt").val(Gcgt);
    
    //alert(parseFloat(Gcgt));
   
    
  });  



  $("#Pne" ).blur(function() {
    var pne;
    var pme;
    pne = $("#Pne" ).val();
    pme = pne * 0.67 * pne;
    
    resultado = pme.toFixed(2);
   
    $("#Pme" ).val(resultado);
  });  

  $("#Pam" ).blur(function() {
    var pne;
    var pme;
    var kcch;
    var pam;
    var kpmc;
    var gch;
    var resultado;
    kpmc = 1.1;
    pne = $("#Pne" ).val();
    
    pme= $("#Pme" ).val();
    kcch = $("#Kcch" ).val();
    pam = $("#Pam" ).val();
    if(pne > 0 ) {
      
      if(pme > 0 ) {
        if(kcch > 0 ) {
          if(pam > 0 ) {
            $("#pama" ).val(pam);
            gch = pme * kcch * pam * kpmc;
           resultado = gch.toFixed(2);
          
            $("#Gch" ).val(resultado);
          }
        }
      } 

    } else {
      alert("Ningùn dato puede ser menor que 0!");
    }



  });  

  $("#valor_adquisicion" ).blur(function() {
     var vre;
     var vae;
     var vade;
     var vida;
     var vadeh;
     var coe_repart;
     var gasto_crm;
     vae = $('#valor_adquisicion').val();
     alert("valor_adquisicion " + vae);
     if (vae  == 0) {

      $('#info').html("<strong>" + "Valor Adquisición incorrecto" + "</strong>");
      $("#id_salvar").prop('disabled', true); 
      
     } else {

      vre = vae * 0.1;
      $('#Vre').val(vre);
      vade = vae - vre;
      $('#Vade').val(vade);
      alert("Valor Residual: " + vre);
      $("#id_salvar").prop('disabled', false); 
     
     }

     vida = $('#vida_util').val();
     if (vida  == 0) {
      $('#info').html("<strong>" + "Valor Vida Util incorrecto" + "</strong>")
      $('#vida_util').focus();
      $("#id_salvar").prop('disabled', true); 

     } else {

      vadeh = vade / vida;
      // datos para costo mantenimiento
      coe_repart = vadeh * 0.9;
      $('#Krmh').val(coe_repart);
      gasto_crm =coe_repart * vida;
      $('#gasto').val(gasto_crm);
      // datos para costo mantenimiento
      $('#Vadeh').val(vadeh);
      alert("Valor de Vadeh: " + vadeh);
      $("#id_salvar").prop('disabled', false); 
      $('#Vdah').val(vida);
     }
  });
    
  $("#id_vmensual" ).blur(function() {
    var total = 0;
    var acum = 0;
  var bruta = this.value;
  var consecutivo = $('#el_consecutivo').val();
  var area = $('#area').val();
  var anno = $('#anno').val();
  //alert( "Handler for .blur() called." + bruta + " consecutivo: " + consecutivo + " area: " + area);
  $.ajax({
    url: "http://localhost:8081/links/totalizar",
    type: "POST",
    data: {
    valor: bruta,
    area: area,
    consecutivo: consecutivo,
    anno,
    },
    dataType: 'json',
    success: function(result) {
      $.each(result.resultado, function(key, value) {
        
        acum = value.acumulado;
        //alert("Valor Acum:" + acum);
        if (acum == null) {
           //alert("Valor Null");
           total = bruta;
           $("#el_acumulado").val(total);
           $("#mercantil").val(0);

        } else {
          total = parseInt(bruta)+ parseInt(value.acumulado);
          $("#el_acumulado").val(total);
          //$("#mercantil").val(total);
        }
      });
   
      }
    });

});



  // $ver = "select sum(Vmensual) as acumulado from tb_ordenes E where E.Terminada = 0  
  // and E.Codarea=" . "'$area'" . " and E.OrdenTrab=" . "'$consecutivo'"; 

    $("#valor_inicial").blur(function() {
      var total = 0;
      var acum = 0;
    var bruta = this.value;
    var consecutivo = $('#el_consecutivo').val();
    var area = $('#area').val();
    var anno = $('#anno').val();
    //alert( "Handler for .blur() called." + bruta + " consecutivo: " + consecutivo + " area: " + area);
    $.ajax({
      url: "http://localhost:8081/links/totalizar",
      type: "POST",
      data: {
      valor: bruta,
      area: area,
      consecutivo: consecutivo,
      anno,
      },
      dataType: 'json',
      success: function(result) {
        $.each(result.resultado, function(key, value) {
          //alert("Acumulado: " + value.acumulado);
          acum = value.acumulado;
          if (acum == null) {
             //alert("Valor Null");
             total = bruta;
             $("#acumulado").val(total);
             $("#mercantil").val(0);

          } else {
            total = parseInt(bruta)+ parseInt(value.acumulado);
            $("#acumulado").val(total);
            $("#mercantil").val(total);
          }
        });
     
        }
     
      });

 });


  $('#fecha_fin').on('change', function() {
    var fecha_fin =  this.value;
    //alert("Inicio: " + fecha_inicio);
    var fecha_inicio = $("#fecha_inicio").val();
    //alert("Final: " + fecha_fin);
    $.ajax({
    url: "http://localhost:8081/links/comprobar_fechas",
    type: "POST",
    data: {
    fechaIni: fecha_inicio,
    fechaFin: fecha_fin,
    },
    dataType: 'json',
    success: function(result) {
    //alert(result.organ);
    $('#id_advertencia').show();
    $('#id_advertencia').html("<strong>" + result.organ + "</strong>");
    setTimeout(function () {
      $('#id_advertencia').hide();
    }, 1500);
      }
    });
  });


    $('#id_provincia').on('change', function() {
    var country_id =  this.value;
    //alert("Opcion Provincia: " + country_id);
    $("#state-dropdown").html('');
    $.ajax({
    url: "http://localhost:8081/links/get-states-by-country",
    type: "POST",
    data: {
    name: 'produccion',
    country_id: country_id,
    },
    dataType: 'json',
    success: function(result) {
    $('#state-dropdown').html('<option value="">Seleccione el Cliente</option>');
    $.each(result.states, function(key, value) {
     
    $("#state-dropdown").append('<option value="' + value.id_inver + '">' + value.nombre_inversionista + '</option>');
       });
      }
    });
  });


  $('#categorias').on('change', function() {
    
    var nombre_material = this.value;
    //alert("Opcion: " + nombre_material);
    $("#material-dropdown").html('');
    $.ajax({
      url: "http://localhost:8081/links/get-material-by-categoria",
      type: "POST",
      data: {
      descripcion: 'produccion',
      nombre_material: nombre_material,
      },
      dataType: 'json',
      success: function(result) {
      //$('#material-dropdown').html('<option value="">Seleccione el Tipo</option>');
      $.each(result.states, function(key, value) {
       
      $("#material-dropdown").append('<option value="' + value.id_material + '" + id="' + value.id_material + '">' + value.descripcion + '</option>');
         });
        }
      });
   
  });

/*  $('#categorias').on('change', function() {
    
    var id = this.value;
    $("#material-dropdown").html('');

    $('#el_id').val(this.value);
    var id_orden = $('#id_orden').val();
    var link = "http://localhost:8081/links/sel_materiales/" + id_orden + "/" + id;
    //alert(link);
    //window.location.assign(link);
  });
  */



  //$('#state-dropdown').on('click', function() {
  //    alert(this.value);
  //});

  $("#myTextMaterial").bind("change paste keyup", function() {
   
      //e.preventDefault();
      //buscarPorCodigo();
      //alert($('#myTextMaterial').val());
      $("#a_buscar_material").val(this.value);  
      busqueda =  $("#myTextMaterial").val();
      if(busqueda != "") {
      
      //id_provincia  = $("#id_h_provincia").val();
      $('#material-dropdown').html("");
      $.ajax({
        url: "http://localhost:8081/links/buscar_materiales",
        type: "POST",
        data: {
        buscar: busqueda,
        //id_provincia: id_provincia, 
        },
        dataType: 'json',
        success: function(result) {
        $('#material-dropdown').html('<option value="">Seleccione el Material</option>');
          $.each(result.states, function(key, value) {
        $("#material-dropdown").append('<option value="' + value.id_material + '" + id="' + value.id_material + '">' + value.descripcion + '</option>');
           });
          }
        });
      } 
        
      
  });

  

  


  $("#myTextBox").bind("change paste keyup", function() {
    //$('#state-dropdown').html("");
    //alert("Entrè en paste");
    $("#a_buscar").val(this.value);  
    busqueda =  $("#a_buscar").val();
      id_provincia  = $("#id_h_provincia").val();
      $('#state-dropdown').html("");
      $.ajax({
        url: "http://localhost:8081/links/buscar_inversionistas",
        type: "POST",
        data: {
        buscar: busqueda,
        id_provincia: id_provincia, 
        },
        dataType: 'json',
        success: function(result) {
        $('#state-dropdown').html('<option value="">Seleccione el Cliente</option>');
          $.each(result.states, function(key, value) {
        $("#state-dropdown").append('<option value="' + value.id_inver + '">' + value.nombre_inversionista + '</option>');
           });
          }
        });
 });



$('#state-dropdown').on('change', function() {
      $("#organismo-dropdown").prop('disabled', false);
        var cod = this.value;
        alert("Comienza");
        
        //alert("Asì: " + cod);
        $("#str_organismo").html('');
        $.ajax({
        url: "http://localhost:8081/links/get-orga-by-empresa",
        type: "POST",
        data: {
        name: 'produccion',
        cod: cod,
        },
        dataType: 'json',
        success: function(result) {
        $('#organismo-dropdown').html('<option value="">Confirme Organismo</option>');
          $.each(result.organ, function(key, value) {
            //console.log("Asi se llena el combo de Organismos" + value.cod);
        $("#organismo-dropdown").append('<option value="' + value.cod + '">' + value.nombre_inversionista + '</option>');
          });
        }
      });
      $("#id_save").prop('disabled', false); 
      $("#fecha_inicio").prop('disabled', false); 
      $("#fecha_fin").prop('disabled', false); 
      $("#codigo_inversionista").val(cod);
  });



  $('#id_mes').on('change', function() {
    var f= this.value;
    //alert(f);
    const anno = f.slice(0,4);
    $('#anno').val(anno);
  });

$('#input_fecha').on('change', function() {
  var f= this.value;
  //alert("Fecha Inicio: " + f);
  $('#fecha_inicio').val(f);
  $('#fecha_fin').val(f);
  $('#fecha_terminacion').val(f);
  //$('#id_mes').val(f);
  $('#anno').val(f);
  $('#mes').val(f);
});



function setFechaActual() {
    
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getYear();
    var year = d.getFullYear();
    var FechaActual = year + "-" + month;
    var f_ini = d.getFullYear()+"-"+zeroPadded(d.getMonth() + 1)+"-"+zeroPadded(d.getDate()); // +"T"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    $('#input_fecha').val(f_ini);
    //$('#fecha_inicio').val(f_ini);
    //$('#fecha_terminacion').val(f_ini);
    //$('#id_mes').val(f_ini);
    //$('#input_fecha_alternativa').val(f_ini);
    

    //$('#fecha_inicio').val(d.getFullYear()+"-"+zeroPadded(d.getMonth() + 1)+"-"+zeroPadded(d.getDate())); // +"T"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds() + " step='1'");
    
    //$('#fecha_fin').val(d.getFullYear()+"-"+zeroPadded(d.getMonth() + 1)+"-"+zeroPadded(d.getDate())); //+"T"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
    
    
 
};



/*$('#comencemos').click(function(){
  var d = new Date();
  var month = d.getMonth()+1;
  //var day = d.getDay();
  var year = d.getFullYear();

  alert(year + "-" + month);

});   
*/

$('#state.dropdown').click(function(){
  $("#id_save").prop('disabled', false);  
});

$( "#state").mouseover(function() {
  //$( "#log" ).append( "<div>Handler for .mouseover() called.</div>" );
  $('#id_advertencia').show();
  $('#id_advertencia').html("<strong>" + "Selecciona un Cliente" + "</strong>");
  setTimeout(function () {
    $('#id_advertencia').hide();
  }, 2700);
});

function zeroPadded(val) {
  if (val >= 10)
    return val;
  else
    return '0' + val;
}

$(".btn").click(function(){
  $("#myModal").modal('show');
});

$("#activar").click(function(){
  $('#calculos').show();
});


$("#id_venta").val(0); 
$("#id_vendido").val(0); 

$('#organismo-dropdown').html('<option value="">Confirme Organismo</option>');
$("#organismo-dropdown").prop('disabled', true);  
$("#id_save").prop('disabled', true); 

$("#fecha_inicio").prop('disabled', false); 
$("#fecha_fin").prop('disabled', false); 
$("#id_cambiar_fecha").prop('disabled', true); 

$("#label_msg").hide(); 
setItemSelected();
setCategoriasSelected();

setFechaActual();

var current_date = new Date();
$('#id_advertencia').hide();
$('#id_info').hide();
//$('#informacion').hide();
$("#id_actualizar").prop("checked", true);
$("#grabar_consecutivo").val(1);
$("#id_h_provincia").val(1);


//$('#calculos').hide();

$(window).load(function() {
  //alert("Ok");
});

//$("#inicial").prop('disabled', true);


$('#cambiar_fecha').click(function(e) { 
  $("#inicial").prop('disabled', false);
});
    
    