const repositories = require('../../repositories')
const _ = require('lodash');

module.exports = class BaseController {
    constructor() {
        this._adminRepository = new repositories.AdminRepository();
        this._userRepository = new repositories.UserRepository();
        this._tripRepository = new repositories.TripRepository();
        this._activityRepository = new repositories.ActivityRepository();
        this._amenityRepository = new repositories.AmenityRepository();
        this._roleRepository = new repositories.RoleRepository();
        this._permissionRepository = new repositories.PermissionRepository();
    }

    getRepository(name) {
        if (repositories[name]) {
            return new repositories[name];
        }

        throw new Error('Repository not found.')
    }
}
