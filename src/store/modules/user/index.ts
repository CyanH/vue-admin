import { defineStore } from 'pinia';
import { login as userLogin, getInfo as getUserInfo, logOut as userLogOut, LoginData } from '@/api/login'
import { setToken, clearToken } from '@/utils/auth';
import { UserState } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // 登录
    async login(loginForm: LoginData) {
      try {
        const res: any = await userLogin(loginForm);
        setToken(res.token);
        this.setUserInfo(res.user)
        this.loadMenus = true
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 获取用户信息
    async getInfo() {
      const res = await getUserInfo()
      this.setUserInfo(res)
    },

    setUserInfo(res: any) {
      // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
      if (res.roles.length === 0) {
        this.roles = ['ROLE_SYSTEM_DEFAULT']
      } else {
        this.roles = res.roles
      }
      this.user = res.user
    },

    // 登出
    async logOut() {
      await userLogOut();
      this.roles = []
      clearToken();
    },

    async updateLoadMenus() {
      return new Promise(() => {
        this.loadMenus = false
      })
    }
  },
});




export default useUserStore;
