export interface ILane {
    athleteid: string,
    birthdate?: string,
    firstname?: string,
    lastname?: string,
    lane?: string,
    entrytime?: string,
    name?: string,
    code?: string,
    place?: string,
    finishtime?: string
}


export interface IHeat {
    event: number;
    heat: number;
    swimstyle?: string;
    name?: string;
    competition?: string,
    lanes?: [ILane],
    distance?: string,
    gender?: string,
    relaycount?: string,
    round?: string
}

class Heat implements IHeat {

    public event: number;
    public heat: number;
    public swimstyle: string;

    constructor(event: number, heat: number, data: string) {
        this.event = event
        this.heat = heat
        this.swimstyle = data
    }
}

export default Heat;
