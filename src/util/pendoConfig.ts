interface SetupPendo {
  companyId: string
  locationId: string
  userId: string
}

declare global {
  interface Window {
    pendo: any
  }
}

export function setupPendo(params: SetupPendo) {
  if (params.companyId) {
    const initOptions = {
      visitor: {
        id: params.userId,
      },
      account: {
        id: `${params.companyId}::${params.locationId}`,
      },
    }
    window.pendo && window.pendo.initialize(initOptions)
  }
}

export const emitPendoEvent = (
  eventName: string,
  eventProperties: { [key: string]: string }
) => {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging'
  ) {
    if (window.pendo) {
      window.pendo.track(eventName, eventProperties)
    }
  } else {
    console.table({
      'PENDO Object': '[only in dev mode]',
      eventName,
      ...eventProperties,
    })
  }
}
