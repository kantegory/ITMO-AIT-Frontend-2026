import { emptyListOnForbidden } from '@/api/helpers'

class ProfilesApi {
  constructor(instance) {
    this.API = instance
  }

  getMy = async (userId) => {
    return this.API({
      url: '/600/profiles',
      params: { userId },
    }).catch(emptyListOnForbidden)
  }
}

export default ProfilesApi
