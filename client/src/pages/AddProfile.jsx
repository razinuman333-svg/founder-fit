import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react';
import axios from 'axios'
import {
	ArrowLeft,
	BriefcaseBusiness,
	Camera,
	Check,
	FileText,
	MapPin,
	Plus,
	Sparkles,
	UserRound,
	X,
} from 'lucide-react'

const initialForm = {
	fullName: '',
	location: '',
	headline: '',
	about: '',
}

function AddProfile() {
	const navigate = useNavigate()
	const { user } = useUser()
	const [form, setForm] = useState(initialForm)
	const [skills, setSkills] = useState([])
	const [skillInput, setSkillInput] = useState('')
	const [experiences, setExperiences] = useState([])
	const [isVentureFormOpen, setIsVentureFormOpen] = useState(false)
	const [ventureForm, setVentureForm] = useState({ company: '', role: '', dates: '' })
	const [avatar, setAvatar] = useState('')
	const [saved, setSaved] = useState(false)

	useEffect(() => () => avatar && URL.revokeObjectURL(avatar), [avatar])

	const updateField = (event) => {
		const { name, value } = event.target
		setForm((current) => ({ ...current, [name]: value }))
		setSaved(false)
	}

	const addSkill = (event) => {
		event.preventDefault()
		const skill = skillInput.trim()
		if (skill && !skills.includes(skill)) setSkills((current) => [...current, skill])
		setSkillInput('')
	}

	const updateVentureField = (event) => {
		const { name, value } = event.target
		setVentureForm((current) => ({ ...current, [name]: value }))
	}

	const openVentureForm = () => {
		setIsVentureFormOpen((current) => !current)
	}

	const cancelVenture = () => {
		setVentureForm({ company: '', role: '', dates: '' })
		setIsVentureFormOpen(false)
	}

	const saveVenture = () => {
		const company = ventureForm.company.trim()
		const role = ventureForm.role.trim()
		const dates = ventureForm.dates.trim()
		if (!company || !role || !dates) return

		setExperiences((current) => [
			...current,
			{ company, role, dates, mark: company.charAt(0).toUpperCase(), id: Date.now() },
		])
		cancelVenture()
	}

	const handleAvatar = (event) => {
		const file = event.target.files?.[0]
		if (file) setAvatar(URL.createObjectURL(file))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			await axios.post('http://localhost:3000/api/user/add-profile', {
				userId: user?.id,
				aboutme: form.about,
				headline: form.headline,
				skills,
				experience: experiences,
				name: form.fullName,
				location: form.location,
				avatar: user?.imageUrl || '',
			})
			setSaved(true)
		} catch (error) {
			console.error('Failed to save profile:', error)
		}
	}

	return (
		<main className="min-h-screen bg-[#f7f8fa] px-4 pb-16 pt-8 text-slate-900 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
							<ArrowLeft size={18} /> Back
						</button>
						<span className="h-5 w-px bg-slate-300" />
						<h1 className="text-2xl font-bold tracking-tight">Add Profile</h1>
					</div>
					<div className="flex gap-3">
						<button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500">Cancel</button>
						<button type="submit" form="profile-form" className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"><Check size={17} /> Save</button>
					</div>
				</div>

				<form id="profile-form" onSubmit={handleSubmit} className="space-y-5">
					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-7">
						<SectionHeading icon={UserRound} title="Personal Info" />
						<div className="mt-7 flex flex-col gap-7 sm:flex-row sm:items-start">
							<div className="relative mx-auto shrink-0 sm:mx-0">
								{avatar ? <img src={avatar} alt="Profile preview" className="h-24 w-24 rounded-full object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">FF</div>}
								<label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-sm transition hover:bg-teal-700" title="Upload profile photo"><Camera size={15} /><input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatar} className="sr-only" /></label>
							</div>
							<div className="grid flex-1 gap-5 md:grid-cols-2">
								<Field label="Full Name"><input name="fullName" value={form.fullName} onChange={updateField} placeholder="e.g. Alex Morgan" className={inputClass} /></Field>
								<Field label="Location" icon={MapPin}><input name="location" value={form.location} onChange={updateField} placeholder="e.g. San Francisco, CA" className={`${inputClass} pl-10`} /></Field>
								<Field label="Headline" className="md:col-span-2"><input name="headline" value={form.headline} onChange={updateField} placeholder="What are you building?" className={inputClass} /></Field>
							</div>
						</div>
					</section>

					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-7">
						<SectionHeading icon={FileText} title="Professional Overview" />
						<div className="mt-6"><Field label="About Me"><textarea name="about" value={form.about} onChange={updateField} rows="5" placeholder="Share your background, what motivates you, and the kind of founder you want to meet..." className={`${inputClass} min-h-32 resize-y`} /></Field></div>
					</section>

					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-7">
						<SectionHeading icon={Sparkles} title="Skills Management" />
						{skills.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-2 text-sm font-medium text-teal-800">{skill}<button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} className="text-teal-500 transition hover:text-teal-900" aria-label={`Remove ${skill}`}><X size={15} /></button></span>)}</div>}
						<div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addSkill(event)} placeholder="Add a skill (e.g. LLM Ops, GTM Strategy)" className={`${inputClass} flex-1`} /><button type="button" onClick={addSkill} className="rounded-lg border border-teal-600 px-5 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-50">Add</button></div>
					</section>

					<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-7">
						<div className="flex items-center justify-between gap-4"><SectionHeading icon={BriefcaseBusiness} title="Founder Experience" /><button type="button" onClick={openVentureForm} className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-900"><Plus size={17} /> Add Venture</button></div>
						{isVentureFormOpen && <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50/40 p-4 sm:p-5"><div className="grid gap-4 md:grid-cols-3"><Field label="Company Name"><input name="company" value={ventureForm.company} onChange={updateVentureField} placeholder="e.g. Northstar Labs" className={inputClass} /></Field><Field label="Role"><input name="role" value={ventureForm.role} onChange={updateVentureField} placeholder="e.g. Co-founder & CEO" className={inputClass} /></Field><Field label="Date Range"><input name="dates" value={ventureForm.dates} onChange={updateVentureField} placeholder="e.g. 2021 - Present" className={inputClass} /></Field></div><div className="mt-4 flex justify-end gap-3"><button type="button" onClick={cancelVenture} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-500">Cancel</button><button type="button" onClick={saveVenture} disabled={!ventureForm.company.trim() || !ventureForm.role.trim() || !ventureForm.dates.trim()} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">Save Venture</button></div></div>}
						{experiences.length === 0 ? <p className="mt-6 rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">No ventures added yet. Click &quot;+ Add Venture&quot; to add one.</p> : <div className="mt-6 grid gap-3 md:grid-cols-2">{experiences.map((experience) => <div key={experience.id} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">{experience.mark}</div><div className="min-w-0"><h3 className="truncate font-semibold">{experience.company}</h3><p className="mt-0.5 text-sm text-slate-500">{experience.role}</p></div><span className="ml-auto shrink-0 text-right text-xs font-medium text-slate-400">{experience.dates}</span><button type="button" onClick={() => setExperiences((current) => current.filter((item) => item.id !== experience.id))} className="text-slate-400 transition hover:text-red-600" aria-label={`Remove ${experience.company}`}><X size={17} /></button></div>)}</div>}
					</section>
					{saved && <p className="text-right text-sm font-medium text-teal-700" role="status">Profile saved successfully.</p>}
				</form>
			</div>
		</main>
	)
}

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'

function Field({ label, icon: Icon, className = '', children }) {
	return <label className={`relative block text-sm font-semibold text-slate-700 ${className}`}><span className="mb-2 block">{label}</span>{Icon && <Icon size={17} className="absolute left-3 top-[2.35rem] text-slate-400" />}{children}</label>
}

function SectionHeading({ icon: Icon, title }) {
	return <div className="flex items-center gap-2.5"><Icon size={19} className="text-teal-700" /><h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2></div>
}

export default AddProfile
