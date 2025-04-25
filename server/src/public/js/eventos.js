$(function() {
    $('#ocultar').click(function() {
        //var divContent = $('#box').text();
        //alert(divContent);

        //var str = $("#id_inversionista").val();
        //alert(str);
        //alert($('#foo option:selected').text());
       // alert($('#foo option:selected').val());

       //$('#id_inversionista').hide();  

       getCountryList();



    })


         
 
     function getCountryList(p1, p2) {
        var country_id = this.value;
        $("#country-dropdown").html('');
           $.ajax({
             url: "http://localhost:8081/links/provincias-list",
             type: "GET",
             dataType: 'json',
           success: function(result) {
              $('#country-dropdown').html('<option value="">Provincia</option>');
                 $.each(result.countries, function(key, value) {
                  $("#country-dropdown").append('<option value="' + value.id + '">' + value.provincia + '</option>');
                  });
              //$('#city-dropdown').html('<option value="">Select Country First</option>');
              }
            });
         }



      $('#country-dropdown').on('change', function() {
            var country_id = this.value;
            //var country_id = $('#country-dropdown option:selected').val();
            //alert(country_id);
            
            $("#inversionistas-dropdown").html('');
            $.ajax({
               url: "http://localhost:8081/get-inversionistas-by-provincia",
        type: "POST",
        data: {
        name: 'inversionista',
        country_id: country_id,
        },
        dataType: 'json',
        success: function(result) {
        $('#inversionistas-dropdown').html('<option value="">Select State</option>');
        $.each(result.states, function(key, value) {
        $("#inversionistas-dropdown").append('<option value="' + value.id + '">' + value.name + '</option>');
        });
        //$('#city-dropdown').html('<option value="">Select State First</option>');
        }
        });
        alert(country_id);
        });

       // getCountryList();
       //prueba("Funciona");
     

});