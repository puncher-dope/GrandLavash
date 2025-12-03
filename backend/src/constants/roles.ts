
export const roles = {
    ADMIN: 0,
    USER: 1
} as const;

export type RolesT = typeof roles;