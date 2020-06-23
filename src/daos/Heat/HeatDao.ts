import '../../LoadEnv';

import { IHeat } from '../../entities/Heat';
import { Client, types } from 'cassandra-driver';

import Logger from '../../shared/Logger';
import logger from '../../shared/Logger';

const CONTACTPOINT = process.env.CONTACTPOINT !== undefined ? process.env.CONTACTPOINT : 'localhost'
const CASSANDRA_USER = process.env.CASSANDRA_USER !== undefined ? process.env.CASSANDRA_USER : 'localhost'
const CASSANDRA_PASSWORD = process.env.CASSANDRA_PASSWORD !== undefined ? process.env.CASSANDRA_PASSWORD : 'localhost'

const useroptions = {
    username: CASSANDRA_USER,
    password: CASSANDRA_PASSWORD
}
const connectoptions = {
    contactPoints: [CONTACTPOINT],
    localDataCenter: process.env.LOCALDATACENTER,
    keyspace: process.env.KEYSPACE,
    credentials: useroptions
}

const sslconnect = {
    contactPoints: [CONTACTPOINT],
    localDataCenter: process.env.LOCALDATACENTER,
    keyspace: process.env.KEYSPACE,
    credentials: useroptions,
    sslOptions: {
        rejectUnauthorized: false
    }
}

const conn = process.env.SSLCONNECT === 'true' ? sslconnect : connectoptions
logger.info(JSON.stringify(conn))

const client = new Client(conn);

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

const searchHeatId = 'SELECT JSON * FROM colorado.heatdata where heatid = ?'

export interface IHeatDao {
    getOne: (email: string) => Promise<IHeat | null>;
    getAll: () => Promise<IHeat[]>;
    search: (id: string) => Promise<IHeat[]>;
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
        return new Promise((resolve, reject) => {
            this.getLastID().then((lastid) => {
                const params = [lastid]
                return client.execute(searchHeatId, params, { prepare: true })
            })
                .then((rs) => {
                    if (rs.rowLength === 0) {
                        logger.error('no rows')
                        return reject({ 'error': 'no data' })
                    } else {
                        const row = rs.first();
                        const heatdata = row.get(0);
                        const jsondata = JSON.parse(heatdata)
                        return resolve(jsondata);
                    }
                })
                .catch((data) => reject(data))
        })
    }

    /**
     *
     */
    public async search(id: string): Promise<IHeat[]> {
        // await client.connect();
        return new Promise((resolve, reject) => {
            Logger.info('search Lane data: ' + id)


            const params = [id]
            client.execute(searchHeatId, params, { prepare: true })
                .then((rs) => {
                    if (rs.rowLength === 0) {
                        logger.error('no rows')
                        return reject({ 'error': 'no data' })
                    } else {
                        const row = rs.first();
                        const heatdata = row.get(0);
                        const jsondata = JSON.parse(heatdata)
                        return resolve(jsondata);
                    }
                })
                .catch((data) => reject(data))

        })
    }


    /**
     *
     * @param user
     */
    public async add(heatdata: IHeat): Promise<any> {
        return new Promise((resolve, reject) => {
            const Uuid = types.Uuid.random();
            let lastUuid: types.Uuid;
            const logg = Uuid + ' e: ' + heatdata.event + ' h: ' + heatdata.heat
            logger.info(logg.toString());
            logger.info(JSON.stringify(heatdata));

            const params2 = [wkid, Uuid]

            this.getLastID()
                .then(result => {
                    lastUuid = result;
                    logger.info('last id ' + result + ' new ' + Uuid);
                    return this.insertNewHeatID(heatdata, Uuid, result)
                })
                .then(() => {
                    logger.info('insertheatid ' + wkid + ' ' + Uuid);
                    return client.execute(insertheatid, params2, { prepare: true })
                })
                .then(() => {
                    logger.info('update last heat ' + lastUuid)
                    this.updateLastHeatID(lastUuid, Uuid)
                })
                .then(() => resolve({ 'uuid': Uuid }))
                .catch(reason => {
                    logger.error('failure in add heat')
                    return reject({ 'uuid': Uuid, 'reason': reason })
                })
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
            // const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, 'heatdata.name', heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
            this.lanesdata(heatdata.lanes)
                .then((lanes) => {
                    logger.info('ready ' + JSON.stringify(lanes))
                    const params = [newUuid, lastUuid, heatdata.event, heatdata.heat, heatdata.lanes, heatdata.name, heatdata.swimstyle, heatdata.competition, heatdata.distance, heatdata.gender, heatdata.relaycount, heatdata.round];
                    // const params = [newUuid, lastUuid, lanes]
                    return params
                })
                .then((params) => {
                    logger.info('execute with ')
                    logger.info(params)
                    return client.execute(insertheatquery, params, { prepare: true })
                })
                .then(rs => {
                    logger.info('insert heat successfull')
                    // logger.info(params)
                    resolve()
                })
                .catch((reason) => {
                    logger.error('failed insert heat error ' + reason)
                    reject(reason.toString())
                })
        })
    }

    private async lanesdata(lanes: any) {
        return new Promise((resolve, reject) => {
            // const entries = Object.entries(lanes)
            for (const lane in lanes) {
                if (lane) {
                    // correct missing params
                    if (lanes[lane].athleteid === undefined) lanes[lane].athleteid = 'NN'
                    if (lanes[lane].birthdate === undefined) lanes[lane].birthdate = '2000-01-01'
                    if (lanes[lane].firstname === undefined) lanes[lane].firstname = 'NN'
                    if (lanes[lane].lastname === undefined) lanes[lane].lastname = 'NN'
                    if (lanes[lane].entrytime === undefined) lanes[lane].entrytime = '00:00:00.00'
                    if (lanes[lane].name === undefined) lanes[lane].name = 'NN'
                    if (lanes[lane].code === undefined) lanes[lane].code = '0000'
                    if (lanes[lane].type === undefined) lanes[lane].type = 'lane'
                    if (lanes[lane].event === undefined) lanes[lane].event = '0'
                    if (lanes[lane].place === undefined) lanes[lane].place = '0'
                    if (lanes[lane].finishtime === undefined) lanes[lane].finishtime = '00:00,00'
                    if (lanes[lane].heat === undefined) lanes[lane].heat = '0'
                }
            }
            // logger.log(lanes)
            return resolve(lanes)
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
