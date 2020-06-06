export interface IHeat {
    event: number;
    heat: number;
    data: string;
}

class Heat implements IHeat {

    public event: number;
    public heat: number;
    public data: string;

    constructor(event: number , heat: number, data: string) {
        this.event = event
        this.heat = heat
        this.data = data
    }
}

export default Heat;
