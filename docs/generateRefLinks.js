const fs = require("node:fs");
const path = require("node:path");

const MINT_JSON_PATH = path.join(__dirname, "../docs.json");
const DOCS_REF_PATH = path.join(__dirname, "../docs/ref");

function getMdxFiles(dir) {
	const results = {};
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			const subResults = getMdxFiles(filePath);
			for (const group of Object.keys(subResults)) {
				if (!results[group]) {
					results[group] = [];
				}
				results[group] = results[group].concat(subResults[group]);
			}
		} else if (stat.isFile() && file.endsWith(".mdx")) {
			const relativePath = path.relative(DOCS_REF_PATH, filePath).replace(/\\/g, "/");
			const fullPath = `/docs/ref/${relativePath}`.replace(/\.mdx$/, "");
			const parts = relativePath.split("/");

			if (parts.length === 1) {
				results[relativePath] = fullPath;
			} else {
				const group = parts[0];
				if (!results[group]) {
					results[group] = [];
				}
				results[group].push(fullPath);
			}

			// Process internal links inside the file
			let fileContent = fs.readFileSync(filePath, "utf8");
			fileContent = fileContent.replace(/https:\/\/rp([^\s)]+)\.mdx/g, "/docs/ref$1");
			fs.writeFileSync(filePath, fileContent, "utf8");
		}
	}

	return results;
}

function updateMintJson() {
	if (!fs.existsSync(MINT_JSON_PATH)) {
		console.error("docs.json file not found.");
		return;
	}

	const groupedFiles = getMdxFiles(DOCS_REF_PATH);
	const mintConfig = JSON.parse(fs.readFileSync(MINT_JSON_PATH, "utf8"));

	if (!mintConfig.navigation.tabs) {
		console.error("No 'navigation.tabs' key found in docs.json.");
		return;
	}

	const referencesGroup = mintConfig.navigation.tabs.find((nav) => nav.tab === "References");
	if (!referencesGroup) {
		console.error("No 'References' group found in docs.json navigation.");
		return;
	}

	referencesGroup.groups[0].pages = Object.keys(groupedFiles).map((group) => {
		if (typeof groupedFiles[group] === "string") {
			return groupedFiles[group];
		}
		return {
			group: group.charAt(0).toUpperCase() + group.slice(1),
			pages: groupedFiles[group],
		};
	});

	fs.writeFileSync(MINT_JSON_PATH, JSON.stringify(mintConfig, null, 2));
	console.log("docs.json updated successfully.");
}

updateMintJson();
