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
    CargarProductos()
    
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

function CargarProductos(){
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/clone/all',
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                $("#product").empty();
                options = ""
                options += "<option value='' selected>Seleccione Producto</option>"
                for(i = 0;  i < resultado.length; i++){
                    options +="<option value='"+resultado[i].id+"'>"+resultado[i].brand+" "+resultado[i].procesor+" "+resultado[i].os+" "+resultado[i].memory+" RAM "+resultado[i].hardDrive+"</option>"
                }
                $("#product").append(options)
            }
        });
}

var listaProductos={};
var listaCantidades = {};
var contador=0;
var asesor=""

function agregarProducto (){

    var idProducto =$("#product").val()
    var candidad =$("#cantidad").val()

    var validar = [$("#product").val(), $("#cantidad").val()] 

    if(!validarCampos(validar))
        Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Todos los campos son requeridos',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0D6EFD'
                })
    else{  
        contador+=1

        $.ajax({    
            url : 'http://129.151.123.56:8080/api/clone/'+idProducto,
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                    listaProductos[contador]=resultado
                    listaCantidades[contador]=candidad

                    $("#orden").empty();
                    filas = ""
                    for (var llave in listaProductos) {
                        filas += "<tr>"
                        filas +="<td>"+listaProductos[llave].brand+" "+listaProductos[llave].procesor+" "+listaProductos[llave].os+" "+listaProductos[llave].memory+" RAM "+listaProductos[llave].hardDrive+"</td>" 
                        filas +="<td>"+listaCantidades[llave]+"</td>"   
                    }
                    $("#orden").append(filas+"</tr>")
                
            }
        });
    }
    limpiarFormulario()
}

function guardarOrden (){
    var id = sessionStorage.getItem("userId")
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/user/'+id,
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                asesor= resultado;
            }
        });

    var datos ={ 
        registerDay:Date.now(),
        status: "Pendiente",
        "salesMan":asesor,
        products: listaProductos,
        quantities: listaCantidades
     }

     console.log(datos)

    if(Object.entries(listaProductos).length === 0)
        Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Por favor agrege al menos un producto a la orden',
                    showConfirmButton: true,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#0D6EFD'
                })
    else{   
                    $.ajax({    
                        url : 'http://129.151.123.56:8080/api/order/new',
                        data : JSON.stringify(datos),
                        type : 'POST',
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
                                    title: 'Orden registrada correctamente',
                                    showConfirmButton: true,
                                    confirmButtonText: 'Aceptar',
                                    confirmButtonColor: '#157347'
                                }).then((result) => {
                                    $("#orden").empty();
                                  })
                            
                        }
                    }); 
    }

}

function validarCampos(campo){
    if(campo[0]!= "" && campo[1]!= "")
        return true
    else
        return false;
}

function limpiarFormulario(){

    document.getElementById("formAgregarProducto").reset();
}