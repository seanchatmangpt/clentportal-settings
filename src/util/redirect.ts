function baseUrl() {
  return window.location.origin
}

export function currentUrl() {
  return window.location.href
}

export function externalPathRedirect(
  path?: string,
  query?: string,
  newTab?: boolean
) {
  const domain = baseUrl()
  if (newTab) {
    window.open(`${domain}/${path}?${query}`, '_blank')
  } else {
    window.location.href = `${domain}/${path}?${query}`
  }
}
