import type Workflows from "./types/Workflows";
import countriesFactsHelper from "./workflows/countries-cats-helper";
import countriesHelper from "./workflows/countries-helper";

const workflows: Workflows = {
	"countries-helper": countriesHelper,
	"countries-cats-helper": countriesFactsHelper,
};

export default workflows;
