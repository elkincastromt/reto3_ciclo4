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
    traerInformacionUsuarios()
})

$("#logOut").click(function(){
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userPerfil");

})

function traerInformacionUsuarios(){
    
    $.ajax({    
            url : 'http://129.151.123.56:8080/api/user/all',
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
                   filas +="<td>"+resultado[i].identification+"</td>" 
                   filas +="<td>"+resultado[i].name+"</td>" 
                   filas +="<td>"+resultado[i].address+"</td>" 
                   filas +="<td>"+resultado[i].cellPhone+"</td>" 
                   filas +="<td>"+resultado[i].email+"</td>" 
                   filas +="<td>"+resultado[i].zone+"</td>" 
                   filas +="<td>"+resultado[i].type+"</td>" 
                   filas +="<td><button class='btn btn-danger' onclick='eliminarUsuario("+resultado[i].id+")'><i class='fas fa-trash-alt'></i></button>"
                   filas += "<button class='btn btn-success'  data-bs-toggle='modal' data-bs-target='#editarUsuario' onclick='cargarDatosUsuario("+resultado[i].id+")'><i class='fas fa-edit'></i></button>"
                }
                $("#resultado").append(filas+"</tr>")
            }
        });
}


function guardarUsuario(){ 

var datos ={ 
        id: $("#identification").val(),
        identification: $("#identification").val(),
        name: $("#name").val(),
        address: $("#address").val(),
        cellPhone: $("#cellPhone").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        zone: $("#zone").val(),
        type: $("#type").val()
     }

    var validar = [$("#email").val(), $("#password").val(), $("#name").val(), $("#identification").val(), $("#address").val(), $("#cellPhone").val(), $("#zone").val(), $("#type").val()] 

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
                url : 'http://129.151.123.56:8080/api/user/emailexist/'+$("#email").val(),
                dataType : 'JSON',
                type : 'GET',
                success : function(resultado) {
    
                    if(!resultado){
                        $.ajax({    
                            url : 'http://129.151.123.56:8080/api/user/new',
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
                                        title: 'Usuario registrado correctamente',
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#157347'
                                    }).then((result) => {
                                        limpiarFormulario();
                                        traerInformacionUsuarios();
                                        $("#agregarUsuario").modal('hide'); //ocultamos el modal
                                        $('body').removeClass('modal-open'); //eliminamos la clase del body para poder hacer scroll
                                        $('.modal-backdrop').remove();
                                      })
                                
                            }
                        });
                    }else{
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'El Email ingresado ya existe, por favor intente con otro',
                            showConfirmButton: true,
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#0D6EFD'
                        })
                    }
                    
                },
                error : function(xhr, status) {
                    alert('ha sucedido un problema'+ xhr.status);
                },
                complete : function(xhr, status) {
                    //alert('Petición realizada '+xhr.status);
                }
            });    

    }
}

function eliminarUsuario(idUsuario){

    Swal.fire({
        title: '¿Está seguro de borrar el usuario?',
        text: "¡Si no lo está puede cancelar la accíón!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, borrar usuario!'
      }).then(function(result){
    
        if(result.value){
    
            $.ajax({    
                url : 'http://129.151.123.56:8080/api/user/'+idUsuario,
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
                        title: 'Usuario eliminado correctamente',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#157347'
                    }).then((result) => {
                        traerInformacionUsuarios();
                      })
                }
            }); 
    
        }
    
      })
}

function cargarDatosUsuario(id){
    $.ajax({    
        url : 'http://129.151.123.56:8080/api/user/'+id,
        dataType : 'JSON',
        type : 'GET',
        success : function(resultado) {

            $("#editarName").val(resultado.name)
            $("#editarIdentification").val(resultado.identification)
            $("#editarId").val(resultado.id)
            $("#editarAddress").val(resultado.address)
            $("#editarCellPhone").val(resultado.cellPhone)
            $("#editarEmail").val(resultado.email)
            $("#editarPassword").val(resultado.password)
            $("#editarZone").val(resultado.zone)
            $("#editarType").val(resultado.type)
            
        },
        error : function(xhr, status) {
            alert('ha sucedido un problema'+ xhr.status);
        }
    });
}

function actualizarUsuario(){

    var datos2 ={ 
        id: $("#editarId").val(),
        identification: $("#editarIdentification").val(),
        name: $("#editarName").val(),
        address: $("#editarAddress").val(),
        cellPhone: $("#editarCellPhone").val(),
        email: $("#editarEmail").val(),
        password: $("#editarPassword").val(),
        zone: $("#editarZone").val(),
        type: $("#editarType").val()
     }

    var validar = [$("#editarId").val(), $("#editarPassword").val(), $("#editarName").val(), $("#editarIdentification").val(), $("#editarAddress").val(), $("#editarCellPhone").val()] 

    if(!validarCamposEditar(validar))
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
                            url : 'http://129.151.123.56:8080/api/user/update',
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
                                        title: 'Usuario editado correctamente',
                                        showConfirmButton: true,
                                        confirmButtonText: 'Aceptar',
                                        confirmButtonColor: '#157347'
                                    }).then((result) => {
                                        limpiarFormulario();
                                        traerInformacionUsuarios();
                                        $("#editarUsuario").modal('hide'); //ocultamos el modal
                                        $('body').removeClass('modal-open'); //eliminamos la clase del body para poder hacer scroll
                                        $('.modal-backdrop').remove();
                                      })
                                
                            }
                        });
                
    }

}

function validarCampos(campo){
    if(campo[0]!= "" && campo[1]!= "" && campo[2]!= "" && campo[3]!= "" && campo[4]!= "" && campo[5]!= "" && campo[6]!= "" && campo[7]!= "")
        return true
    else
        return false;
}

function limpiarFormulario(){

    document.getElementById("formAgregarusuario").reset();
    document.getElementById("formEditarusuario").reset();
}

function validarCamposEditar(campo){
    if(campo[0]!= "" && campo[1]!= "" && campo[2]!= "" && campo[3]!= "" && campo[4]!= "" && campo[5]!= "")
        return true
    else
        return false;
}