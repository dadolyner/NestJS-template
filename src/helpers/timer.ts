class DadoTimer {
    startTime: number
    constructor() { this.startTime = 0 }

    private getTime(timeMS: number) {
        if (timeMS > 1000) return `${timeMS / 1000} S`
        if (timeMS > (1000 * 60)) return `${timeMS} M`
        if (timeMS > (1000 * 60 * 60)) return `${timeMS} H`
        return `${timeMS} MS`
    }

    public start() { this.startTime = performance.now() }
    public end() { return this.getTime(Math.ceil(performance.now() - this.startTime)) }
}
export default DadoTimer