export interface PhysicianChecklistModel {
  id: string;
  name: string;
  checked: boolean;
  deleted: boolean;
  innerList: Array<PhysicianChecklistModel>;
  scheduleInterval: string;
}
