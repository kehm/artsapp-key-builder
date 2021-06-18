import { createContext } from 'react';

/**
 * Signed in user context
 */
export default createContext({
    authenticated: false,
    name: undefined,
    organizationId: undefined,
    roleId: undefined,
    workgroups: [],
    permissions: [],
    setUser: () => { },
});
