import router from '@/router'
export const useUserStore = defineStore('user', () => {
  const name = ref<string | null>(null)
  const type = ref<string | null>(null)
  const isLogin = ref<Boolean>(false)
  function login(username: string, password: string) {
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code == '200') {
          name.value = res.data.name
          type.value = res.data.type
          isLogin.value = true
          ElMessage.success('登入成功')
          router.push({ name: 'Home' })
        } else if (res.code == '401') {
          ElMessage.error('帳號或密碼錯誤!')
        }
      })
      .catch(() => {
        ElMessage.error('登入失敗')
      })
  }
  function logout() {
    fetch('/api/logout')
      .then((res) => res.json())
      .then((res) => {
        if (res.code == '200') {
          name.value = null
          type.value = null
          isLogin.value = false
          ElMessage.success('登出成功')
          router.push({ name: 'Login' })
        } else {
          ElMessage.error('登出失敗')
        }
      })
  }
  function checkLogin() {
    fetch('/api/checkLogin')
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          name.value = res.data.name
          type.value = res.data.type
          isLogin.value = true
        } else {
          name.value = null
          type.value = null
          isLogin.value = false
        }
      })
      .catch(() => {
        name.value = null
        type.value = null
        isLogin.value = false
      })
  }
  return { name, type, isLogin, login, logout, checkLogin }
})
