export interface PhysicianModel {
    id?: number;
    name: string;
    location: string;
    supervisorId: number;
    hierarchy: HierarchyLevel;
    applicationLoginId: number;
}

export enum HierarchyLevel {
    FirstLine = 1, SecondLine = 2 , Commander = 3
}