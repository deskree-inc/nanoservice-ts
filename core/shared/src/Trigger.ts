type TriggerType = {
	listen(): void;
};

export default abstract class Trigger implements TriggerType {
	abstract listen(): void;
}
