import { ref } from "vue";

interface UserInfo {
  id: string;
  phone: string;
  username: string;
  avatar: string;
  sex: 1 | 2;
  birthday: string;
  introduc: string;
  status: 0 | 1;
  invite_code: string;
  created_at: string;
  workday: string;
}

export const is_login = ref(false);
export const user_info = ref<UserInfo | null>(null);

export const setLogin = (v: boolean) => {
  is_login.value = v;
};
export const setUInfo = (info: UserInfo) => {
  user_info.value = info;
};
