import { logoutUser as firebaseLogOut } from '@gohighlevel/clientportal-core'
import { externalPathRedirect } from './redirect'
export const logoutUser = async () => {
  await firebaseLogOut()
  externalPathRedirect('login', '')
}
