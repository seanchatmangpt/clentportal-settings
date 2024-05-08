export const getErrorMessage = error => {
  const message = error?.response?.data?.message
  return typeof message === 'string'
    ? message
    : typeof message[0] === 'string'
    ? message[0]
    : 'Something went wrong'
}
