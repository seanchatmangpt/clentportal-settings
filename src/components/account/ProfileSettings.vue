<script lang="ts" setup>
import { loadImage } from '@/helper/ImageUpload.helper'
import timezones from '@/helper/timezones'
import { UserService } from '@/service/UserService'
import {
  UIButton,
  UIForm,
  UIFormItem,
  UIInput,
  UISelect,
  UISpace,
  UISpin,
  UITag,
  UITextLgMedium,
  UIUpload,
  useNotification,
} from '@gohighlevel/ghl-ui'
import { v4 as uuidv4 } from 'uuid'
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { string } from 'yup'
import { ALLOWED_FILE_TYPES } from '../../helper/const'
import { MediaService } from '../../service'
import { useAppStore } from '../../store/app'
import Space from './../common/Space.vue'
const appStore = useAppStore()
const isLoading = ref(false)
const host = `https://${window.location.host}/`
onBeforeMount(async () => {
  setFormData()
})
onUnmounted(() => {
  const canvas = document.getElementById(canvasId)
  if (canvas) {
    canvas.remove()
  }
})
const profileLink = ref('')
const canvasId = 'image-converter-canvas'
function setFormData() {
  profileLink.value = `https://${host}/${profileForm.value.slug}`
  profileForm.value.fullName = appStore.profileDetails.fullName
  profileForm.value.title = appStore.profileDetails.title
  profileForm.value.slug = appStore.profileDetails.slug
  profileForm.value.bio = appStore.profileDetails.bio
  profileForm.value.role = appStore.profileDetails.role
  profileForm.value.location = appStore.profileDetails.location
  profileForm.value.timeZone = appStore.profileDetails?.timeZone || ''
  profileForm.value.avatar = appStore.profileDetails?.avatar
    ? [
        {
          status: 'finished',
          name: 'Profile Image',
          type: 'image/jpeg',
          url: appStore.profileDetails?.avatar,
        },
      ]
    : []
}
const notification = useNotification()
function notificationAlert(title: string, content: string) {
  notification.create({
    title: title,
    content: content,
    duration: 5000,
  })
}

const isSlugEditable = ref(false)
const profileForm = ref({
  fullName: '',
  title: '',
  avatar: [],
  slug: '',
  updatedSlug: false,
  bio: '',
  role: '',
  location: '',
  timeZone: '',
}) as any
const rules = {
  fullName: {
    validator: (_, value: string) => {
      return string()
        .test('is-name', 'Invalid Name', value => {
          const nameRegex = /^$|^\S+.*/
          return nameRegex.test(value as string)
        })
        .required()
        .validate(value)
    },

    message: 'Name is required',
    trigger: ['input'],
  },
}
const state = ref({
  file: null,
  avatar: { aspectRatioError: false, aspectRatio: 1.0 },
})

const showGroupCreatedModal = ref(false)

const actionUrl = reactive({
  avatar: {},
})
const slugError = ref(false)
const uploadedUrl = reactive({
  avatar: {
    width: {},
    url: {},
  },
})

function handleUploadChange(type: string | number, data: { fileList: any[] }) {
  const file = data?.fileList[0]
  state.value.file = file
  if (file) {
    if (file.status === 'finished') {
      const { id, name, percentage, type: imageType, url } = file
      profileForm.value[type] = [{ id, name, percentage, type: imageType, url }]
    }
    profileForm.value[type] = [file]
  } else {
    profileForm.value[type] = []
  }
}

function handleUploadFinish(
  type: string | number,
  file: { file: { status: string; url: any; name: any; type: any } }
) {
  if (file.file.status === 'finished') {
    file.file.url = uploadedUrl[type].url.value
    const brandingImage = {
      name: file.file.name,
      type: file.file.type,
      url: uploadedUrl[type].url.value,
    }
    profileForm.value[type] = [brandingImage]
  }
}

async function beforeUpload(type: string | number, data) {
  try {
    if (profileForm.value[type].length > 0) {
      await handleRemoveUploadedImage(data, type)
    }
    const file = data?.file
    state.value.file = file
    if (file && ALLOWED_FILE_TYPES.includes(data.file.type)) {
      const img = new Image()
      const blobedFile = new File([file.file], file.name, {
        type: file.type,
      })
      img.src = URL.createObjectURL(blobedFile)
      await loadImage(img)
      uploadedUrl[type].width.value = type === 'avatar' ? 256 : img.width // use 256px as image width for user avatar
      await getSignedUrl(type, data)
      state.value[type].aspectRatioError = false
      return true
    } else {
      notificationAlert('Image type not supported', '')
      await handleRemoveUploadedImage(data, type)
      return false
    }
  } catch (error) {
    if (error === 'Invalid Aspect Ratio') {
      state.value[type].aspectRatioError = true
    } else {
      notificationAlert(
        'Oops! Unable to upload image.',
        'Please try again later'
      )
    }
    console.error(error)
    return false
  }
}

async function getSignedUrl(type, data) {
  if (!ALLOWED_FILE_TYPES.includes(data.file.type)) {
    notificationAlert('Image type not supported', '')
    return false
  }
  const { url, signedUrl } = (
    await MediaService.generateSignedUrl({
      name: uuidv4(),
      folder: 'users',
      type: 'image/jpeg',
    })
  ).data
  actionUrl[type].value = signedUrl
  uploadedUrl[type].url.value = url
}

async function convertToJPEG(blobedFile) {
  const img = new Image()
  img.src = URL.createObjectURL(blobedFile)
  await loadImage(img)
  const canvas = document.createElement('canvas')
  canvas.id = canvasId
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0)
    const jpegUrl = canvas.toDataURL('image/jpeg')
    return jpegUrl
  } else {
    return ''
  }
}

async function customRequest({
  file,
  action,
  onFinish,
  onError,
  onProgress,
  uploadType,
}) {
  try {
    const blobedFile = new File([file.file], file.name, { type: file.type })
    const jpegDataUrl = await convertToJPEG(blobedFile)
    const jpegDataUrlResponse = await fetch(jpegDataUrl)
    const imageBlob = await jpegDataUrlResponse.blob()

    const formData = new FormData()
    formData.append('file', blobedFile)

    const fileUploadRequest = new XMLHttpRequest()
    fileUploadRequest.open('PUT', action, true)

    fileUploadRequest.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percentComplete = Math.ceil((event.loaded / event.total) * 100)
        onProgress({ percent: percentComplete })
      }
    }

    return new Promise((resolve, reject) => {
      fileUploadRequest.onload = async () => {
        if (fileUploadRequest.status === 200) {
          try {
            await MediaService.compressImage(
              (uploadedUrl[uploadType] as any).url.value,
              (uploadedUrl[uploadType] as any).width.value
            )
            onFinish()
            resolve('resolved') // Resolve the promise on successful completion
          } catch (error) {
            onError(error) // Handle error during compression
            reject(error) // Reject the promise on compression error
          }
        } else {
          onError(
            new Error(
              `Upload failed with status code: ${fileUploadRequest.status}`
            )
          )
          reject(
            new Error(
              `Upload failed with status code: ${fileUploadRequest.status}`
            )
          ) // Reject on upload error
        }
      }

      fileUploadRequest.setRequestHeader('Content-Type', 'image/jpeg')
      fileUploadRequest.send(imageBlob)
    })
  } catch (error) {
    onError(error) // Handle errors during file preparation or XHR setup
    throw error
  }
}

function handleRemoveUploadedImage(data: any, type: string | number) {
  profileForm.value[type] = []
  //TODO add support to delete image from s3
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

const updatingProfileSetting = ref(false)
async function saveProfile() {
  await validateForm()
  try {
    updatingProfileSetting.value = true
    const userData = await UserService.updateUser({
      ...profileForm.value,
      locationId: appStore.locationId,
      userId: appStore.userId,
      avatar: profileForm.value?.avatar[0]?.url || '',
    })

    updatingProfileSetting.value = false
    notificationAlert('Updated Profile Settings', '')
    showGroupCreatedModal.value = true
  } catch (e) {
    console.error(e)
  }
}

async function handleClickOnAspectError(type) {
  state.value[type].aspectRatioError = false
}
</script>
<template>
  <UIForm ref="root" :model="profileForm" :rules="rules" id="profile-form">
    <div v-if="isLoading">
      <UISpin size="large" class="flex h-[80vh] min-w-48 items-center" />
    </div>

    <div v-else class="grid place-items-center divide-y">
      <div
        class="sticky top-12 z-10 row-span-1 flex h-[80px] w-full items-end border-0 border-b border-solid border-gray-300 bg-white pb-2 lg:top-16 lg:h-[100px]"
      >
        <div>
          <UITextLgMedium>Basic Information</UITextLgMedium>
          <div class="text-gray-600">Update your profile details here</div>
        </div>
      </div>

      <div class="max-h-60vh my-16 w-full">
        <Space
          title="Profile Picture"
          description="Recommended Aspect Ratio 1:1"
        >
          <template #space-slot>
            <div>
              <UIFormItem path="avatar">
                <UIUpload
                  @change="data => handleUploadChange('avatar', data)"
                  @finish="file => handleUploadFinish('avatar', file)"
                  :action="actionUrl['avatar']['value']"
                  @before-upload="data => beforeUpload('avatar', data)"
                  :fileList="profileForm.avatar"
                  :custom-request="
                    customRequestProps =>
                      customRequest({
                        ...customRequestProps,
                        uploadType: 'avatar',
                      })
                  "
                  @remove="data => handleRemoveUploadedImage(data, 'avatar')"
                  class="input-style"
                >
                  <template #extra>
                    <div class="font-sans">
                      <div class="text-md font-normal text-gray-600">
                        <span class="font-semibold text-blue-700"
                          >Click to upload</span
                        >
                        or drag and drop
                      </div>
                      <div class="text-md font-normal text-gray-600">
                        SVG, PNG, WEBP or JPG(max. 16x16px)
                      </div>
                    </div>
                  </template>
                </UIUpload>
              </UIFormItem>
              <div v-if="state.avatar.aspectRatioError" class="float-root">
                <UITag
                  type="error"
                  class="float-left"
                  @close="handleClickOnAspectError('avatar')"
                  id="aspectErrorAvatar"
                >
                  The aspect ratio of the image must be 1:1</UITag
                >
              </div>
            </div>
          </template>
        </Space>
        <Space
          title="Full Name"
          description="This will be displayed on your profile"
        >
          <template #space-slot>
            <UIFormItem path="fullName">
              <UIInput
                v-model="profileForm.fullName"
                id="profile-name"
                :maxlength="50"
                placeholder="Enter Full Name"
                class="input-style"
              />
            </UIFormItem>
          </template>
        </Space>
        <Space
          title="Title"
          description="This will be displayed on your profile"
        >
          <template #space-slot>
            <UIFormItem path="profileForm.title">
              <UIInput
                v-model="profileForm.title"
                id="profile-title"
                :maxlength="50"
                placeholder="Enter Title"
                class="input-style"
              />
            </UIFormItem>
          </template>
        </Space>
        <Space title="Profile Slug">
          <template #space-slot>
            <div>
              <UIFormItem path="profileForm.slug">
                <UIInput
                  id="profile-url"
                  v-model="profileForm.slug"
                  placeholder="profileSlug"
                  :disabled="!isSlugEditable"
                  class="input-style"
                />
                <!-- </UIInputGroup> -->
              </UIFormItem>

              <div v-if="slugError" class="float-root">
                <UITag type="error" id="duplicateSlugError">
                  Profile Slug Not Available
                </UITag>
              </div>
            </div>
          </template>
        </Space>
        <Space
          title="Bio"
          description="Example : Hi, I am John Deo and I am a photographer"
        >
          <template #space-slot>
            <UIFormItem path="profileForm.bio">
              <UIInput
                id="profile-bio"
                class="input-style"
                v-model="profileForm.bio"
                type="textarea"
                :rows="5"
                :cols="100"
                :maxlength="200"
                :showCount="true"
                placeholder="Enter a brief description"
                size="large"
              />
            </UIFormItem>
          </template>
        </Space>
        <Space
          title="Location"
          description="This will be displayed on your profile"
        >
          <template #space-slot>
            <UIFormItem path="profileForm.location">
              <UIInput
                v-model="profileForm.location"
                id="profile-location"
                placeholder="Enter Location"
                class="input-style"
                :maxlength="40"
                :showCount="true"
              />
            </UIFormItem>
          </template>
        </Space>
        <Space
          title="Timezone"
          description="This will be displayed on your profile"
        >
          <template #space-slot>
            <UIFormItem path="profileForm.timeZone">
              <UISelect
                id="profile-timezone"
                v-model:value="profileForm.timeZone"
                :options="timezones"
                :filterable="true"
                placeholder="Select Timezone"
                class="input-style"
              />
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
              @click="setFormData"
            >
              Cancel
            </UIButton>

            <UIButton
              id="save-group__btn"
              type="primary"
              size="large"
              @click="saveProfile"
              :loading="updatingProfileSetting"
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
.nav {
  position: fixed;
  top: 0;

  width: 70%;
  height: 100px; /* set the height of your navigation bar */
  background-color: #f9fafb; /* example background color */
  z-index: 999; /* set the navigation bar's z-index to a high value */
}
.top-bar {
  height: 14%;
}
</style>
