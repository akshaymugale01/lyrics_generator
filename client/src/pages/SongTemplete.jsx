import React, { useState, useEffect } from 'react'
import '../song.css'
import { useNavigate, useLocation } from 'react-router-dom'
import toast, { LoaderIcon } from 'react-hot-toast'
import EditPromptModal from '../components/EditPromptModal'
import { DNA } from 'react-loader-spinner'

export default function SongTemplete() {
  const navigator = useNavigate()
  const location = useLocation()
  const [isEditPromptOpen, setIsEditPromptOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    recievers_name: '',
    recievers_pronous: '',
    relation: '',
    message: '',
    model: '',
  })

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData)
    }
    if (location.state?.selectedModel) {
      setSelectedModel(location.state.selectedModel)
    }
  }, [location.state])

  const handelClear = e => {
    setFormData({
      name: '',
      recievers_name: '',
      recievers_pronous: '',
      relation: '',
      message: '',
      model: '',
    })
    e.target.form.reset()
    // document.querySelector('form').reset();
  }

  const handelChnage = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  // console.log("loading", loading);

  const validateForm = () => {
    const { name, recievers_name, recievers_pronous, relation, message } =
      formData

    if (!name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!recievers_name.trim()) {
      toast.error("Please enter receiver's name")
      return false
    }
    if (!recievers_pronous.trim()) {
      toast.error("Please select receiver's pronouns")
      return false
    }
    if (!relation.trim()) {
      toast.error('Please enter your relationship')
      return false
    }
    if (!message.trim()) {
      toast.error('Please enter your message')
      return false
    }
    return true
  }

  const handleSubmmit = async e => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    // Show loading toast
    // const toastId = toast.loading('Generating your song...')
    setLoading(true)
    try {
      const response = await fetch(
        'https://fseyqqetgd.execute-api.ap-south-1.amazonaws.com/uat/api/songs/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            model: selectedModel,
            setNumber: 1,
          }),
        }
      )

      const result = await response.json()

      if (response.ok) {
        setLoading(false)
        // toast.dismiss(toastId)
        toast.success('Song generated successfully!')
        navigator('/lyrics-generator', {
          state: {
            generatedSong: result.data,
            formData: formData,
            selectedModel: selectedModel,
          },
        })
      } else {
        throw new Error(result.error || 'Failed to generate song')
      }
    } catch (error) {
      // toast.dismiss(toastId)
      setLoading(false)
      toast.error(`Error: ${error.message}`)
      console.error('Song generation error:', error)
    }
  }

  console.log('formData', formData)

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="p-2 rounded-lg shadow-sm">
          <form className="max-w-4xl mx-auto">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Song Details
              </h1>
            </div>
            <div className="mb-4">
              <label htmlFor="your-name" className="block mb-2 font-medium">
                Your Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="your-name"
                className="inputBox1 w-full"
                name="name"
                value={formData.name}
                onChange={handelChnage}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="song-input" className="block mb-2 font-medium">
                Recievers Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="song-input"
                className="inputBox1 w-full"
                name="recievers_name"
                value={formData.recievers_name}
                onChange={handelChnage}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="song-input" className="block mb-2 font-medium">
                Recievers Pronous: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="song-input"
                className="inputBox1 w-full"
                name="recievers_pronous"
                value={formData.recievers_pronous}
                onChange={handelChnage}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="song-input" className="block mb-2 font-medium">
                Relation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="song-input"
                className="inputBox1 w-full"
                name="relation"
                value={formData.relation}
                onChange={handelChnage}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label>
                Message <span className="text-red-500">*</span>
              </label>
              <input
                className="inputBox1 w-full"
                name="message"
                type="message"
                onChange={handelChnage}
                value={formData.message}
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="song-model">Model </label>
              <select
                className="flex inputBox1 w-full rounded-md"
                name="model"
                id="model"
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Model</option>
                <option value="gpt-5.1-2025-11-13">GPT-5.1</option>
                <option value="gpt-4.1-2025-04-14">GPT-4.1</option>
              </select>
            </div>
            <div className="flex items-center justify-between content-center">
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="purpleBtn1 rounded-2xl px-4 py-2"
                  onClick={handleSubmmit}
                  disabled={loading}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="purpleBtn1"
                  onClick={handelClear}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="purpleBtn1"
                  onClick={() => setIsEditPromptOpen(true)}
                  disabled={loading}
                >
                  Edit Prompt
                </button>
              </div>
            </div>
          </form>
        </div>

        <EditPromptModal
          isOpen={isEditPromptOpen}
          onClose={() => setIsEditPromptOpen(false)}
          formData={formData}
          selectedModel={selectedModel}
          onSave={handlePromptSave}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg font-medium">
              Generating your song...
            </p>
          </div>
        </div>
      )}
    </>
  )

  // function handlePromptSave(generatedData, model) {
  //   // This function is called when EditPromptModal generates lyrics
  //   setIsEditPromptOpen(false)

  //   // Navigate to lyrics generator with the generated content
  //   navigator('/lyrics-generator', {
  //     state: {
  //       generatedSong: generatedData,
  //       formData: formData,
  //       selectedModel: model,
  //       fromCustomPrompt: true
  //     }
  //   })
  // }

  function handlePromptSave(prompts, model) {
    const userPromptText = prompts.user || ''

    const nameMatch = userPromptText.match(/Your Name: (.+)/i)
    const receiverNameMatch = userPromptText.match(/Receiver's Name: (.+)/i)
    const pronounsMatch = userPromptText.match(/Receiver's Pronouns: (.+)/i)
    const relationshipMatch = userPromptText.match(/Relationship: (.+)/i)
    const messageMatch = userPromptText.match(/Message: (.+)/i)

    // Update formData with extracted values
    const updatedFormData = {
      name: nameMatch ? nameMatch[1].replace(/\n.*/, '').trim() : formData.name,
      recievers_name: receiverNameMatch
        ? receiverNameMatch[1].replace(/\n.*/, '').trim()
        : formData.recievers_name,
      recievers_pronous: pronounsMatch
        ? pronounsMatch[1].replace(/\n.*/, '').trim()
        : formData.recievers_pronous,
      relation: relationshipMatch
        ? relationshipMatch[1].replace(/\n.*/, '').trim()
        : formData.relation,
      message: messageMatch
        ? messageMatch[1].replace(/\n.*/, '').trim()
        : formData.message,
      model: formData.model,
    }

    setFormData(updatedFormData)

    // Update selected model if provided
    if (model && model !== 'default') {
      setSelectedModel(model)
    }

    // Close the modal
    setIsEditPromptOpen(false)

    // Show success message
    toast.success('Form updated from prompt!')
  }
}
