import chalk from "chalk";
import { Box, Text, render, useInput } from "ink";
import type React from "react";
import { useEffect, useState } from "react";

type SortBy = "time" | "memory" | "cpu" | "errors" | "requests";

type NodeMetrics = {
	name: string;
	requests: number;
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
	metric: Record<string, string>;
	value: [number, string];
};

const PROM_URL = "http://localhost:9090/api/v1/query";

const fmt = (val: number | undefined, decimals = 1) => {
	let valNew = (val ?? 0).toFixed(decimals);
	if (valNew.toString() === "NaN") {
		valNew = "0";
	}

	return valNew;
};

const queryPrometheus = async (query: string, host?: string, token?: string) => {
	const REMOTE_PROM_URL = host ? `${host}/api/v1/query` : undefined;
	const res = token
		? await fetch(`${REMOTE_PROM_URL || PROM_URL}?query=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
					"Accept-Encoding": "identity",
				},
			})
		: await fetch(`${REMOTE_PROM_URL || PROM_URL}?query=${encodeURIComponent(query)}`);

	if (!res.ok) {
		console.log("Failed to fetch metrics:", res.statusText, res.status);
		return [];
	}

	const data = await res.json();
	return data.data.result || [];
};

const fetchPrometheusMetrics = async (host?: string, token?: string): Promise<WorkflowMetrics[]> => {
	const [wfReqs, wfTime, wfErrors, wfCPU, wfMem] = await Promise.all([
		queryPrometheus("(sum(increase(workflow_total[1m])) by (workflow_path)) > 0", host, token), // requests
		queryPrometheus("sum(increase(workflow_time[1m])) by (workflow_path)", host, token), // time
		queryPrometheus("(sum(increase(workflow_errors_total[1m])) by (workflow_path)) > 0", host, token), // errors
		queryPrometheus("sum(increase(workflow_cpu[1m])) by (workflow_path)", host, token), // CPU
		queryPrometheus("sum(increase(workflow_memory[1m])) by (workflow_path)", host, token), // memory
	]);

	const wfMap: Record<string, WorkflowMetrics> = {};

	const mapWorkflow = (list: PrometheusMetricResult[], key: WorkflowNumberKeys, convert: (val: string) => number) => {
		for (const entry of list) {
			const name = entry.metric.workflow_path;
			if (!name) continue;
			if (!wfMap[name]) {
				wfMap[name] = {
					workflow: name,
					totalTimeMs: 0,
					totalMemoryMb: 0,
					totalCpuPct: 0,
					errors: 0,
					requests: 0,
					nodes: [],
				};
			}
			wfMap[name][key] = convert(entry.value?.[1] ?? "0");
		}
	};

	mapWorkflow(wfTime, "totalTimeMs", (v) => +v);
	mapWorkflow(wfMem, "totalMemoryMb", (v) => +v);
	mapWorkflow(wfCPU, "totalCpuPct", (v) => +v);
	mapWorkflow(wfErrors, "errors", (v) => Math.round(+v));
	mapWorkflow(wfReqs, "requests", (v) => Math.round(+v));

	const nodeMetricsRaw = await Promise.all([
		queryPrometheus("(sum(increase(node_total[1m])) by (node_name, workflow_path)) > 0", host, token),
		queryPrometheus("sum(increase(node_time[1m])) by (node_name, workflow_path)", host, token),
		queryPrometheus("(sum(increase(node_errors_total[1m])) by (node_name, workflow_path)) > 0", host, token),
		queryPrometheus("sum(increase(node_cpu[1m])) by (node_name, workflow_path)", host, token),
		queryPrometheus("sum(increase(node_memory[1m])) by (node_name, workflow_path)", host, token),
	]);

	const nodeMap: Record<string, Record<string, Partial<NodeMetrics>>> = {};

	const setNodeMetric = (list: PrometheusMetricResult[], key: NodeNumberKeys, convert: (val: string) => number) => {
		for (const entry of list) {
			const wf = entry.metric.workflow_path;
			const node = entry.metric.node_name;
			if (!wf || !node) continue;

			if (!nodeMap[wf]) nodeMap[wf] = {};
			if (!nodeMap[wf][node]) nodeMap[wf][node] = { name: node };

			const raw = Number.parseFloat(entry.value?.[1] ?? "0");
			nodeMap[wf][node][key] = convert(raw.toString());
		}
	};

	setNodeMetric(nodeMetricsRaw[0], "requests", (v) => +v);
	setNodeMetric(nodeMetricsRaw[1], "timeMs", (v) => +v);
	setNodeMetric(nodeMetricsRaw[4], "memoryMb", (v) => +v);
	setNodeMetric(nodeMetricsRaw[3], "cpuPct", (v) => +v);
	setNodeMetric(nodeMetricsRaw[2], "errors", (v) => Math.round(+v));

	for (const wf of Object.keys(nodeMap)) {
		const wfObj = wfMap[wf];
		if (!wfObj) continue;
		const nodes = Object.values(nodeMap[wf]) as NodeMetrics[];
		wfObj.nodes = nodes;
	}

	return Object.values(wfMap);
};

const Monitor: React.FC<{ host?: string; token?: string }> = ({ host, token }) => {
	const [workflows, setWorkflows] = useState<WorkflowMetrics[]>([]);
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
	const [sortBy, setSortBy] = useState<SortBy>("time");

	useEffect(() => {
		const fetch = async () => {
			const result = await fetchPrometheusMetrics(host, token);
			setWorkflows(result);
			setLastUpdate(new Date());
		};

		fetch();
		const interval = setInterval(fetch, 3000);
		return () => clearInterval(interval);
	}, [host, token]);

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
			<Text bold>{chalk.cyan(`Monitor — Last update: ${lastUpdate.toLocaleTimeString()}`)}</Text>
			<Text dimColor>
				{`[w] Time  [m] Memory  [c] CPU  [r] Requests  [e] Errors  [q] Quit | Sorting by: ${sortBy}`}
			</Text>
			{sorted.map((wf) => (
				<Box key={wf.workflow} flexDirection="column" marginTop={1}>
					<Text bold>
						{`Workflow: ${wf.workflow} | Time: ${fmt(
							wf.totalTimeMs,
							0,
						)}ms | RAM: ${fmt(wf.totalMemoryMb)}MB | CPU: ${fmt(
							wf.totalCpuPct,
						)}% | Requests: ${fmt(wf.requests, 2)} | Errors: ${fmt(wf.errors, 2)}`}
					</Text>
					<Box flexDirection="column" paddingLeft={2}>
						<Text>{chalk.bold(`📦 Workflow: ${wf.workflow}`)}</Text>
						<Text dimColor>
							{`  Requests: ${fmt(wf.requests, 2)}   Errors: ${fmt(
								wf.errors,
								2,
							)}   Time: ${fmt(wf.totalTimeMs, 0)}ms   CPU: ${fmt(wf.totalCpuPct)}%   RAM: ${fmt(wf.totalMemoryMb)}MB`}
						</Text>
						{wf.nodes.length > 0 ? (
							<>
								<Text>
									{chalk.gray("  ┌──────────────────────┬───────────┬───────────┬──────────┬────────┬─────────┐")}
								</Text>
								<Text>
									{chalk.gray("  │ Node                 │ Requests  │ Time(ms)  │ Mem(MB)  │ CPU(%) │ Errors  │")}
								</Text>
								<Text>
									{chalk.gray("  ├──────────────────────┼───────────┼───────────┼──────────┼────────┼─────────┤")}
								</Text>
								{wf.nodes.map((node) => (
									<Text key={node.name}>
										{`  │ ${node.name.padEnd(20)} │ ${fmt(node.requests, 0).padStart(9)} | ${fmt(
											node.timeMs,
											0,
										).padStart(9)} │ ${fmt(node.memoryMb).padStart(8)} │ ${fmt(node.cpuPct).padStart(6)} │ ${
											(node.errors ?? 0) > 0
												? chalk.red((node.errors ?? 0).toString().padStart(7))
												: chalk.green("      0")
										} │`}
									</Text>
								))}
								<Text>
									{chalk.gray("  └──────────────────────┴───────────┴───────────┴──────────┴────────┴─────────┘")}
								</Text>
							</>
						) : (
							<Text dimColor> (No nodes)</Text>
						)}
					</Box>
				</Box>
			))}
		</Box>
	);
};

export const runMonitor = (host?: string, token?: string) => {
	render(<Monitor host={host} token={token} />);
};
