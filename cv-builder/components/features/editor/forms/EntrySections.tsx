'use client'

import React from 'react'
import { useCVStore } from '@/store/cv-store'
import MultiEntryLayout from './MultiEntryLayout'
import RichTextEditor from '../RichTextEditor'
import { 
  Briefcase, 
  GraduationCap, 
  Star, 
  FileBadge, 
  Folder, 
  Wrench,
  Calendar,
  X
} from 'lucide-react'
import { formatMonthYear } from '@/lib/utils'

// ─── Sub-components for Form Fields (Internal use for consistency) ────────────

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

const DateSelect = ({ 
  month, 
  year, 
  onChange,
  onClear
}: { 
  month: number; 
  year: number; 
  onChange: (m: number, y: number) => void;
  onClear?: () => void
}) => (
  <div className="relative flex gap-2">
    <select
      value={month}
      onChange={(e) => onChange(parseInt(e.target.value), year)}
      className="w-full px-[13px] py-[10px] rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface-container-lowest font-work-sans text-sm text-on-surface outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all cursor-pointer appearance-none"
    >
      <option value={0}>Month</option>
      {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {new Date(0, i).toLocaleString('en', { month: 'short' })}
        </option>
      ))}
    </select>
    <input
      type="number"
      value={year || ''}
      placeholder="Year"
      onChange={(e) => onChange(month, parseInt(e.target.value))}
      className="w-24 px-[13px] py-[10px] rounded-md border-[1.5px] border-secondary-fixed-dim bg-surface-container-lowest font-work-sans text-sm text-on-surface outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-all"
    />
    {(month !== 0 || year !== 0) && onClear && (
      <button 
        onClick={onClear}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-error transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    )}
  </div>
)

// ─── Work Experience Form ────────────────────────────────────────────────────

export function WorkExperienceForm() {
  const { experience, addExperience, updateExperience, removeExperience, reorderExperience, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={experience}
      onAdd={addExperience}
      onRemove={removeExperience}
      onReorder={reorderExperience}
      onToggleVisibility={(id) => toggleEntryVisibility('experience', id)}
      icon={Briefcase}
      addButtonText="Add work experience"
      renderSummary={(exp) => ({
        title: exp.jobTitle || 'New Role',
        subtitle: exp.company || 'Company Name',
        date: `${formatMonthYear(exp.startDate)} — ${exp.currentlyWorking ? 'Present' : formatMonthYear(exp.endDate)}`
      })}
      renderForm={(exp) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Job Title</Label>
            <Input
              value={exp.jobTitle}
              onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
          <div>
            <Label>Company</Label>
            <Input
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
              placeholder="e.g. Google"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
              placeholder="e.g. Mountain View, CA"
            />
          </div>
          <div>
            <Label icon={Calendar}>Start Date</Label>
            <DateSelect
              month={exp.startDate.month}
              year={exp.startDate.year}
              onChange={(m, y) => updateExperience(exp.id, { startDate: { month: m, year: y } })}
              onClear={() => updateExperience(exp.id, { startDate: { month: 0, year: 0 } })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label icon={Calendar}>End Date</Label>
              <label className="flex items-center gap-1.5 text-[10px] text-on-surface-variant cursor-pointer mb-[7px] select-none hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={exp.currentlyWorking}
                  onChange={(e) => updateExperience(exp.id, { currentlyWorking: e.target.checked })}
                  className="w-3 h-3 rounded-sm border-outline text-primary-container focus:ring-inverse-primary"
                />
                Present
              </label>
            </div>
            {!exp.currentlyWorking ? (
              <DateSelect
                month={exp.endDate?.month || 0}
                year={exp.endDate?.year || 0}
                onChange={(m, y) => updateExperience(exp.id, { endDate: { month: m, year: y } })}
                onClear={() => updateExperience(exp.id, { endDate: { month: 0, year: 0 } })}
              />
            ) : (
              <div className="h-[41px] flex items-center px-[13px] bg-surface-container-low border border-dashed border-outline-variant rounded-md text-[13px] text-on-surface-variant italic font-work-sans">
                Working here currently
              </div>
            )}
          </div>
          <div className="col-span-2 pt-2">
            <Label>Responsibilities & Achievements</Label>
            <RichTextEditor
              content={exp.description}
              onChange={(html) => updateExperience(exp.id, { description: html })}
              placeholder="Describe your role and key accomplishments..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Education Form ──────────────────────────────────────────────────────────

export function EducationForm() {
  const { education, addEducation, updateEducation, removeEducation, reorderEducation, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={education}
      onAdd={addEducation}
      onRemove={removeEducation}
      onReorder={reorderEducation}
      onToggleVisibility={(id) => toggleEntryVisibility('education', id)}
      icon={GraduationCap}
      addButtonText="Add education"
      renderSummary={(edu) => ({
        title: edu.degree || 'New Degree',
        subtitle: edu.institution || 'Institution Name',
        date: `${formatMonthYear(edu.startDate)} — ${edu.current ? 'Present' : formatMonthYear(edu.endDate)}`
      })}
      renderForm={(edu) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Degree / Field of Study</Label>
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              placeholder="e.g. Bachelor of Science in Computer Science"
            />
          </div>
          <div>
            <Label>Institution</Label>
            <Input
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              placeholder="e.g. MIT"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={edu.location}
              onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
              placeholder="e.g. Cambridge, MA"
            />
          </div>
          <div>
            <Label icon={Calendar}>Start Date</Label>
            <DateSelect
              month={edu.startDate.month}
              year={edu.startDate.year}
              onChange={(m, y) => updateEducation(edu.id, { startDate: { month: m, year: y } })}
              onClear={() => updateEducation(edu.id, { startDate: { month: 0, year: 0 } })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label icon={Calendar}>End Date</Label>
              <label className="flex items-center gap-1.5 text-[10px] text-on-surface-variant cursor-pointer mb-[7px] select-none hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                  className="w-3 h-3 rounded-sm border-outline text-primary-container focus:ring-inverse-primary"
                />
                Ongoing
              </label>
            </div>
            {!edu.current ? (
              <DateSelect
                month={edu.endDate?.month || 0}
                year={edu.endDate?.year || 0}
                onChange={(m, y) => updateEducation(edu.id, { endDate: { month: m, year: y } })}
                onClear={() => updateEducation(edu.id, { endDate: { month: 0, year: 0 } })}
              />
            ) : (
              <div className="h-[41px] flex items-center px-[13px] bg-surface-container-low border border-dashed border-outline-variant rounded-md text-[13px] text-on-surface-variant italic font-work-sans">
                Currently studying
              </div>
            )}
          </div>
          <div>
            <Label>GPA (Optional)</Label>
            <Input
              value={edu.gpa}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="e.g. 3.9 / 4.0"
            />
          </div>
          <div className="col-span-2 pt-2">
            <Label>Coursework & Activities</Label>
            <RichTextEditor
              content={edu.description}
              onChange={(html) => updateEducation(edu.id, { description: html })}
              placeholder="Summarize your academic focus or key achievements..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Research Form ───────────────────────────────────────────────────────────

export function ResearchForm() {
  const { research, addResearch, updateResearch, removeResearch, reorderResearch, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={research}
      onAdd={addResearch}
      onRemove={removeResearch}
      onReorder={reorderResearch}
      onToggleVisibility={(id) => toggleEntryVisibility('research', id)}
      icon={Star}
      addButtonText="Add research entry"
      renderSummary={(res) => ({
        title: res.title || 'New Research',
        subtitle: res.institution || 'Institution Name',
        date: `${formatMonthYear(res.startDate)} — ${res.current ? 'Present' : formatMonthYear(res.endDate)}`
      })}
      renderForm={(res) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Project / Thesis Title</Label>
            <Input
              value={res.title}
              onChange={(e) => updateResearch(res.id, { title: e.target.value })}
              placeholder="e.g. Machine Learning for Climate Prediction"
            />
          </div>
          <div>
            <Label>Institution</Label>
            <Input
              value={res.institution}
              onChange={(e) => updateResearch(res.id, { institution: e.target.value })}
              placeholder="e.g. Oxford University"
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={res.location}
              onChange={(e) => updateResearch(res.id, { location: e.target.value })}
              placeholder="e.g. Remote"
            />
          </div>
          <div>
            <Label icon={Calendar}>Start Date</Label>
            <DateSelect
              month={res.startDate.month}
              year={res.startDate.year}
              onChange={(m, y) => updateResearch(res.id, { startDate: { month: m, year: y } })}
              onClear={() => updateResearch(res.id, { startDate: { month: 0, year: 0 } })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label icon={Calendar}>End Date</Label>
              <label className="flex items-center gap-1.5 text-[10px] text-on-surface-variant cursor-pointer mb-[7px] select-none hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={res.current}
                  onChange={(e) => updateResearch(res.id, { current: e.target.checked })}
                  className="w-3 h-3 rounded-sm border-outline text-primary-container focus:ring-inverse-primary"
                />
                Ongoing
              </label>
            </div>
            {!res.current ? (
              <DateSelect
                month={res.endDate?.month || 0}
                year={res.endDate?.year || 0}
                onChange={(m, y) => updateResearch(res.id, { endDate: { month: m, year: y } })}
                onClear={() => updateResearch(res.id, { endDate: { month: 0, year: 0 } })}
              />
            ) : (
              <div className="h-[41px] flex items-center px-[13px] bg-surface-container-low border border-dashed border-outline-variant rounded-md text-[13px] text-on-surface-variant italic font-work-sans">
                In progress
              </div>
            )}
          </div>
          <div className="col-span-2 pt-2">
            <Label>Description</Label>
            <RichTextEditor
              content={res.description}
              onChange={(html) => updateResearch(res.id, { description: html })}
              placeholder="Detail your research objectives and outcomes..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Training Form ───────────────────────────────────────────────────────────
export function TrainingForm() {
  const { training, addTraining, updateTraining, removeTraining, reorderTraining, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={training}
      onAdd={addTraining}
      onRemove={removeTraining}
      onReorder={reorderTraining}
      onToggleVisibility={(id) => toggleEntryVisibility('training', id)}
      icon={FileBadge}
      addButtonText="Add training program"
      renderSummary={(trn) => ({
        title: trn.name || 'New Program',
        subtitle: trn.provider || 'Provider Name',
        date: `${formatMonthYear(trn.startDate)} — ${trn.current ? 'Present' : formatMonthYear(trn.endDate)}`
      })}
      renderForm={(trn) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Program Name</Label>
            <Input
              value={trn.name}
              onChange={(e) => updateTraining(trn.id, { name: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
            />
          </div>
          <div>
            <Label>Provider</Label>
            <Input
              value={trn.provider}
              onChange={(e) => updateTraining(trn.id, { provider: e.target.value })}
              placeholder="e.g. Amazon Web Services"
            />
          </div>
          <div className="flex items-center pt-6">
             <label className="flex items-center gap-1.5 text-[12px] text-on-surface-variant cursor-pointer select-none hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={trn.current}
                  onChange={(e) => updateTraining(trn.id, { current: e.target.checked })}
                  className="w-3.5 h-3.5 rounded-sm border-outline text-primary-container focus:ring-inverse-primary"
                />
                Ongoing
              </label>
          </div>
          <div>
            <Label icon={Calendar}>Start Date</Label>
            <DateSelect
              month={trn.startDate.month}
              year={trn.startDate.year}
              onChange={(m, y) => updateTraining(trn.id, { startDate: { month: m, year: y } })}
              onClear={() => updateTraining(trn.id, { startDate: { month: 0, year: 0 } })}
            />
          </div>
          <div>
            <Label icon={Calendar}>End Date</Label>
            {!trn.current ? (
              <DateSelect
                month={trn.endDate?.month || 0}
                year={trn.endDate?.year || 0}
                onChange={(m, y) => updateTraining(trn.id, { endDate: { month: m, year: y } })}
                onClear={() => updateTraining(trn.id, { endDate: { month: 0, year: 0 } })}
              />
            ) : (
              <div className="h-[41px] flex items-center px-[13px] bg-surface-container-low border border-dashed border-outline-variant rounded-md text-[13px] text-on-surface-variant italic font-work-sans">
                In progress
              </div>
            )}
          </div>
          <div className="col-span-2 pt-2">
            <Label>Description</Label>
            <RichTextEditor
              content={trn.description}
              onChange={(html) => updateTraining(trn.id, { description: html })}
              placeholder="Describe the skills or knowledge gained..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Certification Form ──────────────────────────────────────────────────────
export function CertificationForm() {
  const { certifications, addCertification, updateCertification, removeCertification, reorderCertifications, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={certifications}
      onAdd={addCertification}
      onRemove={removeCertification}
      onReorder={reorderCertifications}
      onToggleVisibility={(id) => toggleEntryVisibility('certifications', id)}
      icon={FileBadge}
      addButtonText="Add certification"
      renderSummary={(cert) => ({
        title: cert.name || 'New Certification',
        subtitle: cert.provider || 'Provider Name',
        date: cert.startDate ? `${formatMonthYear(cert.startDate)} — ${cert.endDate ? formatMonthYear(cert.endDate) : 'No Expiry'}` : ''
      })}
      renderForm={(cert) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Certification Name</Label>
            <Input
              value={cert.name}
              onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
              placeholder="e.g. Certified Information Systems Security Professional (CISSP)"
            />
          </div>
          <div className="col-span-2">
            <Label>Provider</Label>
            <Input
              value={cert.provider}
              onChange={(e) => updateCertification(cert.id, { provider: e.target.value })}
              placeholder="e.g. (ISC)²"
            />
          </div>
          <div>
            <Label icon={Calendar}>Issue Date</Label>
            <DateSelect
              month={cert.startDate?.month || 0}
              year={cert.startDate?.year || 0}
              onChange={(m, y) => updateCertification(cert.id, { startDate: { month: m, year: y } })}
              onClear={() => updateCertification(cert.id, { startDate: null })}
            />
          </div>
          <div>
            <Label icon={Calendar}>Expiry Date</Label>
            <DateSelect
              month={cert.endDate?.month || 0}
              year={cert.endDate?.year || 0}
              onChange={(m, y) => updateCertification(cert.id, { endDate: { month: m, year: y } })}
              onClear={() => updateCertification(cert.id, { endDate: null })}
            />
          </div>
          <div className="col-span-2 pt-2">
            <Label>Description</Label>
            <RichTextEditor
              content={cert.description}
              onChange={(html) => updateCertification(cert.id, { description: html })}
              placeholder="Describe the certification's relevance or key topics covered..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Reference Form ──────────────────────────────────────────────────────────
export function ReferenceForm() {
  const { references, addReference, updateReference, removeReference, reorderReferences, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={references}
      onAdd={addReference}
      onRemove={removeReference}
      onReorder={reorderReferences}
      onToggleVisibility={(id) => toggleEntryVisibility('references', id)}
      icon={Wrench}
      addButtonText="Add reference"
      renderSummary={(ref) => ({
        title: ref.name || 'New Reference',
        subtitle: ref.position || 'Position Name',
      })}
      renderForm={(ref) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Full Name</Label>
            <Input
              value={ref.name}
              onChange={(e) => updateReference(ref.id, { name: e.target.value })}
              placeholder="e.g. Dr. John Doe"
            />
          </div>
          <div className="col-span-2">
            <Label>Position</Label>
            <Input
              value={ref.position}
              onChange={(e) => updateReference(ref.id, { position: e.target.value })}
              placeholder="e.g. Department Head at University of Dhaka"
            />
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Input
              value={ref.address}
              onChange={(e) => updateReference(ref.id, { address: e.target.value })}
              placeholder="e.g. Dhaka, Bangladesh"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={ref.email}
              onChange={(e) => updateReference(ref.id, { email: e.target.value })}
              placeholder="e.g. john.doe@email.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={ref.phone}
              onChange={(e) => updateReference(ref.id, { phone: e.target.value })}
              placeholder="e.g. +880 1234 567890"
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Language Form ───────────────────────────────────────────────────────────
export function LanguageForm() {
  const { languages, addLanguage, updateLanguage, removeLanguage, reorderLanguages, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={languages}
      onAdd={addLanguage}
      onRemove={removeLanguage}
      onReorder={reorderLanguages}
      onToggleVisibility={(id) => toggleEntryVisibility('languages', id)}
      icon={Star}
      addButtonText="Add language"
      renderSummary={(lang) => ({
        title: lang.name || 'New Language',
        subtitle: lang.description || 'Proficiency level',
      })}
      renderForm={(lang) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <Label>Language Name</Label>
            <Input
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
              placeholder="e.g. English"
            />
          </div>
          <div>
            <Label>Description / Proficiency</Label>
            <Input
              value={lang.description}
              onChange={(e) => updateLanguage(lang.id, { description: e.target.value })}
              placeholder="e.g. Native or Fluent"
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Interests Form ──────────────────────────────────────────────────────────
export function InterestForm() {
  const { interests, addInterest, updateInterest, removeInterest, reorderInterests, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={interests}
      onAdd={addInterest}
      onRemove={removeInterest}
      onReorder={reorderInterests}
      onToggleVisibility={(id) => toggleEntryVisibility('interests', id)}
      icon={Star}
      addButtonText="Add interest"
      renderSummary={(int) => ({
        title: int.name || 'New Interest',
        subtitle: int.description || 'Description',
      })}
      renderForm={(int) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2">
            <Label>Interest Name</Label>
            <Input
              value={int.name}
              onChange={(e) => updateInterest(int.id, { name: e.target.value })}
              placeholder="e.g. Photography"
            />
          </div>
          <div className="col-span-2">
            <Label>Description (Optional)</Label>
            <Input
              value={int.description}
              onChange={(e) => updateInterest(int.id, { description: e.target.value })}
              placeholder="e.g. Landscape and Street photography"
            />
          </div>
        </div>
      )}
    />
  )
}
// ─── Project Form ────────────────────────────────────────────────────────────

export function ProjectForm() {
  const { projects, addProject, updateProject, removeProject, reorderProjects, toggleEntryVisibility } = useCVStore()

  return (
    <MultiEntryLayout
      items={projects}
      onAdd={addProject}
      onRemove={removeProject}
      onReorder={reorderProjects}
      onToggleVisibility={(id) => toggleEntryVisibility('projects', id)}
      icon={Folder}
      addButtonText="Add project"
      renderSummary={(project) => ({
        title: project.name || 'New Project',
        subtitle: project.subtitle || 'Sub Title',
        date: project.startDate ? `${formatMonthYear(project.startDate)} — ${project.endDate ? formatMonthYear(project.endDate) : 'Present'}` : ''
      })}
      renderForm={(project) => (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="col-span-2 flex flex-col">
            <Label>Project Title</Label>
            <div className="flex gap-2">
              <div className="flex-[2]">
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, { name: e.target.value })}
                  placeholder="e.g. Business Intelligence Assessment Project"
                />
              </div>
              <div className="flex-1">
                 <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  placeholder="Link (URL)"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <Label>Sub title</Label>
            <Input
              value={project.subtitle}
              onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
              placeholder="e.g. SQL & Power BI"
            />
          </div>

          <div>
            <Label icon={Calendar}>Start Date</Label>
            <DateSelect
              month={project.startDate?.month || 0}
              year={project.startDate?.year || 0}
              onChange={(month, year) => updateProject(project.id, { startDate: { month, year } })}
              onClear={() => updateProject(project.id, { startDate: null })}
            />
          </div>

          <div>
            <Label icon={Calendar}>End Date</Label>
            <DateSelect
              month={project.endDate?.month || 0}
              year={project.endDate?.year || 0}
              onChange={(month, year) => updateProject(project.id, { endDate: { month, year } })}
              onClear={() => updateProject(project.id, { endDate: null })}
            />
          </div>

          <div className="col-span-2">
            <Label>Description</Label>
            <RichTextEditor
              content={project.description}
              onChange={(html) => updateProject(project.id, { description: html })}
              placeholder="Describe the project goals and your contributions..."
            />
          </div>
        </div>
      )}
    />
  )
}

// ─── Summary Forms ───────────────────────────────────────────────────────────
export function PersonalSummaryForm() {
  const { personalSummaries, updatePersonalSummary, activeSectionId } = useCVStore()
  const summary = personalSummaries.find(ps => ps.id === activeSectionId)

  if (!summary) return null

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col">
        <Label>Section Title</Label>
        <Input
          value={summary.title}
          onChange={(e) => updatePersonalSummary(summary.id, { title: e.target.value })}
          placeholder="e.g. Personal Statement"
        />
      </div>
      <div className="flex flex-col">
        <Label>Content</Label>
        <RichTextEditor
          content={summary.content}
          onChange={(html) => updatePersonalSummary(summary.id, { content: html })}
          placeholder="e.g. Dedicated software engineer with a focus on user-centric design..."
        />
      </div>
    </div>
  )
}

export function ProfessionalSummaryForm() {
  const { professionalSummaries, updateProfessionalSummary, activeSectionId } = useCVStore()
  const summary = professionalSummaries.find(ps => ps.id === activeSectionId)

  if (!summary) return null

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col">
        <Label>Section Title</Label>
        <Input
          value={summary.title}
          onChange={(e) => updateProfessionalSummary(summary.id, { title: e.target.value })}
          placeholder="e.g. Executive Summary"
        />
      </div>
      <div className="flex flex-col">
        <Label>Content</Label>
        <RichTextEditor
          content={summary.content}
          onChange={(html) => updateProfessionalSummary(summary.id, { content: html })}
          placeholder="e.g. Led a team of developers to launch a successful fintech application..."
        />
      </div>
    </div>
  )
}
