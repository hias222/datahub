import { IHeat } from '../../entities/Heat';
import { Client, types } from 'cassandra-driver';

import Logger from '../../shared/Logger';
import logger from '../../shared/Logger';
import { response } from 'express';
import { resolve } from 'dns';

const client = new Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'colorado'
});

const wkid = 1;

const insertheatquery = 'INSERT INTO colorado.heatdata \
(heatid, lastid, event, heat, creation_date, lanes, name, swimstyle, competition, distance, gender, relaycount, round) \
    VALUES (?, ?, ?, ?, toTimeStamp(now()), ?, ?, ?, ?, ?, ?, ? ,?)';

const insertheatid = 'INSERT INTO colorado.heatids \
    (wkid,creation_date, heatID ) \
        VALUES (?,toTimeStamp(now()), ?)';

const updateheatid = 'UPDATE colorado.heatdata \
        SET \
	    nextid= ? \
        WHERE heatid=?';

const selectlastheatid = 'SELECT heatid, creation_date, wkid \
        FROM colorado.heatids \
        where wkid= ? \
        LIMIT 10';

export interface IHeatDao {
    getOne: (email: string) => Promise<IHeat | null>;
    getAll: () => Promise<IHeat[]>;
    add: (user: IHeat) => Promise<any>;
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
    public async add(heatdata: IHeat): Promise<any> {
        return new Promise((resolve, reject) => {
            const Uuid = types.Uuid.random();
            let lastUuid: types.Uuid;
            const logg = Uuid + ' e: ' + heatdata.event * 100 + ' h: ' + heatdata.heat
            logger.info(logg.toString());

            const params2 = [wkid, Uuid]

            this.getLastID()
                .then(result => {
                    lastUuid = result;
                    return this.insertNewHeatID(heatdata, Uuid, result)
                })
                .then(() => client.execute(insertheatid, params2, { prepare: true }))
                .then(() => this.updateLastHeatID(lastUuid, Uuid))
                .then(() => resolve({ 'uuid': Uuid }))
                .catch(reason => reject({ 'uuid': Uuid, 'reason': reason }))
        })
    }

    private async getLastID(): Promise<types.Uuid> {
        const params = [wkid]
        return new Promise((resolve, reject) => {

            client.execute(selectlastheatid, params, { prepare: true })
                .then(rs => {
                    const row = rs.first();
                    const heatid = row.get(0);
                    return resolve(heatid)
                })
                .catch(reason => {
                    return reject(reason.toString())
                })

        })
    }

    private async insertNewHeatID(heatdata: IHeat, newUuid: types.Uuid, lastUuid: string | types.Uuid): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, heatdata.name, heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
            client.execute(insertheatquery, params, { prepare: true })
                .then(rs => {
                    resolve()
                })
                .catch(reason => {
                    reject(reason.toString())
                })

        })
    }

    private async updateLastHeatID(updateUuid: types.Uuid, nextUuid: types.Uuid): Promise<string> {
        return new Promise((resolve, reject) => {
            const params = [nextUuid, updateUuid];
            client.execute(updateheatid, params, { prepare: true })
                .then(rs => {
                    resolve()
                })
                .catch(reason => {
                    reject(reason.toString())
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
