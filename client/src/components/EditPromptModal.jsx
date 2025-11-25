import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function EditPromptModal({ isOpen, onClose, formData, selectedModel, onSave }) {
  const [activeTab, setActiveTab] = useState('user')
  const [prompts, setPrompts] = useState({
    system: `You are a creative songwriter and lyricist. Create EXACTLY 8 lines of personalized song lyrics based on the user's input. Make the song heartfelt, emotional, and meaningful. Structure the lyrics with verses, chorus, and bridge elements as appropriate. Ensure the lyrics flow well and capture the emotions and relationship described by the user.`,
    user: `Create a personalized song with the following details:
- Your Name: ${formData?.name || '[Your Name]'}
- Receiver's Name: ${formData?.recievers_name || '[Receiver Name]'}
- Receiver's Pronouns: ${formData?.recievers_pronous || '[Pronouns]'}
- Relationship: ${formData?.relation || '[Relationship]'}
- Message: ${formData?.message || '[Message]'}
- Style: ${selectedModel || 'Default'}

Please create an 8-line song that captures the emotion and relationship described above.`
  })

  // Update user prompt when form data changes
  React.useEffect(() => {
    setPrompts(prev => ({
      ...prev,
      user: `Create a personalized song with the following details:
- Your Name: ${formData?.name || '[Your Name]'}
- Receiver's Name: ${formData?.recievers_name || '[Receiver Name]'}
- Receiver's Pronouns: ${formData?.recievers_pronous || '[Pronouns]'}
- Relationship: ${formData?.relation || '[Relationship]'}
- Message: ${formData?.message || '[Message]'}
- Style: ${selectedModel || 'Default'}

Please create an 8-line song that captures the emotion and relationship described above.`
    }))
  }, [formData, selectedModel])

  const handlePromptChange = (type, value) => {
    setPrompts(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleSave = () => {
    // const toastId = toast.loading('Generating lyrics with custom prompt...')
    onSave(prompts, selectedModel || 'default')
    // setTimeout(() => {
    //   // toast.dismiss(toastId)
    //   // toast.success('Lyrics generated successfully!')
    //   // onSave(prompts, selectedModel || 'default')
    // }, 3000)
  }

  const handleCancel = () => {
    // Reset to original values
    setPrompts({
      user: `Create a personalized song with the following details:
- Your Name: ${formData?.name || '[Your Name]'}
- Receiver's Name: ${formData?.recievers_name || '[Receiver Name]'}
- Receiver's Pronouns: ${formData?.recievers_pronous || '[Pronouns]'}
- Relationship: ${formData?.relation || '[Relationship]'}
- Message: ${formData?.message || '[Message]'}
- Style: ${selectedModel || 'Default'}

Please create an 8-line song that captures the emotion and relationship described above.`,
      system: `You are a creative songwriter and lyricist. Create EXACTLY 8 lines of personalized song lyrics based on the user's input. Make the song heartfelt, emotional, and meaningful. Structure the lyrics with verses, chorus, and bridge elements as appropriate. Ensure the lyrics flow well and capture the emotions and relationship described by the user.`
    })
    onClose()
  }

  if (!isOpen) return null


  console.log("edit formData", formData);

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Prompt</h2>
          <p className="text-gray-600 mt-1">Customize the AI prompt for generating your song</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'user'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              User Prompt
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              System Prompt
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'user' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Prompt (Your song details and requirements)
                </label>
                <textarea
                  value={prompts.user}

                  onChange={(e) => handlePromptChange('user', e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your song details and specific requirements..."
                />
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt (AI behavior and instructions)
                </label>
                <textarea
                  value={prompts.system}
                  onChange={(e) => handlePromptChange('system', e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Instructions for how the AI should behave and generate songs..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Model Selection Display */}
        {/* <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-black">
            <strong>Add Details:</strong>
          </p>
        </div> */}

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border border-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="purpleBtn1"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}