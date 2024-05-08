<script lang="ts" setup>
import { UserService } from '@/service'
import { useAppStore } from '@/store/app'
import {
  UIButton,
  UIForm,
  UIFormItem,
  UIInput,
  UISpace,
  UISpin,
  UITextLgMedium,
  useNotification,
  UISwitch,
} from '@gohighlevel/ghl-ui'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { inject, onBeforeMount, ref } from 'vue'
import { string } from 'yup'
import Space from './../common/Space.vue'
const router = inject<any>('router')
const isLoading = ref(false)
const appStore = useAppStore()
onBeforeMount(async () => {
  setFormData()
})
function setFormData() {
  socialMediaForm.value.phoneNumber =
    appStore.profileDetails.socials.phoneNumber
  socialMediaForm.value.email = appStore.profileDetails.socials.email
  socialMediaForm.value.facebook = appStore.profileDetails.socials.facebook
  socialMediaForm.value.twitter = appStore.profileDetails.socials.twitter
  socialMediaForm.value.instagram = appStore.profileDetails.socials.instagram
  socialMediaForm.value.youtube = appStore.profileDetails.socials.youtube
  socialMediaForm.value.linkedin = appStore.profileDetails.socials.linkedin
  socialMediaForm.value.emailVisibility =
    appStore.profileDetails.socials.emailVisibility
  socialMediaForm.value.phoneVisibility =
    appStore.profileDetails.socials.phoneVisibility
}

const notification = useNotification()
function notificationAlert(title: string, content: string) {
  notification.create({
    title: title,
    content: content,
    duration: 5000,
  })
}
const socialMediaForm = ref({
  email: '',
  phoneNumber: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  emailVisibility: 'private',
  phoneVisibility: 'private',
})
const urlValidationSchema = string().test('is-url', 'Invalid URL', value => {
  if (!value) return true // Empty value is considered valid

  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
  return urlRegex.test(value)
})

const urlValidationRule = {
  validator: (_, value: string) => {
    return urlValidationSchema.validate(value) as any
  },
  message: 'Please enter a valid url',
  trigger: ['input', 'blur'],
}
const rules = {
  email: {
    validator: (_, value: string) => {
      return string().email().validate(value) as any
    },
    message: 'Please enter a valid  email',
    trigger: ['input', 'blur'],
  },
  phoneNumber: {
    trigger: ['input', 'blur'],
    validator: (_, value: string) => {
      // makes phone number optional
      if (!value) return true
      const phoneNumberObj = parsePhoneNumberFromString(value)

      if (phoneNumberObj && phoneNumberObj.isValid()) {
        return true
      } else {
        return false
      }
    },
    message:
      'Please enter a valid Phone Number with an appropriate country code ',
  },
  facebook: urlValidationRule,
  instagram: urlValidationRule,
  twitter: urlValidationRule,
  youtube: urlValidationRule,
  linkedin: urlValidationRule,
}
const updatingSocialMediaDetails = ref(false)
async function saveSocialMediaDetails(e) {
  await validateForm()
  try {
    updatingSocialMediaDetails.value = true
    await UserService.updateUser({
      socials: {
        ...socialMediaForm.value,
      },
      locationId: appStore.locationId,
      userId: appStore.userId,
    })
    notificationAlert('Updated Social Media Info', '')
  } catch (e) {
    console.error(e)
  } finally {
    updatingSocialMediaDetails.value = false
  }
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
async function cancel() {
  setFormData()
  root.value.getForm().restoreValidation()
}
</script>
<template>
  <UIForm ref="root" :model="socialMediaForm" :rules="rules" id="profile-form">
    <div v-if="isLoading">
      <UISpin size="large" class="min-w-48 flex h-[80vh] items-center" />
    </div>

    <div class="grid place-items-center divide-y">
      <div
        class="sticky top-12 z-10 row-span-1 flex h-[80px] w-full items-end border-0 border-b border-solid border-gray-300 bg-white pb-2 lg:top-16 lg:h-[100px]"
      >
        <div>
          <UITextLgMedium>Social Information</UITextLgMedium>
          <div class="text-gray-600">Update your social media details here</div>
        </div>
      </div>

      <div class="max-h-60vh my-16 w-full">
        <Space title="Phone Number">
          <template #space-slot>
            <UIFormItem path="phoneNumber">
              <div class="input-style flex w-full items-center justify-between">
                <div>
                  <UIInput
                    v-model="socialMediaForm.phoneNumber"
                    id="phone-number__input"
                    placeholder="User Phone"
                    class="text-input-style"
                  />
                </div>
                <div class="flex justify-between gap-4 text-gray-800">
                  <span> Publicly Visible </span>
                  <UISwitch
                    v-model:value="socialMediaForm.phoneVisibility"
                    uncheckedValue="private"
                    checkedValue="public"
                  />
                </div>
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="Email">
          <template #space-slot>
            <UIFormItem path="email">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.email"
                  id="email__input"
                  placeholder="User Email"
                  class="text-input-style"
                />
                <div class="flex justify-between gap-4 text-gray-800">
                  <span> Publicly Visible </span>
                  <UISwitch
                    v-model:value="socialMediaForm.emailVisibility"
                    uncheckedValue="private"
                    checkedValue="public"
                  />
                </div>
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="Facebook">
          <template #space-slot>
            <UIFormItem path="facebook">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.facebook"
                  id="facebook__input"
                  placeholder="https://facebook.com/marketing"
                  class="text-input-style"
                />
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="Instagram">
          <template #space-slot>
            <UIFormItem path="instagram">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.instagram"
                  id="instagram__input"
                  placeholder="https://instagram.com/marketing"
                  class="text-input-style"
                />
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="Twitter">
          <template #space-slot>
            <UIFormItem path="twitter">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.twitter"
                  id="twitter__input"
                  placeholder="https://twitter.com/marketing"
                  class="text-input-style"
                />
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="Youtube">
          <template #space-slot>
            <UIFormItem path="youtube">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.youtube"
                  id="youtube__input"
                  placeholder="https://youtube.com/marketing"
                  class="text-input-style"
                />
              </div>
            </UIFormItem>
          </template>
        </Space>
        <Space title="LinkedIn">
          <template #space-slot>
            <UIFormItem path="linkedin">
              <div class="input-style flex w-full items-center justify-between">
                <UIInput
                  v-model="socialMediaForm.linkedin"
                  id="linkedin__input"
                  placeholder="https://linkedin.com/marketing"
                  class="text-input-style"
                />
              </div>
            </UIFormItem>
          </template>
        </Space>
      </div>
      <div
        class="sticky bottom-0 z-10 row-span-1 flex w-full justify-end border-0 border-t border-solid border-gray-300 bg-white"
      >
        <UIFormItem>
          <UISpace class="mr-4 w-full lg:my-5" justify="end">
            <UIButton
              id="cancel-create-group__btn"
              size="large"
              @click="cancel"
            >
              Cancel
            </UIButton>

            <UIButton
              id="save-group__btn"
              type="primary"
              size="large"
              :loading="updatingSocialMediaDetails"
              @click="saveSocialMediaDetails"
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
.text-input-style {
  width: 400px;
  max-width: 500px;
}
</style>
