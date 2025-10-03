import { Router } from 'express';
import authRouter from './routes.auth.js';
import productsRouter from './routes.products.js';
import cartRouter from './routes.cart.js';
import ordersRouter from './routes.orders.js';
import paymentsRouter from './routes.payments.js';
import downloadsRouter from './routes.downloads.js';
import adminRouter from './routes.admin.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/payments', paymentsRouter);
apiRouter.use('/downloads', downloadsRouter);
apiRouter.use('/admin', adminRouter);

