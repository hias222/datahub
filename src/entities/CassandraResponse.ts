export interface ICassandraResponse {
    answer?: string;
    uuid: string;
    error?: string;
}

class CassandraResponse implements ICassandraResponse {

    public answer?: string;
    public uuid: string;
    public error?: string;

    constructor(uuid: string) {
        this.uuid = uuid
    }

    async errorMessage(reason: any){
        this.error = reason;
        this.answer = 'failure';
        return this;
    }

    async successMessage(){
        this.answer = 'success';
        return this;
    }
}

export default CassandraResponse;