$("document").ready(function(){

    var id = sessionStorage.getItem("userId")
    var perfil = sessionStorage.getItem("userPerfil")

    if(id==null){
        window.location.href="index.html";
    }else{
        if(perfil=="ADM"){
            window.location.href="usuarios.html";
        }else{
            if(resultado.type=="COORD")
                window.location.href="coordinador.html";
        }
    }
    traerInformacionUsuarios()
    traerInformacionOrdenes()
    
})

$("#logOut").click(function(){
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userPerfil");

})


function traerInformacionUsuarios(){
    var id = sessionStorage.getItem("userId")
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/user/'+id,
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                console.log(resultado)
                $("#resultado").empty();
                filas = ""
                   filas += "<tr>"
                   filas +="<td>"+resultado.identification+"</td>" 
                   filas +="<td>"+resultado.name+"</td>"
                   filas +="<td>"+resultado.email+"</td>" 
                   filas +="<td>"+resultado.zone+"</td>" 
                   filas +="<td>"+resultado.type+"</td>" 
                
                $("#resultado").append(filas+"</tr>")
            }
        });
}

function traerInformacionOrdenes(){
    var zone = sessionStorage.getItem("userZone")
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/order/zona/'+zone,
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                console.log(resultado)
                $("#orden").empty();
                filas = ""
                for(i = 0;  i < resultado.length; i++){
                    filas += "<tr>"
                    filas += "<td>"
                    for(let key in resultado[i].products){
                        console.log(resultado[i].products[key].brand)
                        
                        filas+="<b>Prododucto "
                        filas +=resultado[i].products[key].id+"</b> "
                        filas +=resultado[i].products[key].brand+" "
                        filas +=resultado[i].products[key].procesor+" "
                        filas +=resultado[i].products[key].os+" "
                        filas +=resultado[i].products[key].memory+" RAM "
                        filas +=resultado[i].products[key].hardDrive+" <b>cantidad: </b>"
                        filas +=resultado[i].quantities[key]+" "
                    } 
                    filas += "</td>" 
                    filas += "<td>"+resultado[i].salesMan.name+"</td>" 
                    filas += "<td>"+resultado[i].status+"</td>" 
                    filas +="<td><button title='Rechazar' class='btn btn-danger' onclick='rechazarOrden("+resultado[i].id+")'><i class='fas fa-times'></i></button>"
                   filas += "<button title='Aprobar' class='btn btn-success' onclick='aprobarOrden("+resultado[i].id+")'><i class='fas fa-check'></i></button>"
                
                }
                $("#orden").append(filas+"</tr>")
            }
        });
}

function rechazarOrden(id){

    var datos = {
        id: id,
        status: "Rechazada"
    }
    Swal.fire({
        title: '¿Está seguro de cambiar el estado de la orden numero '+id,
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, actualizar orden!'
      }).then(function(result){
    
        if(result.value){
    
            $.ajax({    
                url : 'http://129.151.123.56:8080/api/order/update',
                data : JSON.stringify(datos),
                type : 'PUT',
                contentType: 'application/json',
                dataType: 'JSON',
                success : function(json, textStatus, xhr) {
            
                
                },
                error : function(xhr, status) {
                   
                    
                },
                complete : function(xhr, status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Orden Actualizada Correctamente',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#157347'
                    }).then((result) => {
                        traerInformacionOrdenes();
                      })
                }
            }); 
    
        }
    
      })

}

function aprobarOrden(id){

    
    var datos = {
        id: id,
        status: "Aprobada"
    }
    Swal.fire({
        title: '¿Está seguro de cambiar el estado de la orden numero '+id,
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, actualizar orden!'
      }).then(function(result){
    
        if(result.value){
    
            $.ajax({    
                url : 'http://129.151.123.56:8080/api/order/update',
                data : JSON.stringify(datos),
                type : 'PUT',
                contentType: 'application/json',
                dataType: 'JSON',
                success : function(json, textStatus, xhr) {
            
                
                },
                error : function(xhr, status) {
                   
                    
                },
                complete : function(xhr, status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Orden Actualizada Correctamente',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#157347'
                    }).then((result) => {
                        traerInformacionOrdenes();
                      })
                }
            }); 
    
        }
    
      })
    
}