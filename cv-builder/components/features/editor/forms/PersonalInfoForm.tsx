'use client'

import { useCVStore } from '@/store/cv-store'
import { ChangeEvent, useRef } from 'react'
import { Camera, X, Mail, Phone, MapPin, Globe, User, Link, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

const Label = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <label className="font-work-sans text-[12px] font-semibold text-on-surface-variant uppercase tracking-[0.05em] mb-[7px] flex items-center gap-1.5">
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </label>
)

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-[13px] py-[10px] rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface-container-lowest font-work-sans text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-[3px] focus:ring-primary/10 outline-none transition-all duration-200"
  />
)

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
    <div className="flex flex-col gap-6 p-1">
      {/* ── Avatar Upload ─────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div 
            className="w-20 h-20 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center overflow-hidden transition-all group-hover:border-primary-container group-hover:shadow-level-2"
          >
            {personal.photoUrl ? (
              <img 
                src={personal.photoUrl} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-outline-variant" />
            )}
            {/* Camera Overlay */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {personal.photoUrl && (
            <button
              type="button"
              onClick={() => updatePersonal({ photoUrl: null })}
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center shadow-level-1 hover:bg-error/90 transition-colors border-2 border-surface"
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
        <div className="flex flex-col gap-1">
          <h4 className="font-manrope text-sm font-semibold text-on-surface">Profile Photo</h4>
          <p className="font-work-sans text-xs text-on-surface-variant">JPG, PNG or WebP. Max 2MB.</p>
        </div>
      </div>

      {/* ── Main Fields ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5">
        {/* Name */}
        <div>
          <Label>Full Name</Label>
          <Input
            type="text"
            name="fullName"
            value={personal.fullName}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Job Title */}
        <div>
          <Label>Professional Title</Label>
          <Input
            type="text"
            name="jobTitle"
            value={personal.jobTitle}
            onChange={handleInputChange}
            placeholder="Target position or current role"
          />
        </div>
      </div>

      {/* ── Contact Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {/* Email */}
        <div>
          <Label icon={Mail}>Email</Label>
          <Input
            type="email"
            name="email"
            value={personal.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <Label icon={Phone}>Phone</Label>
          <Input
            type="tel"
            name="phone"
            value={personal.phone}
            onChange={handleInputChange}
            placeholder="+1 234 567 890"
          />
        </div>

        {/* Location */}
        <div>
          <Label icon={MapPin}>Location</Label>
          <Input
            type="text"
            name="location"
            value={personal.location}
            onChange={handleInputChange}
            placeholder="City, Country"
          />
        </div>

        {/* Website */}
        <div>
          <Label icon={Globe}>Website</Label>
          <Input
            type="text"
            name="website"
            value={personal.website}
            onChange={handleInputChange}
            placeholder="portfolio.com"
          />
        </div>
      </div>

      {/* Socials Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {/* LinkedIn */}
        <div>
          <Label icon={Link}>LinkedIn</Label>
          <Input
            type="text"
            name="linkedin"
            value={personal.linkedin}
            onChange={handleInputChange}
            placeholder="linkedin.com/in/username"
          />
        </div>

        {/* GitHub */}
        <div>
          <Label icon={GitBranch}>GitHub</Label>
          <Input
            type="text"
            name="github"
            value={personal.github}
            onChange={handleInputChange}
            placeholder="github.com/username"
          />
        </div>
      </div>
    </div>
  )
}
