$("document").ready(function(){

    var id = sessionStorage.getItem("userId")
    var perfil = sessionStorage.getItem("userPerfil")

    if(id==null){
        window.location.href="index.html";
    }else{
        if(perfil=="ASE"){
            window.location.href="asesor.html";
        }else{
            if(resultado.type=="COORD")
                window.location.href="coordinador.html";
        }
    }
    traerInformacionProductos()
})

$("#logOut").click(function(){
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userPerfil");

})


function traerInformacionProductos(){
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/clone/all',
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                $("#resultado").empty();
                filas = ""
                for(i = 0;  i < resultado.length; i++){
                   filas += "<tr>"
                   filas +="<td>"+resultado[i].id+"</td>"   
                   filas +="<td>"+resultado[i].brand+"</td>" 
                   filas +="<td>"+resultado[i].procesor+"</td>" 
                   filas +="<td>"+resultado[i].os+"</td>" 
                   filas +="<td>"+resultado[i].description+"</td>" 
                   filas +="<td>"+resultado[i].memory+"</td>" 
                   filas +="<td>"+resultado[i].hardDrive+"</td>" 
                   filas +="<td>"+resultado[i].availability+"</td>" 
                   filas +="<td>"+resultado[i].price+"</td>" 
                   filas +="<td>"+resultado[i].quantity+"</td>" 
                   filas +="<td>"+resultado[i].photography+"</td>" 
                   filas +="<td><button class='btn btn-danger' onclick='eliminarProducto("+resultado[i].id+")'><i class='fas fa-trash-alt'></i></button>"
                   filas += "<button class='btn btn-success'  data-bs-toggle='modal' data-bs-target='#editarProducto' onclick='cargarDatosProducto("+resultado[i].id+")'><i class='fas fa-edit'></i></button>"
                }
                $("#resultado").append(filas+"</tr>")
            }
        });
}


function guardarProducto(){ 

var datos ={ 
        id: $("#id").val(),
        brand: $("#brand").val(),
        procesor: $("#procesor").val(),
        os: $("#os").val(),
        description: $("#description").val(),
        memory: $("#memory").val(),
        hardDrive: $("#hardDrive").val(),
        availability: $("#availability").val(),
        price: $("#price").val(),
        quantity: $("#quantity").val(),
        photography: $("#photography").val()
     }

    var validar = [$("#id").val(), $("#brand").val(), $("#procesor").val(), $("#os").val(), $("#description").val(), $("#memory").val(), $("#price").val(), $("#availability").val(), $("#memory").val(), $("#quantity").val()] 

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
                        $.ajax({    
                            url : 'http://129.151.123.56:8080/api/clone/new',
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
                                        title: 'Producto registrado correctamente',
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#157347'
                                    }).then((result) => {
                                        limpiarFormulario();
                                        traerInformacionProductos();
                                        $("#agregarProducto").modal('hide'); //ocultamos el modal
                                        $('body').removeClass('modal-open'); //eliminamos la clase del body para poder hacer scroll
                                        $('.modal-backdrop').remove();
                                      })
                                
                            }
                        }); 

    
}
}

function eliminarProducto(idProducto){

    Swal.fire({
        title: '¿Está seguro de borrar el producto?',
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, borrar producto!'
      }).then(function(result){
    
        if(result.value){
    
            $.ajax({    
                url : 'http://129.151.123.56:8080/api/clone/'+idProducto,
                dataType : 'JSON',
                type : 'DELETE',
                success : function(json, textStatus, xhr) {
            
                
                },
                error : function(xhr, status) {
                   
                    
                },
                complete : function(xhr, status) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Producto eliminado correctamente',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#157347'
                    }).then((result) => {
                        traerInformacionProductos();
                      })
                }
            }); 
    
        }
    
      })
}

function cargarDatosProducto(id){
    $.ajax({    
        url : 'http://129.151.123.56:8080/api/clone/'+id,
        dataType : 'JSON',
        type : 'GET',
        success : function(resultado) {

            console.log(resultado);

            $("#editarId").val(resultado.id)
            $("#editarBrand").val(resultado.brand)
            $("#editarProcesor").val(resultado.procesor)
            $("#editarOs").val(resultado.os)
            $("#editarDescription").val(resultado.description)
            $("#editarMemory").val(resultado.memory)
            $("#editarHardDrive").val(resultado.hardDrive)
            $("#editarAvailability").val(resultado.availability)
            $("#editarPrice").val(resultado.price)
            $("#editarQuantity").val(resultado.quantity)
            $("#editarPhotography").val(resultado.photography)
            
        },
        error : function(xhr, status) {
            alert('ha sucedido un problema'+ xhr.status);
        }
    });
}

function actualizarProducto(){

    var datos2 ={ 
        id: $("#editarId").val(),
        brand: $("#editarBrand").val(),
        procesor: $("#editarProcesor").val(),
        os: $("#editarOs").val(),
        description: $("#editarDescription").val(),
        memory: $("#editarMemory").val(),
        hardDrive: $("#editarHardDrive").val(),
        availability: $("#editarAvailability").val(),
        price: $("#editarPrice").val(),
        quantity: $("#editarQuantity").val(),
        photography: $("#editarPhotography").val()
     }

    var validar = [$("#editarId").val(), $("#editarBrand").val(), $("#editarProcesor").val(), $("#editarOs").val(), $("#editarDescription").val(), $("#editarMemory").val(), $("#editarHardDrive").val(), $("#editarAvailability").val(), $("#editarPrice").val(), $("#editarQuantity").val()] 

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
            
                        $.ajax({    
                            url : 'http://129.151.123.56:8080/api/clone/update',
                            data : JSON.stringify(datos2),
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
                                        title: 'Producto editado correctamente',
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#157347'
                                    }).then((result) => {
                                        limpiarFormulario();
                                        traerInformacionProductos();
                                        $("#editarProducto").modal('hide'); //ocultamos el modal
                                        $('body').removeClass('modal-open'); //eliminamos la clase del body para poder hacer scroll
                                        $('.modal-backdrop').remove();
                                      })
                                
                            }
                        });
                
    }

}

function validarCampos(campo){
    if(campo[0]!= "" && campo[1]!= "" && campo[2]!= "" && campo[3]!= "" && campo[4]!= "" && campo[5]!= "" && campo[6]!= "" && campo[7]!= "" && campo[8]!= "" && campo[9]!= "")
        return true
    else
        return false;
}

function limpiarFormulario(){

    document.getElementById("formAgregarProducto").reset();
    document.getElementById("formEditarProducto").reset();
}