import Shell from './shell';

class OutputBuffer {
    constructor () {
        this.buffer = [];
    }

    clear () {
        this.buffer.length = 0;
    }

    write = line => this.buffer.push(line);
}

describe("builtins", () => {
    test("range", async () => {
        const shell = new Shell();
        const outputBuffer = new OutputBuffer();

        await shell.execute("range 4 9 2", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([4, 6, 8]);

        outputBuffer.clear();

        await shell.execute("range 4 9 3", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([4, 7]);

        outputBuffer.clear();

        await shell.execute("range 3 9 3", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([3, 6]);

        outputBuffer.clear();

        await shell.execute("range 0 9 3", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([0, 3, 6]);

        outputBuffer.clear();

        await shell.execute("range 9 3", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([9, 8, 7, 6, 5, 4]);

        outputBuffer.clear();

        await shell.execute("range 9 3 2", outputBuffer.write);
        expect(outputBuffer.buffer).toEqual([9, 7, 5]);
    });
});