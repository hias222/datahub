import './LoadEnv'; // Must be the first import
import logger from '@shared/Logger';
import app from './ServerNew';

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

