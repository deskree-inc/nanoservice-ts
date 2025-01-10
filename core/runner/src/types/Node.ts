import type Condition from "./Condition";
import type Conditions from "./Conditions";
import type Flow from "./Flow";
import type Mapper from "./Mapper";
import type Properties from "./Properties";
import type TryCatch from "./TryCatch";

type Node = {
	[key: string]: Flow | Properties | Conditions | Condition | Mapper | TryCatch;
};

export default Node;
