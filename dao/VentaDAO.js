import Venta from '../models/Venta.js';

class VentaDAO {
    constructor() { }

    async crearVenta(ventaData) {
        const venta = new Venta(ventaData);
        return await venta.save();
    }

    async agregaProductosAVenta(idVenta, productos) {
        try {
            const venta = await Venta.findById(idVenta);;
            if (!venta) {
                throw new Error('No se encontro la venta');
            }

            venta.productosventa.push(
                ...productos.map(producto => ({
                    idProducto: producto.idProducto,
                    descripcion: producto.nombre,
                    precioVenta: producto.precioVenta,
                    cantidad: producto.cantidad,
                    subtotal: producto.precioVenta * producto.cantidad
                }))
            );

            return await venta.save();
        } catch (error) {
            throw error;
        }
    }
}

export default new VentaDAO();