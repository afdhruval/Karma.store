import './App.css'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth'
import { useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'


function App() {


  const { handleGetMe } = useAuth()

  const user = useSelector(state => state.auth.user)


  useEffect(() => {
    handleGetMe()
    
    // Initialize site-wide smooth scroll
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        smoothTouch: true,
        lerp: 0.1,
      }
    });

    return () => {
      if (scroll) scroll.destroy();
    }
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
