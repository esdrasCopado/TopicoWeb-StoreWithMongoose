import express from 'express';
import {
    crearVenta,
    agregarProductosAVenta
} from '../controllers/ventaController.js';

const router = express.Router();

// POST /api/ventas - Crear una nueva venta
router.post('/', crearVenta);

// POST /api/ventas/:idVenta/productos - Agregar productos a una venta existente
router.post('/:idVenta/productos', agregarProductosAVenta);

export default router;
