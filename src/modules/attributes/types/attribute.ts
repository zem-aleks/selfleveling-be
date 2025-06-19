export type AttributeId =
  | 'health'
  | 'strength'
  | 'intelligence'
  | 'agility'
  | 'charisma'
  | 'resilience'
  | 'discipline';

export type Attribute = {
  id: AttributeId;
  name: string;
  description: string;
  icon: string;
};
