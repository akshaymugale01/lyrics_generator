// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SongTemplete from './pages/SongTemplete'
import LyricsGenerator from './pages/LyricsGenerator'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
  <>
      <Routes>
        {/* <Route path="/" element={<SongTemplete />} /> */}
        <Route path="/" element={<SongTemplete />}/>
        <Route path="/song-generator" element={<SongTemplete />} />
        <Route path="/lyrics-generator" element={<LyricsGenerator />} />
      </Routes>
       <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
    </>
  )
}

export default App
