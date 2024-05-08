export function loadImage(image) {
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => {
      resolve(image)
    })
    image.addEventListener('error', (error) => {
      reject(error)
    });
  })
}
export async function validateAspectRatio(image, expectedAspectRatio) {
  return new Promise((resolve, reject) => {
    const width = image.width
    const height = image.height
    const aspectRatio = (width / height).toFixed(2)
    if (aspectRatio != expectedAspectRatio) {
      reject('Invalid Aspect Ratio')
    } else {
      resolve('Valid Aspect Ratio')
    }
  })
}
