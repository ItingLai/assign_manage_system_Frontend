<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { openLoading, closeLoading } from '@/composables/loading'
interface User {
  username: string
  name: string
  id: string
  telephone: string
  address: string
  type: string
  basicSalary: number | null
}
const user_data = ref<User[]>([])
const NewUserWindow = ref(false)
const EditUserWindow = ref(false)
const UserFormRef = ref<FormInstance | null>(null)
const EditUserFormRef = ref<FormInstance | null>(null)
const dialogWidth = ref('90%')
const UserForm = ref({
  username: '',
  name: '',
  telephone: '',
  address: '',
  type: '',
  basicSalary: null
})
const EditUserForm = ref<User>({
  id: '',
  username: '',
  name: '',
  telephone: '',
  address: '',
  type: '',
  basicSalary: null
})
const AddUser = (FormRef: FormInstance) => {
  if (!FormRef) return
  FormRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('確定要新增員工資料嗎?', 'Warning', {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          openLoading('資料傳輸中...')
          fetch('/api/manageUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              option: 'add',
              data: UserForm.value
            })
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.code == 200) {
                ElMessage.success('新增成功')
                user_data.value.push(res.data as User)
                NewUserWindow.value = false
              } else if (res.code == 400) {
                ElMessage.error('用戶已存在')
              } else {
                ElMessage.error('新增失敗')
              }
            })
            .catch(() => {
              ElMessage.error('新增失敗')
            })
            .finally(() => {
              //NewUserWindow.value = false
              FormRef.resetFields()
              closeLoading()
            })
        })
        .catch(() => {
          //Nothing
        })
    } else {
      return false
    }
  })
  //新增員工
}
const Edit = (id: string) => {
  EditUserForm.value = JSON.parse(JSON.stringify(user_data.value.find((item) => item.id == id)))
  EditUserWindow.value = true
  //修改員工資料
}
const Delete = (id: string) => {
  ElMessageBox.confirm('確定要刪除員工資料嗎?', 'Warning', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      openLoading('資料傳輸中...')
      fetch('/api/manageUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          option: 'delete',
          userId: id
        })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code == 200) {
            ElMessage.success('刪除成功')
            user_data.value = user_data.value.filter((item) => item.id != id)
          } else {
            ElMessage.error('刪除失敗')
          }
        })
        .catch(() => {
          ElMessage.error('刪除失敗')
        })
        .finally(() => {
          closeLoading()
        })
    })
    .catch(() => {
      //Nothing
    })
  //修改員工資料
}
const ResetPassword = () => {
  ElMessageBox.confirm('確定要重置員工密碼嗎?', 'Warning', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      openLoading('資料傳輸中...')
      fetch('/api/manageUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          option: 'resetPassword',
          userId: EditUserForm.value.id
        })
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code == 200) {
            ElMessage.success('重置成功')
          } else {
            ElMessage.error('重置失敗')
          }
        })
        .catch(() => {
          ElMessage.error('重置失敗')
        })
        .finally(() => {
          EditUserWindow.value = false
          closeLoading()
        })
    })
    .catch(() => {
      //Nothing
    })
}
const EditUserPost = (EditUserFormRef) => {
  if (!EditUserFormRef) return
  EditUserFormRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('確定要修改員工資料嗎?', 'Warning', {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          openLoading('資料傳輸中...')
          fetch('/api/manageUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              option: 'edit',
              data: EditUserForm.value
            })
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.code == '200') {
                ElMessage.success('修改成功')
                FetchUserData()
              } else {
                ElMessage.error('修改失敗')
                closeLoading()
              }
            })
            .catch(() => {
              ElMessage.error('修改失敗')
              closeLoading()
            })
            .finally(() => {
              EditUserWindow.value = false
            })
        })
        .catch(() => {
          //Nothing
        })
    } else {
      return false
    }
  })
  //修改員工資料
}
const FetchUserData = () => {
  //fetch user data
  openLoading('資料載入中...')
  fetch('/api/getAllUserData', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        user_data.value = res.data
      } else {
        ElMessage.error('資料取得失敗')
      }
    })
    .catch(() => {
      ElMessage.error('資料取得失敗')
    })
    .finally(() => {
      closeLoading()
    })
}
onMounted(() => {
  FetchUserData()
  dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  window.addEventListener('resize', () => {
    dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  })
})
const rules = reactive<FormRules<User>>({
  username: [
    { required: true, message: '請輸入帳號名稱', trigger: 'change' },
    { min: 6, max: 20, message: '長度需在 6 到 20 個字元', trigger: 'change' }
  ],
  name: [{ required: true, message: '請輸入姓名', trigger: 'change' }],
  telephone: [{ required: true, message: '請輸入電話號碼', trigger: 'change' }],
  address: [{ required: true, message: '請輸入住址', trigger: 'change' }],
  type: [{ required: true, message: '請選擇職稱', trigger: 'change' }],
  basicSalary: [
    { required: true, message: '請輸入基本薪資', trigger: 'change' },
    { type: 'number', message: '請輸入數字', trigger: 'change' }
  ]
})
</script>
<template>
  <div>
    <h1>員工管理</h1>
    <div style="display: flex; justify-content: end; margin-top: 10px">
      <el-button type="primary" @click="NewUserWindow = true">新增員工</el-button>
    </div>
    <el-table :data="user_data" style="width: 100%" :border="true">
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin: 1rem 0 0 2rem">
            <p class="userInfo"><span class="title">帳號:</span> {{ props.row.username }}</p>
            <p class="userInfo"><span class="title">姓名:</span> {{ props.row.name }}</p>
            <p class="userInfo"><span class="title">電話:</span> {{ props.row.telephone }}</p>
            <p class="userInfo"><span class="title">地址:</span> {{ props.row.address }}</p>
            <p class="userInfo">
              <span class="title">職稱:</span>
              {{
                props.row.type == 'normal' ? '員工' : props.row.type == 'manager' ? '主管' : '人事'
              }}
            </p>
            <p class="userInfo"><span class="title">底薪:</span> {{ props.row.basicSalary }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="性名" />
      <el-table-column prop="type" label="職稱">
        <template #default="scope">
          <el-tag
            :type="
              scope.row.type == 'normal'
                ? ''
                : scope.row.type == 'manager'
                  ? 'success'
                  : scope.row.type == 'accountant'
                    ? 'warning'
                    : 'danger'
            "
            effect="dark"
            >{{
              scope.row.type == 'normal'
                ? '員工'
                : scope.row.type == 'manager'
                  ? '主管'
                  : scope.row.type == 'accountant'
                    ? '會計'
                    : '人事'
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" size="small" @click="Edit(scope.row.id)">修改</el-button>
          <el-button type="danger" size="small" @click="Delete(scope.row.id)">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="NewUserWindow" title="新增員工" :width="dialogWidth">
      <el-form :model="UserForm" ref="UserFormRef" :rules="rules">
        <p style="color: red">*預設密碼為電話號碼!</p>
        <el-form-item label="帳號" prop="username">
          <el-input v-model="UserForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="UserForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="電話號碼" prop="telephone">
          <el-input v-model="UserForm.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="UserForm.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="職稱" prop="type">
          <el-select v-model="UserForm.type" placeholder="職稱">
            <el-option label="員工" value="normal" />
            <el-option label="主管" value="manager" />
            <el-option label="人事" value="personal" />
            <el-option label="會計" value="accountant" />
          </el-select>
        </el-form-item>
        <el-form-item label="底薪" prop="basicSalary">
          <el-input v-model.number="UserForm.basicSalary" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(NewUserWindow = false), UserFormRef.resetFields()">取消</el-button>
          <el-button type="warning" @click="UserFormRef.resetFields()">重置</el-button>
          <el-button type="primary" @click="AddUser(UserFormRef)"> 新增 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="EditUserWindow" title="修改員工資訊" :width="dialogWidth">
      <el-form :model="EditUserForm" ref="EditUserFormRef" :rules="rules">
        <el-form-item label="帳號" prop="username">
          <el-input v-model="EditUserForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="EditUserForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="電話號碼" prop="telephone">
          <el-input v-model="EditUserForm.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="EditUserForm.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="職稱" prop="type">
          <el-select v-model="EditUserForm.type" placeholder="職稱">
            <el-option label="員工" value="normal" />
            <el-option label="主管" value="manager" />
            <el-option label="人事" value="personnel" />
            <el-option label="會計" value="accountant" />
          </el-select>
        </el-form-item>
        <el-form-item label="底薪" prop="basicSalary">
          <el-input v-model.number="EditUserForm.basicSalary" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="ResetPassword()">重置密碼</el-button>
          <el-button @click="(EditUserWindow = false), EditUserFormRef.resetFields()"
            >取消</el-button
          >
          <el-button type="primary" @click="EditUserPost(EditUserFormRef)"> 修改 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scope lang="scss"></style>
