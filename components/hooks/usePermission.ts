import { Role } from 'interface/auth.interface'
import { useEffect, useState } from 'react'

export function usePermission(role: Role) {
  const [userRole, setUserRole] = useState<Role>()

  useEffect(() => {
    setUserRole(role)
  }, [role])

  return {
    hasPermission: (permission: keyof Role) => {
      try {
        return (userRole as Role)[permission]
      } catch (e) {
        console.log('no role', e)
      }
    },
  }
}
