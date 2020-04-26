export class PhysicianModel {
    id: string;
    name: string;
    location: string;
    supervisorId: string;
    hierarchy: HierarchyLevel;
}

export enum HierarchyLevel {
    FirstLine, SecondLine, Commander
}