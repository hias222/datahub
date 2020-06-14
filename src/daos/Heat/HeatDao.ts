import { IHeat } from '../../entities/Heat';
import CassandraResponse, { ICassandraResponse } from '../../entities/CassandraResponse';
import { Client, types } from 'cassandra-driver';

import Logger from '../../shared/Logger';
import logger from '../../shared/Logger';
import { response } from 'express';

const client = new Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'colorado'
});

const insertheatquery = 'INSERT INTO colorado.heatdata \
(heatid, event, heat, creation_date, lanes, name, swimstyle, competition, distance, gender, relaycount, round) \
    VALUES (?, ?, ?, toTimeStamp(now()), ?, ?, ?, ?, ?, ?, ? ,?)';

export interface IHeatDao {
    getOne: (email: string) => Promise<IHeat | null>;
    getAll: () => Promise<IHeat[]>;
    add: (user: IHeat) => Promise<ICassandraResponse>;
    update: (user: IHeat) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class HeatDao implements IHeatDao {

    constructor() {
        client.connect();
    }

    /**
     * @param email
     */
    public async getOne(email: string): Promise<IHeat | null> {
        // TODO
        return [] as any;
    }


    /**
     *
     */
    public async getAll(): Promise<IHeat[]> {
        // TODO
        // await client.connect();
        const rs = await client.execute('SELECT JSON * FROM colorado.heatdata');
        const row = rs.first();
        // const heatID = row.get('event_heat_id');
        const heatdata = row.get(0);
        // Logger.info(`Lane data: ${lanes}`)
        // await client.shutdown();
        return { heatdata } as any;
    }


    /**
     *
     * @param user
     */
    public async add(heatdata: IHeat): Promise<ICassandraResponse> {
        return new Promise((resolve, reject) => {
            const Uuid = types.Uuid.random();
            const resp = new CassandraResponse(Uuid.toString());
            const logg = Uuid + ' e: ' + heatdata.event * 100 + ' h: ' + heatdata.heat

            logger.info(logg.toString());
            logger.info(JSON.stringify(heatdata.lanes));

            const params = [Uuid, heatdata.event, heatdata.heat, heatdata.lanes, heatdata.name, heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
            client.execute(insertheatquery, params, { prepare: true })
                .then(result => {
                    resolve(resp.successMessage())
                })
                .catch(reason => {
                    Logger.info(reason)
                    reject(resp.errorMessage(reason))
                })
        })
    }


    /**
     *
     * @param user
     */
    public async update(user: IHeat): Promise<void> {
        // TODO
        return {} as any;
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
        // TODO
        return {} as any;
    }
}

export default HeatDao;
