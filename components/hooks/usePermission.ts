import { permission } from '@/lib/store/common'
import { Permissions } from 'interface/auth.interface'
import { useRecoilValue } from 'recoil'

export function usePermission() {
  const permissionState = useRecoilValue(permission)

  return {
    hasPermission: (permission: keyof Permissions) => {
      try {
        return (permissionState as Permissions)[permission]
      } catch (e) {
        console.log('no role', e)
      }
    },
  }
}
