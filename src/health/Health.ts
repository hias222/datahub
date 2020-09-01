import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
// import logger from '../shared/Logger';

// Init shared
const router = Router();

const CASSANDRA_USER = process.env.CASSANDRA_USER !== undefined ? process.env.CASSANDRA_USER : 'localhost'
const CASSANDRA_KEYSPACE = process.env.KEYSPACE !== undefined ? process.env.KEYSPACE : 'KEYSPACE'

/******************************************************************************
 *                      Get All heat - "GET /health"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    return res.status(OK).json('{"name": "datahub", "keyspace": "' + CASSANDRA_KEYSPACE + '"}');
});

export default router