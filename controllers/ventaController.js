import VentaDAO from '../dao/VentaDAO.js';
import ProductoDAO from '../dao/ProductoDAO.js';
import { AppError } from '../utils/appError.js';

export const crearVenta = async (req, res, next) => {
    try {
        const { productos } = req.body;

        if (!productos || productos.length === 0) {
            return next(new AppError('Debe incluir al menos un producto', 400));
        }

        // Calcular totales
        let subtotalGeneral = 0;
        const productosVenta = [];

        for (const prod of productos) {
            const producto = await ProductoDAO.obtenerProductoPorId(prod.idProducto);

            if (!producto) {
                return next(new AppError(`Producto con ID ${prod.idProducto} no encontrado`, 404));
            }

            if (producto.cantidad < prod.cantidad) {
                return next(new AppError(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.cantidad}`, 400));
            }

            const subtotal = producto.precio * prod.cantidad;
            subtotalGeneral += subtotal;

            productosVenta.push({
                idProducto: producto._id,
                descripcion: producto.nombre,
                precioVenta: producto.precio,
                cantidad: prod.cantidad,
                subtotal: subtotal
            });

            // Actualizar stock del producto
            await ProductoDAO.actualizarProductoPorId(producto._id, {
                cantidad: producto.cantidad - prod.cantidad
            });
        }

        const iva = subtotalGeneral * 0.16; // IVA 16%
        const total = subtotalGeneral + iva;

        const venta = await VentaDAO.crearVenta({
            total,
            iva,
            productosventa: productosVenta
        });

        res.status(201).json({
            status: 'success',
            data: {
                venta
            }
        });
    } catch (error) {
        next(error);
    }
};

export const agregarProductosAVenta = async (req, res, next) => {
    try {
        const { idVenta } = req.params;
        const { productos } = req.body;

        if (!productos || productos.length === 0) {
            return next(new AppError('Debe incluir al menos un producto', 400));
        }

        // Validar stock antes de agregar
        for (const prod of productos) {
            const producto = await ProductoDAO.obtenerProductoPorId(prod.idProducto);

            if (!producto) {
                return next(new AppError(`Producto con ID ${prod.idProducto} no encontrado`, 404));
            }

            if (producto.cantidad < prod.cantidad) {
                return next(new AppError(`Stock insuficiente para ${producto.nombre}`, 400));
            }

            // Actualizar stock
            await ProductoDAO.actualizarProductoPorId(producto._id, {
                cantidad: producto.cantidad - prod.cantidad
            });
        }

        const venta = await VentaDAO.agregaProductosAVenta(idVenta, productos);

        // Recalcular totales
        let nuevoSubtotal = 0;
        venta.productosventa.forEach(prod => {
            nuevoSubtotal += prod.subtotal;
        });

        venta.iva = nuevoSubtotal * 0.16;
        venta.total = nuevoSubtotal + venta.iva;
        await venta.save();

        res.status(200).json({
            status: 'success',
            data: {
                venta
            }
        });
    } catch (error) {
        next(error);
    }
};
