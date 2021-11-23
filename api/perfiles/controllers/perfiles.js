'use strict';
const axios = require('axios');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    validar: async ctx => {
        const { cedula } = ctx.params;
        const { email } = ctx.params;
        const { celular } = ctx.params;
        const { nombres } = ctx.params;
        const { password } = ctx.params;
        var resp;
        resp = new Object();
        const v_email = await axios.get('https://strapi.ecobmas.com/users?email=' + email)
        const v_cedula = await axios.get('https://strapi.ecobmas.com/users?cedula=' + cedula)
        if (v_cedula.data.length == 0) {
        } else {
            resp.error_cedula = 'Cédula ya existe'
        }
        if (v_email.data.length == 0) {
            
        } else {
            resp.error_email = 'Correo ya existe'
        }
        if (cedula.length == 10) {
            var digito_region = cedula.substring(0, 2);
            if (digito_region >= 1 && digito_region <= 24) {
                var ultimo_digito = cedula.substring(9, 10);
                var pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));
                var numero1 = cedula.substring(0, 1);
                var numero1 = (numero1 * 2);
                if (numero1 > 9) { var numero1 = (numero1 - 9); }
                var numero3 = cedula.substring(2, 3);
                var numero3 = (numero3 * 2);
                if (numero3 > 9) { var numero3 = (numero3 - 9); }
                var numero5 = cedula.substring(4, 5);
                var numero5 = (numero5 * 2);
                if (numero5 > 9) { var numero5 = (numero5 - 9); }
                var numero7 = cedula.substring(6, 7);
                var numero7 = (numero7 * 2);
                if (numero7 > 9) { var numero7 = (numero7 - 9); }
                var numero9 = cedula.substring(8, 9);
                var numero9 = (numero9 * 2);
                if (numero9 > 9) { var numero9 = (numero9 - 9); }
                var impares = numero1 + numero3 + numero5 + numero7 + numero9;
                var suma_total = (pares + impares);
                var primer_digito_suma = String(suma_total).substring(0, 1);
                var decena = (parseInt(primer_digito_suma) + 1) * 10;
                var digito_validador = decena - suma_total;
                if (digito_validador == 10)
                    var digito_validador = 0;
                if (digito_validador == ultimo_digito) {
                    // axios.post('https://strapi.ecobmas.com/users', {
                    //     username: email,
                    //     email: email,
                    //     cedula: cedula,
                    //     nombres: nombres,
                    //     password: password,
                    //     role: '5fa22f11fb3a6f365edd2c3a',
                    //     perfil: '5fa232cdc8b4b96546c8c95e',
                    //     confirmed: true,
                    //     blocked: true,
                    // })
                } else {
                    //return 'la cedula:' + cedula + ' es incorrecta';
                    resp.error_cedula = 'Cédula incorrecta'
                }

            } else {
                //return 'Esta cedula no pertenece a ninguna region';
                resp.error_cedula = 'Cédula incorrecta'
            }
        } else {
            resp.error_cedula = 'Cédula incorrecta'
            //return 'Esta cedula no tiene 10 Digitos';
        }
        console.log(Object.keys(resp).length)
        if (Object.keys(resp).length == 0) {
            resp.estado = 'ok'
            try {
                await axios.post('https://app.ecobmas.com/api/validar',{
                    email:email
                })
            } catch (error) {
                console.log(error)
            }
            const usr = await axios.post('https://strapi.ecobmas.com/users', {
                username: email,
                email: email,
                cedula: cedula,
                telefono:celular,
                nombres: nombres,
                password: password,
                role: '5fa22f11fb3a6f365edd2c3a',
                perfil: '5fa232cdc8b4b96546c8c95e',
                confirmed: true,
                blocked: true,
            })
            await axios.post('https://strapi.ecobmas.com/facturacion-usuarios',{
                usuario:usr.data.id,
                email: email,
                cedula: cedula,
                nombres: nombres,
                estado:true
            })
        } else {
            resp.estado = 'error'
        }
        return resp;
    }
};
