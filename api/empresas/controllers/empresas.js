'use strict';
const { sanitizeEntity } = require("strapi-utils");
const axios = require('axios');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    findOneDir: async ctx => {
        const { lat } = ctx.params;
        const { long } = ctx.params;
        console.log(lat);
        console.log(long);
        var empresas = [];
        const key = 'AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4';
        const { data } = await axios.get('https://strapi.ecobmas.com/empresas?estado=true');
        for (const element of data) {
            const empresa = new Object();
            empresa.categorias = element.categorias;
            empresa.id = element.id;
            empresa.nombre = element.nombre;
            empresa.descripcion = "Horario de atención 07:00 - 16:00";
            const calificacion = await axios.get('https://strapi.ecobmas.com/calificacion-empresas?empresa=' + element.id);
            var total = 0;
            calificacion.data.forEach(element => {
                total = total + element.puntaje;
            });
            let d = new Date();
            try {
                const horario = await axios.get('https://strapi.ecobmas.com/horario-empresas?empresa=' + element.id);
                horario.data[0].dias.forEach(element => {
                    if(element.key == (d.getDay()-1)){
                        empresa.descripcion = element.nombre+"\nHorario de atención "+horario.data[0].hora_inicio.split(":00.", 1)+" - "+horario.data[0].hora_final.split(":00.", 1);
                        console.log(element);
                    }else{
                        empresa.descripcion = "Sin horario";
                    }                    
                });
            } catch (error) {
                
            }
            empresa.nota = (total / calificacion.data.length).toFixed(1);
            empresa.ruc = element.ruc;
            empresa.avatar = element.avatar;
            empresa.direccion = element.direccion;
            empresa.productos = element.productos;
            empresas.push(empresa);
        }
        return await empresas;
    },
    findOneDirCat: async ctx => {
        const { lat } = ctx.params;
        const { long } = ctx.params;
        const { categoria } = ctx.params;
        console.log(lat);
        console.log(long);
        var empresas = [];
        const key = 'AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4';
        const { data } = await axios.get('https://strapi.ecobmas.com/empresas?categorias=' + categoria);
        for (const element of data) {
            const empresa = new Object();
            empresa.categorias = element.categorias;
            empresa.id = element.id;
            empresa.nombre = element.nombre;
            empresa.descripcion = "Horario de atención 07:00 - 16:00";
            const calificacion = await axios.get('https://strapi.ecobmas.com/calificacion-empresas?empresa=' + element.id);
            var total = 0;
            calificacion.data.forEach(element => {
                total = total + element.puntaje;
            });
            let d = new Date();
            try {
                const horario = await axios.get('https://strapi.ecobmas.com/horario-empresas?empresa=' + element.id);
                horario.data[0].dias.forEach(element => {
                    if(element.key == (d.getDay()-1)){
                        empresa.descripcion = element.nombre+"\nHorario de atención "+horario.data[0].hora_inicio.split(":00.", 1)+" - "+horario.data[0].hora_final.split(":00.", 1);
                        console.log("Si hay horario");
                        console.log(element);
                    }else{
                        empresa.descripcion = "Sin horario";
                    }                    
                });
            } catch (error) {
                
            }
            empresa.nota = (total / calificacion.data.length).toFixed(1);
            empresa.ruc = element.ruc;
            empresa.avatar = element.avatar;
            empresa.direccion = element.direccion;
            empresa.productos = element.productos;
            empresas.push(empresa);
        }
        return await empresas;
    }
};
