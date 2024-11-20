'use client'

import { createContext, useState } from 'react'

export const SelectedBusinessContext = createContext(null)

export const SelectedBusinessProvider = ({ children }) => {
  const [selectedBusiness, setSelectedBusiness] = useState({})

  return (
    <SelectedBusinessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </SelectedBusinessContext.Provider>
  )
}