export const formatNameForAvatar = (name: string) => {
  const nameArr = name?.split(' ')
  return nameArr
    ?.map(item => item[0])
    .join('')
    .toUpperCase()
}

export const capitalizeFirstLetterName = (name: string) => {
  return name
    .split(' ')
    .map(item => `${item[0]?.toUpperCase()}${item?.slice(1)}`)
    .join(' ')
}
