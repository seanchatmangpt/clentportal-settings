<script lang="ts" setup>
import {
  UIButton,
  UICheckbox,
  UIForm,
  UIFormItem,
  UIInput,
  UISpace,
  UITextLgMedium,
  UITextMdNormal,
  useNotification,
} from '@gohighlevel/ghl-ui'
import { Ref, computed, onBeforeMount, reactive, ref } from 'vue'

import { UserService } from '@/service'
import { useAppStore } from '@/store/app'
import Space from '../common/Space.vue'
const isLoading = ref(false)
const store = useAppStore()
onBeforeMount(async () => {
  loginEmail.value = store.profileDetails.email
})

const loginEmail = ref('')
const accountForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const rules = {
  currentPassword: {
    required: true,
    message: 'Password is required',
    trigger: ['input', 'blur'],
  },
  newPassword: {
    required: true,
    min: 8,
    message: 'Please enter a password of mininum 8 character',
    trigger: ['input', 'blur'],
  },
  confirmPassword: {
    required: true,
    min: 8,
    message: 'Please enter a password of mininum 8 character',
    trigger: ['input', 'blur'],
  },
}
const root = ref()
async function validateForm() {
  return new Promise((resolve, reject) => {
    root.value
      .getForm()
      .validate()
      .then(() => resolve(true))
      .catch(e => {
        console.error('error', e)
        reject(e)
      })
  })
}
const notification = useNotification()
function notificationAlert(title: string, content: string) {
  notification.create({
    title: title,
    content: content,
    duration: 5000,
  })
}
async function updatePassword() {
  await validateForm()
  try {
    isLoading.value = true
    await UserService.changePassword({
      ...accountForm,
      locationId: store.locationId,
    })
    showChangePasswordFlag.value = false
    onClickBack()
    notificationAlert('Password Updated', '')
  } catch (error: any) {
    console.error(error)
    if (error.response.data.message == 'Invalid Password') {
      notificationAlert('Invalid Password', '')
    } else {
      notificationAlert('Something went wrong', 'Please try again later')
    }
  } finally {
    isLoading.value = false
  }
}

async function onClickBack() {
  accountForm.currentPassword = ''
  accountForm.confirmPassword = ''
  accountForm.newPassword = ''
}
const changePasswordSubmitButton = computed(() => {
  return accountForm?.newPassword &&
    accountForm?.currentPassword &&
    accountForm?.confirmPassword &&
    accountForm.newPassword == accountForm.confirmPassword
    ? false
    : true
})

const showChangePasswordFlag = ref(false)
const changePasswordButtonText = computed(() => {
  return showChangePasswordFlag.value
    ? 'Hide Change Password'
    : 'Change Password'
})
const showPassword = ref(false)
type InputType = 'password' | 'text'
let passwordFieldType: Ref<InputType> = ref('password')
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
  if (showPassword.value) {
    passwordFieldType.value = 'text'
  } else {
    passwordFieldType.value = 'password'
  }
}
function showChangePassword() {
  showChangePasswordFlag.value = !showChangePasswordFlag.value
}
</script>
<template>
  <UIForm ref="root" :model="accountForm" :rules="rules" id="profile-form">
    <!-- <div v-if="isLoading">
      <UISpin size="large" class="min-w-48 flex h-[80vh] items-center" />
    </div> -->
    <div
      class="mt-16 grid h-[90vh] grid-rows-6 place-items-center divide-y overflow-auto lg:mt-20"
    >
      <div
        class="lg:h[80px] sticky top-2 z-10 row-span-1 flex h-[60px] w-full items-end border-0 border-b border-solid border-gray-300 bg-white pb-2"
      >
        <div>
          <UITextLgMedium>Account Information</UITextLgMedium>
          <div class="text-gray-600">Update your account details here</div>
        </div>
      </div>

      <div
        class="form-container max-h-60vh row-span-5 my-16 h-full w-full overflow-y-auto"
      >
        <Space title="Login Email">
          <template #space-slot>
            <UIFormItem path="loginEmail">
              <UIInput
                v-model="loginEmail"
                id="login_email"
                placeholder="Email Id"
                class="input-style"
                :disabled="true"
              />
            </UIFormItem>
          </template>
        </Space>

        <div v-if="showChangePasswordFlag">
          <Space title="Current Password">
            <template #space-slot>
              <UIFormItem path="group.name">
                <UIInput
                  v-model="accountForm.currentPassword"
                  id="current_password"
                  :type="passwordFieldType"
                  placeholder="Current Password"
                  class="input-style"
                />
              </UIFormItem>
            </template>
          </Space>
          <Space title="New Password">
            <template #space-slot>
              <UIFormItem path="newPassword">
                <UIInput
                  v-model="accountForm.newPassword"
                  id="new_password"
                  :type="passwordFieldType"
                  placeholder="New Password"
                  class="input-style"
                />
              </UIFormItem>
            </template>
          </Space>
          <Space title="Retype Password">
            <template #space-slot>
              <UIFormItem path="confirmPassword">
                <UIInput
                  v-model="accountForm.confirmPassword"
                  id="confirm_password"
                  :type="passwordFieldType"
                  placeholder="Retype Password"
                  class="input-style"
                />
              </UIFormItem>
            </template>
          </Space>
          <div class="flex-cols flex items-center justify-end">
            <UICheckbox
              id="show_password_checkbox"
              @click="togglePasswordVisibility"
              :checked="showPassword"
              class="p-1 px-2"
            />
            <UITextMdNormal class="text-gray-800"
              >Show Passwords</UITextMdNormal
            >
          </div>
        </div>
        <div>
          <UISpace class="py-4" justify="start">
            <UIButton
              id="show-change_password__btn"
              :text="true"
              class="font-sans"
              @click="showChangePassword"
            >
              <div class="font-sans">
                {{ changePasswordButtonText }}
              </div>
            </UIButton>
          </UISpace>
        </div>
      </div>
      <div
        class="sticky bottom-0 z-10 row-span-1 flex w-full justify-end border-0 border-t border-solid border-gray-300 bg-white"
      >
        <UIFormItem>
          <UISpace class="mr-4 w-full lg:my-5" justify="end">
            <UIButton id="cancel__btn" size="large" @click="onClickBack">
              Cancel
            </UIButton>

            <UIButton
              id="update_password__btn"
              type="primary"
              size="large"
              @click="updatePassword"
              :loading="isLoading"
              :disabled="changePasswordSubmitButton"
              >Save</UIButton
            >
          </UISpace>
        </UIFormItem>
      </div>
    </div>
  </UIForm>
</template>
<style>
.n-upload-dragger > div {
  display: flex;
  justify-content: center;
}
</style>
<style scoped>
.input-style {
  width: 600px;
  max-width: 700px;
}
.radio-style {
  width: 200px;
  max-width: 300px;
}
.form-container::-webkit-scrollbar {
  display: none;
}
</style>
