
export class HydstraFilter {
    static readonly Total = new HydstraFilter(
        "All (Wet + Dry)",
        "both"
    );

    static readonly Average = new HydstraFilter(
        "Dry",
        "dry"
    );

    static readonly Maximum = new HydstraFilter(
        "Wet",
        "wet"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }
}
