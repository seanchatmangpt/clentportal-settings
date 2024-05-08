import axios from 'axios'
import { load } from 'cheerio'

const page: any = JSON.parse(localStorage.getItem('event') as any)

async function prefetchResources(url) {
  // Fetch the index.html file
  const response = await axios.get(url)

  // Parse the HTML
  const $ = load(response.data)

  // Extract the URLs of the script and link tags
  const resources: string[] = [] // Specify the type of the resources array
  $('script[src], link[href]').each((i, element) => {
    const resourceUrl = $(element).attr('src') || $(element).attr('href')
    resources.push(resourceUrl as string) // Add type assertion to treat resourceUrl as string
  })

  // Generate the prefetch tags
  const prefetchTags = resources
    .map(resourceUrl => `<link rel="prefetch" href="${resourceUrl}">`)
    .join('\n')
  // Fetch each resource
  for (const resourceUrl of resources) {
    try {
      await axios.get(resourceUrl)
    } catch (error) {
      console.error(`Failed to prefetch resource: ${resourceUrl}`, error)
    }
  }
  return prefetchTags
}

export function downloadApp(url: string) {
  const currentDomain = `https://${window.location.hostname}`
  prefetchResources(`${currentDomain}/${url}`)
    .then(prefetchTags => console.log(prefetchTags))
    .catch(error => console.error(error))
}
