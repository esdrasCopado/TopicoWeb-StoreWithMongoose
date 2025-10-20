import ProductoDAO from '../dao/ProductoDAO.js';
import { AppError } from '../utils/appError.js';

export const crearProducto = async (req, res, next) => {
    try {
        const { nombre, precio, cantidad } = req.body;

        if (!nombre || !precio || !cantidad) {
            return next(new AppError('Nombre, precio y cantidad son requeridos', 400));
        }

        const producto = await ProductoDAO.crearProducto({ nombre, precio, cantidad });
        res.status(201).json({
            status: 'success',
            data: {
                producto
            }
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerProductos = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const productos = await ProductoDAO.obtenerProductos(limit);

        res.status(200).json({
            status: 'success',
            results: productos.length,
            data: {
                productos
            }
        });
    } catch (error) {
        next(error);
    }
};

export const obtenerProductoPorId = async (req, res, next) => {
    try {
        const producto = await ProductoDAO.obtenerProductoPorId(req.params.id);

        if (!producto) {
            return next(new AppError('Producto no encontrado', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                producto
            }
        });
    } catch (error) {
        next(error);
    }
};

export const actualizarProducto = async (req, res, next) => {
    try {
        const { nombre, precio, cantidad } = req.body;
        const producto = await ProductoDAO.actualizarProductoPorId(req.params.id, { nombre, precio, cantidad });

        if (!producto) {
            return next(new AppError('Producto no encontrado', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                producto
            }
        });
    } catch (error) {
        next(error);
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const producto = await ProductoDAO.eliminarProductoPorId(req.params.id);

        if (!producto) {
            return next(new AppError('Producto no encontrado', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
