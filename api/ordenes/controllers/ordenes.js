'use strict';
const axios = require('axios');
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    orden: async ctx => {
        const { id } = ctx.params;
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes/' + id);
        var ordenes = [];
        const ord = new Object();
        ord.estado = data['estado'];
        ord.pagado = data['pagado'];
        ord.delivery = data['delivery'];
        ord.entregaEmpresa = data['entregaEmpresa'];
        ord.entregaScooter = data['entregaScooter'];
        ord.entregaFinalizado = data['entregaFinalizado'];
        ord.pagoEfectivo = data['pagoEfectivo'];
        ord.published_at = data['published_at'];
        ord.createdAt = data['createdAt'];
        ord.updatedAt = data['updatedAt'];
        ord.empresa = data['empresa'];
        ord.usuario = data['usuario'];
        ord.total = data['total'];
        ord.total_delivery = data['total_delivery'];
        ord.repartidor = data['repartidor'];
        ord.direcciones_usuario = data['direcciones_usuario'];
        ord.facturacion_usuario = data['facturacion_usuario'];
        ord.distancia_cliente = data['distancia_cliente'];
        ord.distancia_empresa = data['distancia_empresa'];
        ord.duracion_cliente = data['duracion_cliente'];
        ord.duracion_empresa = data['duracion_empresa'];
        ord.repartidor = data['repartidor'];
        ord.id = data['id'];
        const empdir = await axios.get('https://strapi.ecobmas.com/direcciones/' + data['empresa']['direccion']);
        ord.empresa_direccion = empdir.data;
        return ord;
    },
    pedidosDir: async ctx => {
        const { lat } = ctx.params;
        const { long } = ctx.params;
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes?entregaEmpresa=true&entregaScooter=false');
        var pedidos = [];
        try {
            for (const element of data) {
                const pedido = new Object();
                const empdir = await axios.get('https://strapi.ecobmas.com/direcciones/' + element.empresa.direccion);
                var R = 6378.137; //Radio de la tierra en km 
                var dLat = (lat - empdir.data.latitud) * (Math.PI / 180);
                var dLong = (long - empdir.data.longitud) * (Math.PI / 180);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat) * (Math.PI / 180)) *
                    Math.cos(empdir.data.latitud * (Math.PI / 180)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = (R * c).toFixed(2);
                pedido.id = element.id
                const km = d;
                pedido.distancia_empresa = element.distancia_empresa;
                pedido.duracion_empresa = element.duracion_empresa;
                pedido.empresa = element.empresa;
                pedido.polyline = element.polyline;
                pedido.usuario = element.usuario;
                pedido.total = element.total;
                pedido.total_delivery = element.total_delivery;
                pedido.repartidor = element.repartidor;
                pedido.ftotal = (element.total + element.total_delivery).toFixed(2);
                pedido.direcciones_usuario = element.direcciones_usuario;
                pedido.facturacion_usuario = element.facturacion_usuario;
                pedido.estado = element.estado;
                pedido.pagado = element.pagado;
                pedido.pagoEfectivo = element.pagoEfectivo;
                var d = new Date(element.updatedAt);
                pedido.updatedAt = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getUTCFullYear() + "  " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                pedido.createdAt = element.createdAt;
                if (parseFloat(km) <= 16.00) {
                    pedidos.push(pedido);
                } else {

                }
            }

        } catch (error) {

        }
        return pedidos;
    },
    pedidosUsr: async ctx => {
        const { usuario } = ctx.params;
        var pedidos = [];
        const key = 'AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4';
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes?usuario=' + usuario + '&estado=true&_sort=updatedAt:DESC');
        for (const element of data) {
            const pedido = new Object();
            pedido.id = element.id
            const empdir = await axios.get('https://strapi.ecobmas.com/direcciones/' + element.empresa.direccion);
            // const distemp = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + empdir.data.latitud + ',' + empdir.data.longitud + '&destinations=' + element.direcciones_usuario.latitud + ',' + element.direcciones_usuario.longitud + '&region=es&key=AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4');
            pedido.distancia_empresa = element.distancia_empresa;
            pedido.duracion_empresa = element.duracion_empresa;
            // const km = distemp.data.rows[0].elements[0].distance.text.split(" ", 1);
            pedido.polyline = element.polyline;
            pedido.empresa = element.empresa;
            pedido.usuario = element.usuario;
            pedido.entregaFinalizado = element.entregaFinalizado;
            pedido.total = element.total;
            pedido.total_delivery = element.total_delivery;
            pedido.repartidor = element.repartidor;
            pedido.ftotal = (element.total + element.total_delivery).toFixed(2);
            pedido.direcciones_usuario = element.direcciones_usuario;
            pedido.facturacion_usuario = element.facturacion_usuario;
            pedido.estado = element.estado;
            pedido.pagado = element.pagado;
            pedido.pagoEfectivo = element.pagoEfectivo;
            var d = new Date(element.updatedAt);
            pedido.updatedAt = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getUTCFullYear() + "  " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            pedido.createdAt = element.createdAt;
            pedidos.push(pedido);
        }
        return pedidos;
    },
    pedidoUsr: async ctx => {
        const { repartidor } = ctx.params;
        var pedidos = [];
        const key = 'AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4';
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes?repartidor=' + repartidor + '&entregaScooter=true&entregaFinalizado=false');
        for (const element of data) {
            const pedido = new Object();
            pedido.id = element.id
            const empdir = await axios.get('https://strapi.ecobmas.com/direcciones/' + element.empresa.direccion);
            // const distemp = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + empdir.data.latitud + ',' + empdir.data.longitud + '&destinations=' + element.direcciones_usuario.latitud + ',' + element.direcciones_usuario.longitud + '&region=es&key=AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4');
            pedido.distancia = distemp.data.rows[0].elements[0].distance;
            pedido.duracion = distemp.data.rows[0].elements[0].duration;
            const km = distemp.data.rows[0].elements[0].distance.text.split(" ", 1);
            pedido.kilometros = km;
            pedido.empresa = element.empresa;
            pedido.empresa_direccion = empdir.data;
            pedido.usuario = element.usuario;
            pedido.total = element.total;
            pedido.entregaScooter = element.entregaScooter;
            pedido.total_delivery = element.total_delivery;
            pedido.ftotal = (element.total + element.total_delivery).toFixed(2);
            pedido.direcciones_usuario = element.direcciones_usuario;
            pedido.facturacion_usuario = element.facturacion_usuario;
            pedido.estado = element.estado;
            pedido.pagado = element.pagado;
            pedido.pagoEfectivo = element.pagoEfectivo;
            pedido.distancia_cliente = element.distancia_cliente;
            pedido.distancia_empresa = element.distancia_empresa;
            pedido.duracion_cliente = element.duracion_cliente;
            pedido.duracion_empresa = element.duracion_empresa;
            pedido.repartidor = element.repartidor;
            var d = new Date(element.updatedAt);
            pedido.updatedAt = d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getUTCFullYear() + "  " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            pedido.createdAt = element.createdAt;
            pedidos.push(pedido);
        }
        return pedidos;
    },
    calcularPago: async ctx => {
        const { idempresa } = ctx.params;
        const { idusuario } = ctx.params;
        var total = 0.0;
        var compra = 0.0;
        const direccionUsuario = await axios.get('https://strapi.ecobmas.com/direcciones-usuarios?usuario=' + idusuario + '&estado=true');
        const empresa = await axios.get('https://strapi.ecobmas.com/empresas?id=' + idempresa);
        const conf = await axios.get('https://strapi.ecobmas.com/configuracions/' + empresa.data[0]['configuracion']['id']);
        var dirUsurio = direccionUsuario.data[0];
        var dirEmpresa = empresa.data[0]['direccion'];
        var configuracion = conf.data;
        const kilometro = await axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + dirEmpresa.latitud + ',' + dirEmpresa.longitud + '&destination=' + dirUsurio.latitud + ',' + dirUsurio.longitud + '&region=es&key=AIzaSyDABWXVpYB3iIZLPY_F08XcLR0awwqduE4');
        var polyline = kilometro.data.routes[0].overview_polyline.points;
        var km = kilometro.data.routes[0].legs[0].distance.text.split(" ", 1);
        var dist = kilometro.data.routes[0].legs[0].distance.text;
        var tiempo = kilometro.data.routes[0].legs[0].duration.text;
        var subtotal = (configuracion.arranque + (configuracion.valor_km * km[0])) * (configuracion.iva / 100) + (configuracion.arranque + (configuracion.valor_km * km[0]));
        var aux = subtotal.toFixed(2);
        var hora = new Date();
        var h_aux = hora.getHours() + ":" + hora.getMinutes();
        if (aux < configuracion.valor_minimo) {
            var tot = configuracion.valor_minimo;
            var suma = 0.0;
            total = tot;
            for (const element of configuracion.horarios) {
                if (h_aux >= element.h_inicio.split('.', 1) && h_aux <= element.h_final.split('.', 1)) {
                    suma = parseFloat(tot) + parseFloat(tot * (element.porcentaje / 100));
                    console.log(suma.toFixed(2))
                    total = suma.toFixed(2);
                } else {
                    console.log("hora a comparar" + h_aux + "hora inicio" + element.h_inicio.split('.', 1) + "hora final" + element.h_final.split('.', 1))
                }
            }
        } else {
            var tot = aux;
            total = tot;
            for (const element of configuracion.horarios) {
                if (h_aux >= element.h_inicio.split('.', 1) && h_aux <= element.h_final.split('.', 1)) {
                    suma = parseFloat(tot) + parseFloat(tot * (element.porcentaje / 100));
                    console.log(suma.toFixed(2))
                    total = suma.toFixed(2);
                } else {
                    console.log("hora a comparar" + h_aux + "hora inicio" + element.h_inicio.split('.', 1) + "hora final" + element.h_final.split('.', 1))
                }
            }
        }
        const orden = await axios.get('https://strapi.ecobmas.com/ordenes?usuario=' + idusuario + '&estado=false&empresa=' + idempresa);
        
        const prod = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + orden.data[0]['id']);
        var totalcompra = 0
        prod.data.forEach(element => {
            totalcompra = totalcompra + (element.cantidad * element.producto.precio)
        });


        await axios.put('https://strapi.ecobmas.com/ordenes/' + orden.data[0]['id'], {
            configuracion: configuracion,
            subtotal_delivery: aux,
            total_delivery: total,
            total: totalcompra.toFixed(2),
            km_delivery: km[0],
            polyline: polyline,
            distancia_empresa: dist,
            duracion_empresa: tiempo,
        }).then(response => {
            compra = response.data['total'];
        });
        var obj = new Object();
        obj.total = total;
        obj.totalcompra = totalcompra;
        obj.direccion = dirUsurio.direccion
        obj.compra = compra + (compra * 0.12)
        obj.tot = parseFloat(compra) + parseFloat(total)
        console.log(obj)
        return obj;
    },

    ordenesDespacho: async ctx => {
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes?_sort=updatedAt:DESC&&entregaEmpresa=true&entregaScooter=false')
        const resp = []
        for (const element of data) {
            const direccion = await axios.get('https://strapi.ecobmas.com/direcciones/'+element.empresa.direccion)
            const data = {
                orden:element,
                empresa:direccion.data
            }
            resp.push(data)
        };
        return resp;
    },

    aceptarOrden: async ctx => {
        const { idorden } = ctx.params;
        const { idusuario } = ctx.params;
        const ord = await axios.get('https://strapi.ecobmas.com/ordenes/'+idorden)
        if (ord.data.entregaScooter == false) {
            await axios.put('https://strapi.ecobmas.com/ordenes/'+idorden, {
                entregaScooter:true,
                repartidor:idusuario
            })
            return {
                status:1
            }
        }else{
            return {
                status:0
            }
        }
        
    },

    buscarOrden:async ctx => {
        const { idusuario } = ctx.params;
        const {data} = await axios.get('https://strapi.ecobmas.com/ordenes?repartidor=' +
        idusuario +
        '&entregaScooter=true&entregaFinalizado=false');

        const direccion = await axios.get('https://strapi.ecobmas.com/direcciones/'+data[0].empresa.direccion)
        const res = {
            orden:data[0],
            empresa:direccion.data
        }
        return res;
    },

    finalizarOrden:async ctx => {
        const { idorden } = ctx.params;
        const { efectivo } = ctx.params;
        try {
            if(efectivo == true){
                const {data} = await axios.put('https://strapi.ecobmas.com/ordenes/'+idorden, {
                    entregaFinalizado: true,
                    pago_recibido: true,
                    pagado: true,
                    
                })
            }
            else{
                const {data} = await axios.put('https://strapi.ecobmas.com/ordenes/'+idorden, {
                    entregaFinalizado: true,
                    pagado: true,
                })
            }
            return {
                success:1
            }
        } catch (error) {
            return {
                success:0
            }
        }
        
    }
};
