function verificarUsuario(){

    var validar = [$("#email").val(), $("#password").val()] 

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
            url : 'http://129.151.123.56:8080/api/user/'+validar[0]+'/'+validar[1],
            type : 'GET',
            dataType : 'JSON',
            
            error : function(xhr, status) {
                alert('ha sucedido un problema, '+xhr.status);
            },
            success : function(resultado) {
                console.log(resultado.id)
                if(resultado.id==null){
                    console.log("no existe")
                    limpiarFormularioLogin();
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Usuario o contraseña incorrecto',
                        showConfirmButton: true,
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#0D6EFD'
                    })
                }else{
                    console.log(resultado.type)
                    sessionStorage.setItem("userId", resultado.id)
                    sessionStorage.setItem("userPerfil", resultado.type)
                    sessionStorage.setItem("userZone", resultado.zone)
                    
                    if(resultado.type=="ADM"){

                        limpiarFormularioLogin();
                        window.location.href="usuarios.html";

                    }else{

                        if(resultado.type=="COORD"){

                            limpiarFormularioLogin();
                            window.location.href="coordinador.html";
    
                        }else{
    
                            limpiarFormularioLogin();
                            window.location.href="asesor.html";
    
                        }

                    }
                }
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

function limpiarFormularioLogin(){
    document.getElementById("formLogin").reset();
}