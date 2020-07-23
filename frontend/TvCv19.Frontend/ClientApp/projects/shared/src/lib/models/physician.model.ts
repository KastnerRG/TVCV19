export class PhysicianModel {
    id: string;
    name: string;
    location: string;
    supervisorId: string;
    hierarchy: HierarchyLevel;
    roles: Roles;
}
export enum HierarchyLevel {
    FirstLine = 1, SecondLine = 2 , Commander = 3, 
}

// changes the 3 from physician.hierarchy to display as "Commander" etc.
export enum Roles {
    "Bedside Caregiver" = 1, "Physician" = 2, "Commander" = 3,
}
