import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import HeatDao from '@daos/Heat/HeatDao';
import { paramMissingError } from '@shared/constants';
import logger from '../shared/Logger';

// Init shared
const router = Router();
const heatDao = new HeatDao();

/******************************************************************************
 *                      Get All heat - "GET /datahub/heat/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const heat = await heatDao.getAll();
    return res.status(OK).json(heat);
});


/******************************************************************************
 *                    Delete - "DELETE /datahub/heat/search/:id"
 ******************************************************************************/

router.get('/search/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    heatDao.search(id)
        .then(heat => res.status(OK).json(heat))
        .catch((reason) => res.status(404).json(reason))
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
