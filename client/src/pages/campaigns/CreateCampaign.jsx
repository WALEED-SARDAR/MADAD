import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCampaign } from '../../api/campaign'
import { toast } from 'react-hot-toast'

const categories = [
  "education", 
  "medical", 
  "emergency", 
  "community", 
  "creative", 
  "business", 
  "other"
]

const CreateCampaign = () => {
  const navigate = useNavigate()
 const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [goalAmount, setGoalAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)


  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic validation: max 5MB and image mime
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file' }))
      return
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: 'Image must be smaller than 5MB' }))
      return
    }

    setErrors((prev) => ({ ...prev, image: null }))
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
    setErrors((prev) => ({ ...prev, image: null }))
    // also reset the input value if needed — DOM input will be uncontrolled, leaving this to the user interaction
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files && e.dataTransfer.files[0]
    if (file) {
      // reuse validation logic
      const fakeEvent = { target: { files: [file] } }
      handleImageChange(fakeEvent)
    }
  }

  const validate = () => {
    if (!title.trim()) return 'Title is required'
    if (!description.trim()) return 'Description is required'
    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) return 'Goal amount must be a positive number'
    if (!deadline) return 'Deadline is required'
    const dl = new Date(deadline)
    if (isNaN(dl.getTime()) || dl <= new Date()) return 'Deadline must be a future date'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('goalAmount', goalAmount)
    formData.append('deadline', deadline)
    if (imageFile) formData.append('image', imageFile)

    try {
      setLoading(true)
      const result = await createCampaign(formData)
      toast.success('Campaign created successfully')
      navigate(`/campaign/${result.campaign.id}`)
    } catch (err) {
      setError(err.message || 'Failed to create campaign')
      toast.error(err.message || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-start justify-center py-12'>
      <div className='w-full max-w-2xl p-8 space-y-6 rounded-xl bg-gray-100 shadow-lg'>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-center text-green-700">Create Campaign</h1>
          <p className='text-sm text-center mb-2 font-medium italic text-gray-500'>Please fill in the details below to create your campaign.</p>
        </div>

        {error && <div className='text-red-600 bg-red-50 p-2 rounded'>{error}</div>}

        <form onSubmit={handleSubmit} className='space-y-4'>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Campaign Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
              {!imagePreview ? (
                <div className="text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                      >
                        Choose Image
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm">or drag and drop</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm font-medium">
                      {imageFile ? imageFile.name : 'Image selected'}
                    </span>
                    <div className="flex space-x-2">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Change
                      </label>
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs italic mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <label className='font-semibold text-gray-500'>Title:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className='w-full p-2 rounded-md border border-gray-300 shadow-sm' placeholder='Campaign title' />
          </div>

          <div>
            <label className='font-semibold text-gray-500'>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              className='w-full p-2 rounded-md border border-gray-300 shadow-sm' placeholder='Describe your campaign' />
          </div>

          <div>
            <label className='font-semibold text-gray-500'>Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className='w-full p-2 rounded-md border border-gray-300 shadow-sm'>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className='font-semibold text-gray-500'>Goal Amount:</label>
            <input value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} type='number' min='1000'
              className='w-full p-2 rounded-md border border-gray-300 shadow-sm' placeholder='5,000' />
          </div>

          <div>
            <label className='font-semibold text-gray-500'>Deadline:</label>
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} type='date'
              className='w-full p-2 rounded-md border border-gray-300 shadow-sm' />
          </div>

          <div className='flex items-center justify-between space-x-3'>
            <button type='submit' disabled={loading} className='w-full p-2 rounded bg-green-600 text-white m-4 cursor-pointer hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold'>
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCampaign
