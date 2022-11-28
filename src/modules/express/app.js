import express from 'express';
/* TODO: this slint error will be fixed when import assert reaches stage 4 and Eslint write support for it */
/*https://github.com/eslint/eslint/discussions/15305*/
import pkgJson from '../../../package.json' assert {type: "json"};
import cors from 'cors';
import {Logger} from "../../utils/logger.js";


export const appGenerator = () => {
    const config = (app) => {
      app.options('*', cors({
        origin: process.env.NODE_ENV !== 'production' ? '*' : process.env.DOMAIN,
        credentials: true,
        optionsSuccessStatus: 204,
        exposedHeaders: ['X-Auth', 'Access-Control-Allow-Origin', 'Content-Type', 'Content-Length', 'X-Requested-With'],
      }));
      app.use(express.json());
    };
    const addRouter = (app, router, path) => app.use(`${path}/`, router);
    const initializeRouters = (app) =>{
      // addRouter(app, null, null);
    };
    const getIndex = (app) => {
      app.get(__API_PREFIX, (req, res) => {
        const {name, version, author, description} = pkgJson;
        res.status(200).json({name, version, author, description});
      });
    };
    const app = express();
    /** Set config & middlewares */
    config(app);
    /** Add API routes */
    initializeRouters(app);

    getIndex(app);

    app.use('*', (req, res) => {
      res.status(404).json({
        statusCode: 404,
        error: 'Not found',
      });
    });
    app.use(new Logger().logger)

    return app;
};
