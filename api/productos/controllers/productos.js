'use strict';
const axios = require('axios');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    
    productosUsers: async ctx => {
        const { idusuario } = ctx.params;
        const { empresa } = ctx.params;
        const orden = await axios.get('https://strapi.ecobmas.com/ordenes?usuario=' + idusuario + '&empresa=' + empresa + '&estado=false');
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + orden.data[0].id)
        return data;
    },

    addProducto: async ctx => {
        const { idusuario } = ctx.params;
        const { producto } = ctx.params;
        const { empresa } = ctx.params;
        const orden = await axios.get('https://strapi.ecobmas.com/ordenes?usuario=' + idusuario + '&empresa=' + empresa + '&estado=false');
        if (orden.data.length == 0) {
            const ord = await axios.post('https://strapi.ecobmas.com/ordenes', {
                usuario: idusuario,
                empresa: empresa
            })
            await axios.post('https://strapi.ecobmas.com/ordenes-productos', {
                cantidad: 1,
                orden: ord.data.id,
                producto: producto
            })
            const { data } = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + ord.data.id)
            return data;
        } else {
            const { data } = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + orden.data[0].id + '&producto=' + producto)
            if (data.length == 0) {
                await axios.post('https://strapi.ecobmas.com/ordenes-productos', {
                    cantidad: 1,
                    orden: orden.data[0].id,
                    producto: producto
                })
                const productos = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + orden.data[0].id)
                return productos.data;
            } else {
                await axios.put('https://strapi.ecobmas.com/ordenes-productos/' + data[0].id, {
                    cantidad: data[0].cantidad + 1
                })
                const productos = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + orden.data[0].id)
                return productos.data;
            }
        }
    },
    addPro: async ctx => {
        const { id } = ctx.params;
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes-productos/' + id)
        await axios.put('https://strapi.ecobmas.com/ordenes-productos/' + id, {
            cantidad: data.cantidad + 1
        })
        const productos = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + data.orden.id)
        return productos.data;
    },
    removePro: async ctx => {
        const { id } = ctx.params;
        const { data } = await axios.get('https://strapi.ecobmas.com/ordenes-productos/' + id)
        if (data.cantidad == 1) {
            await axios.delete('https://strapi.ecobmas.com/ordenes-productos/' + id, {
            })
            const productos = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + data.orden.id)
            return productos.data;
        } else {
            await axios.put('https://strapi.ecobmas.com/ordenes-productos/' + id, {
                cantidad: data.cantidad - 1
            })
            const productos = await axios.get('https://strapi.ecobmas.com/ordenes-productos?orden=' + data.orden.id)
            return productos.data;
        }
    }
};
