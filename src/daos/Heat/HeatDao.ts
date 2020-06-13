import { IHeat } from '../../entities/Heat';
import { Client } from 'cassandra-driver';

import Logger from '../../shared/Logger';
import logger from '../../shared/Logger';

const client = new Client({
    contactPoints: ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace: 'colorado'
});

const insertheatquery = 'INSERT INTO users (key, name, email, birthdate) VALUES (?, ?, ?)';

export interface IHeatDao {
    getOne: (email: string) => Promise<IHeat | null>;
    getAll: () => Promise<IHeat[]>;
    add: (user: IHeat) => Promise<string>;
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
        const rs = await client.execute('SELECT * FROM system.local');
        const row = rs.first();
        const rowname = row.get('cluster_name');
        Logger.info(`Connected to cluster: ${rowname}`)

        // await client.shutdown();
        return [] as any;
    }


    /**
     *
     * @param user
     */
    public async add(heatdata: IHeat): Promise<string> {
        return new Promise((resolve, reject) => {
            const logg = 'e: ' + heatdata.event + ' h: ' + heatdata.heat
            logger.info(logg.toString());

            const params = [heatdata];
            client.execute(insertheatquery, params, { prepare: true })
            .then(result => {
                Logger.info('success')
                resolve('done')
            })
            .catch(reason => {
                Logger.info(reason)
                reject(reason)
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
