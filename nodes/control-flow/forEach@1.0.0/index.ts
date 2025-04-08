// Temporary types until we can resolve the module imports
type INanoServiceResponse = any;
type Context = any;
type NodeBase = any;
type ParamsDictionary = any;

class NanoService<T> {
    flow: boolean = false;
    contentType: string = "";
    async handle(ctx: Context, config: T): Promise<INanoServiceResponse | NodeBase[]> {
        throw new Error("Method not implemented");
    }
    protected async executeStep(ctx: Context, step: any): Promise<any> {
        throw new Error("Method not implemented");
    }
}

interface ForEachConfig {
    collection: any[] | Record<string, any>;
    steps: Array<{
        name: string;
        node: string;
        type?: string;
    }>;
    execution?: 'sequential' | 'parallel';
    concurrency?: number;
    errorHandling?: 'continue' | 'stop';
}

export default class ForEach extends NanoService<ForEachConfig> {
    constructor() {
        super();
        this.flow = true;
        this.contentType = "application/json";
    }

    async handle(ctx: Context, config: ForEachConfig): Promise<INanoServiceResponse | NodeBase[]> {
        const {
            collection,
            steps,
            execution = 'sequential',
            concurrency = 5,
            errorHandling = 'continue'
        } = config;

        if (!collection || (typeof collection !== 'object')) {
            throw new Error('Invalid collection provided');
        }

        type CollectionItem = { key: string | number, value: any };
        type ExecutionResult = { step: string, node: string, item: string | number, status: string };

        const items: CollectionItem[] = Array.isArray(collection) 
            ? collection.map((item, index) => ({ key: index, value: item }))
            : Object.entries(collection).map(([key, value]) => ({ key, value }));

        const results: ExecutionResult[] = [];
        const errors: Error[] = [];

        if (execution === 'sequential') {
            for (const item of items) {
                try {
                    const result = await this.executeSteps(ctx, steps, item);
                    results.push(result);
                } catch (error) {
                    errors.push(error);
                    if (errorHandling === 'stop') break;
                }
            }
        } else {
            // Parallel execution with limited concurrency
            const executing = new Set<Promise<any>>();
            
            for (const item of items) {
                if (executing.size >= concurrency) {
                    await Promise.race(executing);
                }

                const promise: Promise<void> = this.executeSteps(ctx, steps, item)
                    .then((result: ExecutionResult) => {
                        results.push(result);
                        executing.delete(promise);
                    })
                    .catch((error: Error) => {
                        errors.push(error);
                        executing.delete(promise);
                        if (errorHandling === 'stop') {
                            // Cancel remaining executions
                            throw error;
                        }
                    });

                executing.add(promise);
            }

            // Wait for all remaining promises
            await Promise.all(executing);
        }

        if (errors.length > 0) {
            console.warn(`forEach completed with ${errors.length} errors`);
        }

        return results as unknown as NodeBase[];
    }

    private async executeSteps(ctx: Context, steps: Array<{name: string, node: string, type?: string}>, item: {key: string | number, value: any}): Promise<any> {
        const newCtx = {
            ...ctx,
            item: item.value,
            itemKey: item.key,
            itemIndex: typeof item.key === 'number' ? item.key : undefined
        };

        // Execute each step in sequence
        let result: any;
        for (const step of steps) {
            try {
                // In a real implementation, this would execute the actual node
                result = {
                    step: step.name,
                    node: step.node,
                    item: item.key,
                    status: 'processed'
                };
            } catch (error) {
                console.error(`Error processing item ${item.key} in step ${step.name}:`, error);
                throw error;
            }
        }
        return result;
    }
}
