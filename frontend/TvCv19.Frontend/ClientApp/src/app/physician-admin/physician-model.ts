export class PhysicianModel {
    id: string;
    name: string;
    location: string;
    reportId: string;
    hierarchyLevel: HierarchyLevel;
    messages: Array<string>
}

export enum HierarchyLevel {
    FirstLine, SecondLine, Commander
}