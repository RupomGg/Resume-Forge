'use client'

import { useCVStore } from '@/lib/store'
import { ChangeEvent, useRef } from 'react'
import { Camera, X, Mail, Phone, MapPin, Globe, User, Link as LinkIcon, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PersonalInfoForm() {
  const { personal, updatePersonal } = useCVStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      updatePersonal({ photoUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updatePersonal({ [name]: value as string })
  }

  return (
    <div className="p-4 space-y-4">
      {/* ── Avatar Upload ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative group">
          <div 
            className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-colors group-hover:border-blue-300"
          >
            {personal.photoUrl ? (
              <img 
                src={personal.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-300" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
            title="Upload photo"
          >
            <Camera className="w-4 h-4" />
          </button>
          {personal.photoUrl && (
            <button
              type="button"
              onClick={() => updatePersonal({ photoUrl: null })}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition-colors border-2 border-white"
              title="Remove photo"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Profile Photo</h4>
          <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or WebP. Max 2MB.</p>
        </div>
      </div>

      {/* ── Main Fields ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={personal.fullName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1">Job Title</label>
          <input
            type="text"
            name="jobTitle"
            value={personal.jobTitle}
            onChange={handleInputChange}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* ── Contact Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={personal.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <Phone className="w-3 h-3" /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={personal.phone}
            onChange={handleInputChange}
            placeholder="+1 234 567 890"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Location
          </label>
          <input
            type="text"
            name="location"
            value={personal.location}
            onChange={handleInputChange}
            placeholder="City, Country"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> Website
          </label>
          <input
            type="text"
            name="website"
            value={personal.website}
            onChange={handleInputChange}
            placeholder="portfolio.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Socials Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* LinkedIn */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <LinkIcon className="w-3 h-3" /> LinkedIn
          </label>
          <input
            type="text"
            name="linkedin"
            value={personal.linkedin}
            onChange={handleInputChange}
            placeholder="linkedin.com/in/username"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600 ml-1 flex items-center gap-1.5">
            <GitBranch className="w-3 h-3" /> GitHub
          </label>
          <input
            type="text"
            name="github"
            value={personal.github}
            onChange={handleInputChange}
            placeholder="github.com/username"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>
      </div>
    </div>
  )
}
