import chalk from "chalk";
import { Box, Text, render, useInput } from "ink";
import type React from "react";
import { useEffect, useState } from "react";

type SortBy = "time" | "memory" | "cpu" | "errors" | "requests";

type NodeMetrics = {
	name: string;
	timeMs: number;
	memoryMb: number;
	cpuPct: number;
	errors: number;
};

type WorkflowMetrics = {
	workflow: string;
	totalTimeMs: number;
	totalMemoryMb: number;
	totalCpuPct: number;
	errors: number;
	requests: number;
	nodes: NodeMetrics[];
};

type WorkflowNumberKeys = Exclude<keyof WorkflowMetrics, "workflow" | "nodes">;
type NodeNumberKeys = Exclude<keyof NodeMetrics, "name">;

type PrometheusMetricResult = {
	metric: Record<string, string>; // e.g., { workflow: "sync-users", node: "fetch-db" }
	value: [number, string]; // timestamp and stringified number
};

const PROM_URL = "http://localhost:9090/api/v1/query";

const queryPrometheus = async (query: string) => {
	const res = await fetch(`${PROM_URL}?query=${encodeURIComponent(query)}`);
	const data = await res.json();
	return data.data.result || [];
};

const fetchPrometheusMetrics = async (): Promise<WorkflowMetrics[]> => {
	const [wfTime, wfMem, wfCPU, wfErrors, wfReqs] = await Promise.all([
		queryPrometheus("sum by (workflow_name) (rate(workflow_time[1m]))"),
		queryPrometheus("max by (workflow_name) (workflow_memory)"),
		queryPrometheus("avg by (workflow_name) (workflow_cpu)"),
		queryPrometheus("increase(workflow_errors_total[5m])"),
		queryPrometheus("increase(workflow_total[5m])"),
	]);

	const wfMap: Record<string, WorkflowMetrics> = {};

	const mapWorkflow = (list: PrometheusMetricResult[], key: WorkflowNumberKeys, convert: (val: string) => number) => {
		for (const entry of list) {
			const name = entry.metric.workflow;
			if (!name) continue;
			if (!wfMap[name])
				wfMap[name] = {
					workflow: name,
					totalTimeMs: 0,
					totalMemoryMb: 0,
					totalCpuPct: 0,
					errors: 0,
					requests: 0,
					nodes: [],
				};
			wfMap[name][key] = convert(entry.value[1]);
		}
	};

	mapWorkflow(wfTime, "totalTimeMs", (v) => +v * 1000);
	mapWorkflow(wfMem, "totalMemoryMb", (v) => +v / 1024 / 1024);
	mapWorkflow(wfCPU, "totalCpuPct", (v) => +v);
	mapWorkflow(wfErrors, "errors", (v) => Math.round(+v));
	mapWorkflow(wfReqs, "requests", (v) => Math.round(+v));

	const nodeMetricsRaw = await Promise.all([
		queryPrometheus("avg by (workflow, node) (rate(node_execution_duration_seconds_sum[1m]))"),
		queryPrometheus("avg by (workflow, node) (node_memory_usage_bytes)"),
		queryPrometheus("avg by (workflow, node) (node_cpu_usage_percent)"),
		queryPrometheus("increase(node_errors_total[5m])"),
	]);

	const nodeMap: Record<string, Record<string, Partial<NodeMetrics>>> = {};

	const setNodeMetric = (list: PrometheusMetricResult[], key: NodeNumberKeys, convert: (val: string) => number) => {
		for (const entry of list) {
			const wf = entry.metric.workflow;
			const node = entry.metric.node;
			if (!wf || !node) continue;

			if (!nodeMap[wf]) nodeMap[wf] = {};
			if (!nodeMap[wf][node]) nodeMap[wf][node] = { name: node };
			nodeMap[wf][node][key] = convert(entry.value[1]);
		}
	};

	setNodeMetric(nodeMetricsRaw[0], "timeMs", (v) => +v * 1000);
	setNodeMetric(nodeMetricsRaw[1], "memoryMb", (v) => +v / 1024 / 1024);
	setNodeMetric(nodeMetricsRaw[2], "cpuPct", (v) => +v);
	setNodeMetric(nodeMetricsRaw[3], "errors", (v) => Math.round(+v));

	for (const wf of Object.keys(nodeMap)) {
		const wfObj = wfMap[wf];
		if (!wfObj) continue;
		const nodes = Object.values(nodeMap[wf]) as NodeMetrics[];
		wfObj.nodes = nodes;
	}

	return Object.values(wfMap);
};

const Monitor: React.FC = () => {
	const [workflows, setWorkflows] = useState<WorkflowMetrics[]>([]);
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
	const [sortBy, setSortBy] = useState<SortBy>("time");

	useEffect(() => {
		const fetch = async () => {
			const result = await fetchPrometheusMetrics();
			setWorkflows(result);
			setLastUpdate(new Date());
		};

		fetch();
		const interval = setInterval(fetch, 3000);
		return () => clearInterval(interval);
	}, []);

	useInput((input) => {
		if (input === "w") setSortBy("time");
		else if (input === "m") setSortBy("memory");
		else if (input === "c") setSortBy("cpu");
		else if (input === "e") setSortBy("errors");
		else if (input === "r") setSortBy("requests");
		else if (input === "q") process.exit(0);
	});

	const sorted = [...workflows].sort((a, b) => {
		if (sortBy === "time") return b.totalTimeMs - a.totalTimeMs;
		if (sortBy === "memory") return b.totalMemoryMb - a.totalMemoryMb;
		if (sortBy === "cpu") return b.totalCpuPct - a.totalCpuPct;
		if (sortBy === "errors") return b.errors - a.errors;
		if (sortBy === "requests") return b.requests - a.requests;
		return 0;
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold>{chalk.cyan(`nanoservice monitor — Last update: ${lastUpdate.toLocaleTimeString()}`)}</Text>
			<Text dimColor>
				{`[w] Time  [m] Memory  [c] CPU  [r] Requests  [e] Errors  [q] Quit | Sorting by: ${sortBy}`}
			</Text>
			{sorted.map((wf) => (
				<Box key={wf.workflow} flexDirection="column" marginTop={1}>
					<Text bold>{`Workflow: ${wf.workflow} | Time: ${wf.totalTimeMs.toFixed(
						0,
					)}ms | RAM: ${wf.totalMemoryMb.toFixed(1)}MB | CPU: ${wf.totalCpuPct.toFixed(1)}% | Requests: ${
						wf.requests
					} | Errors: ${wf.errors}`}</Text>
					<Text>{chalk.gray("  Node         │ Time   │ Mem(MB) │ CPU(%) │ Errors")}</Text>
					<Text>{chalk.gray("  ─────────────┼────────┼─────────┼────────┼────────")}</Text>
					{wf.nodes.map((node) => (
						<Text key={node.name}>
							{`  ${chalk.bold(node.name.padEnd(13))}│ 
							${node.timeMs.toFixed(0).padEnd(7)}│ 
							${node.memoryMb.toFixed(1).padEnd(8)}│ 
							${node.cpuPct.toFixed(1).padEnd(7)}│ 
							${node.errors > 0 ? chalk.red(`  ${node.errors}`) : chalk.green("   0")}`}
						</Text>
					))}
				</Box>
			))}
		</Box>
	);
};

export const runMonitor = () => {
	render(<Monitor />);
};
