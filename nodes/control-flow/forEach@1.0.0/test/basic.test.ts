import ForEach from '../index';

describe('ForEach Node', () => {
    it('should process array items sequentially', async () => {
        const forEach = new ForEach();
        const result = await forEach.handle({}, {
            collection: [1, 2, 3],
            steps: [
                { name: 'test', node: 'test-node' }
            ],
            execution: 'sequential'
        });
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(3);
        expect(result[0]).toHaveProperty('step', 'test');
        expect(result[0]).toHaveProperty('status', 'processed');
    });

    it('should handle object collections', async () => {
        const forEach = new ForEach();
        const result = await forEach.handle({}, {
            collection: { a: 1, b: 2 },
            steps: [
                { name: 'test', node: 'test-node' }
            ]
        });
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(2);
    });

    it('should handle parallel execution', async () => {
        const forEach = new ForEach();
        const result = await forEach.handle({}, {
            collection: [1, 2, 3, 4, 5],
            steps: [
                { name: 'test', node: 'test-node' }
            ],
            execution: 'parallel',
            concurrency: 2
        });
        
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(5);
    });

    it('should handle error conditions', async () => {
        const forEach = new ForEach();
        let errorThrown = false;
        try {
            // Use type assertion to test invalid input
            await forEach.handle({}, {
                collection: null as unknown as any[],
                steps: [
                    { name: 'test', node: 'test-node' }
                ]
            });
        } catch (error) {
            errorThrown = true;
        }
        expect(errorThrown).toBe(true);
    });
});
