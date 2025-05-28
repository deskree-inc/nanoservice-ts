import type Workflows from "./runner/types/Workflows";
import countriesFactsHelper from "./workflows/countries-cats-helper";
import countriesHelper from "./workflows/countries-helper";
import empty from "./workflows/empty";

const workflows: Workflows = {
	"countries-helper": countriesHelper,
	"countries-cats-helper": countriesFactsHelper,
	"empty-helper": empty,
};

export default workflows;
