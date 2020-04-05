export class PhysicianModel {
    id: string;
    name: string;
    location: string;
    caregiverId: string;
    hierarchyLevel: HierarchyLevel;
}

export enum HierarchyLevel {
    FirstLine,Commander
}
