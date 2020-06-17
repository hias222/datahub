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
 *                      Get All heat - "GET /api/heat/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const heat = await heatDao.getAll();
    return res.status(OK).json(heat);
});


/******************************************************************************
 *                       Add One - "POST /api/heat/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    const heatdata = req.body;
    
    if (!heatdata) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    heatDao.add(heatdata)
        .then(
            answer => {
                return res.status(CREATED).json(answer);
            })
        .catch(
            answer => {
                logger.info(JSON.stringify(answer))
                return res.status(BAD_REQUEST).json(answer);
            }
        )
});


/******************************************************************************
 *                       Update - "PUT /api/heat/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    user.id = Number(user.id);
    await heatDao.update(user);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/heat/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await heatDao.delete(Number(id));
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/heat/delete/:id"
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
