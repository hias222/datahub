import '../../LoadEnv';

import { IHeat } from '../../entities/Heat';
import { Client, types } from 'cassandra-driver';

import logger from '../../shared/Logger';

var debug = process.env.DEBUG === 'true' ? true : false;

// import { connect } from 'http2';

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

const selectlastheatid = 'SELECT heatid, creation_date, wkid \
        FROM colorado.heatids \
        where wkid= ? \
        LIMIT 10';

const searchHeatId = 'SELECT heatid, lastid, nextid, event, heat, \
    creation_date, lanes, name, swimstyle, competition, distance, \
    gender, relaycount, round FROM colorado.heatdata where heatid = ? LIMIT 10';


export interface IHeatDao {
    getOne: (email: string) => Promise<IHeat | null>;
    getAll: () => Promise<any>;
    search: (id: string) => Promise<any>;
    update: (user: IHeat) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class HeatDao implements IHeatDao {

    constructor() {
        client.connect()
            .then(() => logger.info('connected'))
            .catch((data) => logger.error(data))
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
     *  public async getAll(): Promise<types.Row> {
     */
    public async getAll(): Promise<any> {
        return new Promise((resolve, reject) => {
            client.connect()
                .then(() =>
                    this.getLastID())
                .then((lastid) => {
                    const params = [lastid]
                    logger.info('search for ' + lastid)
                    return client.execute(searchHeatId, params, { prepare: true })
                })
                .then((rs) => {
                    if (rs.rowLength === 0) {
                        logger.error('no rows')
                        return reject({ 'error': 'no data' })
                    } else {
                        const row = rs.first();
                        // logger.info(JSON.stringify(row))
                        logger.info('return data getALL()')
                        return row
                        // return resolve(row);
                    }
                })
                .then((data) => this.clearlanesdata(data))
                .then((rs) => resolve(rs))
                .catch((data) => {
                    logger.error(data.name)
                    return reject(data)
                })
        })
    }

    /**
     *
     */
    public async search(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            logger.info('search Lane data: ' + id)
            const params = [id]
            client.connect()
                .then(() =>
                    client.execute(searchHeatId, params, { prepare: true }))
                .then((rs: any) => {
                    if (rs.rowLength === 0) {
                        logger.error('no rows')
                        return reject({ 'error': 'no data' })
                    } else {
                        const row = rs.first();
                        return row
                    }
                })
                .then((data) => this.clearlanesdata(data))
                .then((rs) => resolve(rs))
                .catch((data: any) => reject(data))
        })
    }

    private async getLastID(): Promise<types.Uuid> {
        const params = [wkid]
        return new Promise((resolve, reject) => {
            client.execute(selectlastheatid, params, { prepare: true })
                .then((rs: any) => {
                    const row = rs.first();
                    const heatid = row.get(0);
                    return resolve(heatid)
                })
                .catch((reason: any) => {
                    return reject(reason.toString())
                })

        })
    }

    private async clearlanesdata(row: any) {
        return new Promise((resolve, reject) => {
            // const entries = Object.entries(lanes)
            for (const lane in row.lanes) {
                if (debug) logger.info(lane)
                if (debug) logger.info(row.lanes[lane])
                var jsonlane = JSON.parse(row.lanes[lane])
                if (lane) {
                    // correct missing params
                    if (jsonlane.athleteid === 'NaN') jsonlane.athleteid = ''
                    if (jsonlane.birthdate === '0000-00-00') jsonlane.birthdate = ''
                    if (jsonlane.firstname === 'NaN') jsonlane.firstname = ''
                    if (jsonlane.lastname === 'NaN') jsonlane.lastname = 'keine Belegung'
                    if (jsonlane.entrytime === '00:00:00.00') jsonlane.entrytime = 'NT'
                    if (jsonlane.name === 'NaN') jsonlane.name = ''
                    if (jsonlane.code === '0000') jsonlane.code = ''
                    if (jsonlane.finishtime === '00:00,00') jsonlane.finishtime = 'NT'
                }
                row.lanes[lane] = jsonlane
            }
            return resolve(row)
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
