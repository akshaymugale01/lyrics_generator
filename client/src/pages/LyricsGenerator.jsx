import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function LyricsGenerator() {
  const [activeTab, setActiveTab] = useState('set1')
  // const [feedback, setFeedback] = useState('')
  const [availableSets, setAvailableSets] = useState(['set1']) 
  const [lyricsData, setLyricsData] = useState({
    set1: [],
    set2: [],
    set3: []
  })
  const [originalFormData, setOriginalFormData] = useState(null)
  const [selectedModel, setSelectedModel] = useState('gpt-4.1')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.generatedSong) {
      const { generatedSong, formData, selectedModel: model } = location.state
      setLyricsData(prev => ({
        ...prev,
        set1: generatedSong.lyrics
      }))
      setOriginalFormData(formData)
      setSelectedModel(model || 'gpt-4.1')
    }
  }, [location.state])

  // const handleSubmit = e => {
  //   e.preventDefault()
    
  //   // if (!feedback.trim()) {
  //   //   toast.error('Please enter your feedback before submitting')
  //   //   return
  //   // }
    
  //   const toastId = toast.loading('Submitting your feedback...')
    
  //   setTimeout(() => {
  //     toast.dismiss(toastId)
  //     toast.success('Thank you for your feedback!')
  //     setFeedback('') 
      
  //     setTimeout(() => {
  //       navigate('/song-generator')
  //     }, 1500)
  //   }, 2000)
  // }

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    // toast(`Switched to ${tabKey.replace('set', 'Set ')}`, {
    //   icon: '🎵',
    //   duration: 1500,
    // })
  }

  const handleRGenerate = async () => {
    if (!originalFormData) {
      toast.error('No original data found for regeneration')
      return
    }

    // Check if we've reached the maximum number of sets
    if (availableSets.length >= 3) {
      toast.error('Maximum 3 sets reached')
      return
    }

    // const toastId = toast.loading("Regenerating lyrics...")
    setLoading(true)

    try {
      const setNumber = availableSets.length + 1
      const nextSetKey = `set${setNumber}`
      
      const response = await fetch('https://fseyqqetgd.execute-api.ap-south-1.amazonaws.com/uat/api/songs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...originalFormData,
          model: selectedModel,
          setNumber: setNumber
        })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // toast.dismiss(toastId)
        setLoading(false)
        
        // Update lyrics data
        setLyricsData(prev => ({
          ...prev,
          [nextSetKey]: result.data.lyrics
        }))
        
        // Add the new set to available sets
        setAvailableSets(prev => [...prev, nextSetKey])
        
        // Switch to the new set
        setActiveTab(nextSetKey)
        
        // Note: Max 3 sets allowed
        
        toast.success(`Set ${setNumber} generated! Check the new tab`)
      } else {
        throw new Error(result.error || 'Failed to regenerate lyrics')
      }
      
    } catch (error) {
      // toast.dismiss(toastId)
      setLoading(false)
      toast.error(`Error: ${error.message}`)
      console.error('Regeneration error:', error)
    }
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Generated Lyrics
          </h1>
        </div>

        <div className="mb-6">
          <div className="flex border-b border-gray-300">
            {availableSets.map((setKey, index) => (
              <button
                key={setKey}
                onClick={() => handleTabChange(setKey)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === setKey
                    ? 'border-gray-800 text-gray-800 bg-gray-200'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Set {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Lyrics Content */}
        <div className="rounded-lg p-6 mb-8 shadow-sm">
          <div className="space-y-2 bg-white font-mono rounded-lg p-6 shadow-sm">
            {lyricsData[activeTab].map((line) => (
              <div
                key={line}
                className="rounded-lg  text-gray-700"
                >
                {line}
                </div>
              ))}
              </div>
               {availableSets.length < 3 && (
              <div className='mt-6 gap-4 flex justify-start'>
                <button 
                onClick={handleRGenerate}
                className='purpleBtn1'
                >
                  Re-Generate
                </button>

                <button 
                  onClick={() => navigate('/song-generator', { 
                    state: { 
                      formData: originalFormData,
                      selectedModel: selectedModel 
                    } 
                  })} 
                  className='purpleBtn1'
                >
                  Back to Song Details
                </button>
              </div>
              )}
              
              {availableSets.length >= 3 && (
                <div className='mt-6 gap-4 flex justify-start'>
                  <button 
                    onClick={() => navigate('/song-generator', { 
                      state: { 
                        formData: originalFormData,
                        selectedModel: selectedModel 
                      } 
                    })} 
                    className='purpleBtn1'
                  >
                    Back to Song Details
                  </button>
                  <div className='text-sm text-gray-600 flex items-center'>
                    Limit of 3 sets 
                  </div>
                </div>
              )}
              
            </div>

        {/* Feedback Section */}
        {/* <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your thoughts about the generated lyrics..."
            />
            <button
              type="submit"
              className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Submit
            </button>
          </form>
        </div> */}
      </div>
    </div>

    {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-medium">Generating your song...</p>
          </div>
        </div>
      )}
    </>

  )
}
