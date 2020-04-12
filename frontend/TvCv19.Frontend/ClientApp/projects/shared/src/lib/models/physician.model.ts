export class PhysicianModel {
    id: string;
    name: string;
    location: string;
    supervisorId: string;
    hierarchyLevel: HierarchyLevel;
    messages: Array<string>
}

export enum HierarchyLevel {
    FirstLine, SecondLine, Commander
}