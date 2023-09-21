import React from 'react'

type DefaultLayoutProps = {
  children: React.ReactNode
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <>
    <div className='vdt-w-100 vdt-h-screen'>
      <div className='vdt-h-14 vdt-bg-light-grayish-blue'>

      </div>
      <main style={{height: `calc(100vh - 56px)`}} className='vdt-overflow-hidden'>
        {children}
      </main>
    </div>
  </>
}

export default DefaultLayout;