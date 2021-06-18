/**
 * Check if user has the requested permissions in the workgroup
 *
 * @param {Object} user User context
 * @param {Array} permissions Permission names
 * @param {int} workgroupId Workgroup ID
 * @returns {boolean} True if permitted
 */
const isPermitted = (user, permissions, workgroupId) => {
    let permitted = true;
    if (workgroupId && !user.workgroups.includes(workgroupId)) permitted = false;
    if (permitted) {
        permissions.forEach((permission) => {
            if (!user.permissions.includes(permission)) permitted = false;
        });
    }
    return permitted;
};

export default isPermitted;
