import {routes} from '../routesRegister/routesData.js';

const registerRoutes = (app) => {
    for (let route of routes) {
      app.use(route.path, route.router);
    }
   
  };

  export default registerRoutes