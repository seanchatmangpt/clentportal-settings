import { convertDateToCurrentTimeZone } from '@/helper/index'
import { EyeIcon } from '@gohighlevel/ghl-icons/24/outline'
import { UITextSmMedium } from '@gohighlevel/ghl-ui'
import { h } from 'vue'

export const getCertificateTableColumns = (
  onClickCertificateButtonAction,
  appStore
) => [
  {
    title: 'Course/Assignment Name',
    key: 'meta.membership.productTitle',
    render(row) {
      return h(
        UITextSmMedium,
        {
          class: 'text-gray-900 hover:text-primary-600 cursor-pointer',
          onClick: () => onClickCertificateButtonAction('preview', row),
        },
        {
          default: () =>
            row.meta?.membership?.productTitle || 'Offline Certification',
        }
      )
    },
  },
  {
    title: 'Completion Date',
    key: 'createdAt',
    render(row) {
      return h('span', {
        innerHTML: convertDateToCurrentTimeZone(
          row.createdAt,
          appStore.timezone
        ),
      })
    },
  },

  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        'div',
        {
          class:
            'text-gray-900 hover:text-primary-600 cursor-pointer p-1 mx-3 rounded-full',
          onClick: () => onClickCertificateButtonAction('preview', row),
        },
        [
          h(EyeIcon, {
            class: 'h-4 w-4 cursor-pointer',
          }),
        ]
      )
    },
  },
]
