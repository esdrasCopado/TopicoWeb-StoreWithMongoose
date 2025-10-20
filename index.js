import express from 'express';
import { AppError, globlaErrorHandler} from './utils/appError.js';
import morgan from 'morgan';
import { conectar } from './config/db.js';
import productoRoutes from './routes/productoRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';

const app = express();

//Middleware para analizar los datos del cuerpo de las solicitudes en formato JSON
app.use(express.json());

//Configurar el middleware de morgan para el registro de solicitudes en consola
app.use(morgan('combined'));

//Middleware para exponer mis rutas y puedan ser accedidas
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de la Tienda',
        endpoints: {
            productos: '/api/productos',
            ventas: '/api/ventas'
        }
    });
});

app.use((req,res,next)=>{
    const error = new AppError(`No se ha podido acceder a ${req.originalUrl} en el servidor`, 404);
    next(error);
});

app.use(globlaErrorHandler);

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos y luego iniciar el servidor
conectar()
    .then(() => {
        console.log('Conectado a MongoDB exitosamente');
        app.listen(PORT, ()=>{
            console.log(`El servidor esta corriendo en el puerto ${PORT}`)
        });
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    });