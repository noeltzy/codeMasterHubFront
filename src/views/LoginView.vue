<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()

const formData = reactive({
  phone: '',
  code: ''
})

const countdown = ref(0)
const loading = ref(false)
let timer = null

const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const clearCountdownTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onBeforeUnmount(() => {
  clearCountdownTimer()
})

const handleSendCode = async () => {
  if (!formData.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  if (!validatePhone(formData.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  try {
    loading.value = true
    countdown.value = 60
    
    const result = await userApi.getVerificationCode(formData.phone)
    
    if (!result.success) {
      ElMessage.error(result.message)
      clearCountdownTimer()
      return
    }

    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearCountdownTimer()
      }
    }, 1000)

    ElMessage.success('验证码已发送')
    console.log('验证码:', result.data)
    
  } catch (error) {
    console.error('发送验证码错误:', error)
    ElMessage.error('发送验证码失败，请稍后重试')
    clearCountdownTimer()
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  if (!formData.phone || !formData.code) {
    ElMessage.warning('请输入手机号和验证码')
    return
  }

  if (!validatePhone(formData.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }

  if (formData.code.length !== 6) {
    ElMessage.warning('请输入6位验证码')
    return
  }
  
  try {
    loading.value = true
    const result = await userApi.login(formData.phone, formData.code)
    
    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true')
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>登录</h2>
        </div>
      </template>
      
      <el-form @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            maxlength="11"
            :prefix-icon="Iphone"
          />
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="formData.code"
            placeholder="请输入验证码"
            maxlength="6"
            :prefix-icon="Lock"
          >
            <template #append>
              <el-button
                :disabled="countdown > 0 || loading"
                :loading="loading"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-lighter);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.login-button {
  width: 100%;
}
</style> 