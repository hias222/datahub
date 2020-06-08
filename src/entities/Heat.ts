export interface IHeat {
    event: number;
    heat: number;
    swimstyle: string;
    name?: string;
}

class Heat implements IHeat {

    public event: number;
    public heat: number;
    public swimstyle: string;

    constructor(event: number , heat: number, data: string) {
        this.event = event
        this.heat = heat
        this.swimstyle = data
    }
}

export default Heat;
