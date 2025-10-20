import mongoose from "mongoose";

const productoVendidoSchema = new mongoose.Schema({
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precioVenta: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const ventaSchema = new mongoose.Schema({
    total:{
        type: Number,
        required: true
    },
    iva: {
        type: Number,
        required: true
    },
    productosventa: [productoVendidoSchema]
});

export default mongoose.model('Venta', ventaSchema);