const ACCESS_KEY = 'missiontrack_access_token';
const REFRESH_KEY = 'missiontrack_refresh_token';

export const tokenStorage = {
  get access() {
    return localStorage.getItem(ACCESS_KEY) || null;
  },
  set access(token: string | null) {
    if (token) {
      localStorage.setItem(ACCESS_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY) || null;
  },
  set refresh(token: string | null) {
    if (token) {
      localStorage.setItem(REFRESH_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_KEY);
    }
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};

