import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  CheckCheck,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Smile,
} from 'lucide-react'

const people = [
  {
    id: 'maya',
    name: 'Maya Patel',
    role: 'Product designer',
    avatar: 'https://i.pravatar.cc/160?img=47',
    online: true,
    lastSeen: 'Online now',
  },
  {
    id: 'jordan',
    name: 'Jordan Lee',
    role: 'Growth strategist',
    avatar: 'https://i.pravatar.cc/160?img=12',
    online: false,
    lastSeen: 'Active 18m ago',
  },
  {
    id: 'samir',
    name: 'Samir Okafor',
    role: 'Technical founder',
    avatar: 'https://i.pravatar.cc/160?img=68',
    online: true,
    lastSeen: 'Online now',
  },
  {
    id: 'elena',
    name: 'Elena Rossi',
    role: 'Operations lead',
    avatar: 'https://i.pravatar.cc/160?img=32',
    online: false,
    lastSeen: 'Active yesterday',
  },
  {
    id: 'noah',
    name: 'Noah Williams',
    role: 'Startup advisor',
    avatar: 'https://i.pravatar.cc/160?img=11',
    online: true,
    lastSeen: 'Online now',
  },
]

const initialMessages = {
  maya: [
    { id: 1, author: 'them', text: 'Hey! I liked your perspective on finding product-market fit.', time: '9:41 AM' },
    { id: 2, author: 'me', text: 'Thanks, Maya. Your work on onboarding looks really thoughtful too.', time: '9:44 AM' },
    { id: 3, author: 'them', text: 'I would love to compare notes sometime this week.', time: '9:46 AM' },
  ],
  jordan: [
    { id: 4, author: 'them', text: 'The founder roundtable was a great conversation.', time: 'Yesterday' },
    { id: 5, author: 'me', text: 'Agreed. There were some very sharp growth ideas in there.', time: 'Yesterday' },
  ],
  samir: [
    { id: 6, author: 'them', text: 'Would be great to hear what you are building next.', time: 'Mon' },
  ],
}

function Avatar({ person, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      <img className={`${sizeClass} rounded-full object-cover`} src={person.avatar} alt={person.name} />
      {person.online && (
        <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500' />
      )}
    </div>
  )
}

function PersonRow({ person, active, preview, onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
        active ? 'bg-blue-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Avatar person={person} size='sm' />
      <span className='min-w-0 flex-1'>
        <span className='flex items-center justify-between gap-2'>
          <span className='truncate text-sm font-semibold'>{person.name}</span>
          {person.online && <span className='text-[10px] font-medium text-emerald-600'>Online</span>}
        </span>
        <span className='mt-0.5 block truncate text-xs text-slate-500'>{preview || person.role}</span>
      </span>
    </button>
  )
}

function Message() {
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const messagesEndRef = useRef(null)

  const selectedPerson = people.find((person) => person.id === selectedId)
  const selectedMessages = selectedId ? messages[selectedId] || [] : []
  const conversationIds = Object.keys(initialMessages)
  const conversations = conversationIds
    .map((id) => people.find((person) => person.id === id))
    .filter(Boolean)
  const availableUsers = useMemo(
    () => people.filter((person) => person.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, selectedMessages.length])

  const selectPerson = (person) => {
    setSelectedId(person.id)
    setDraft('')
  }

  const sendMessage = () => {
    const text = draft.trim()
    if (!text || !selectedId) return

    setMessages((current) => ({
      ...current,
      [selectedId]: [
        ...(current[selectedId] || []),
        { id: Date.now(), author: 'me', text, time: 'Just now' },
      ],
    }))
    setDraft('')
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <main className='min-h-[calc(100vh-6rem)] bg-slate-50 px-3 py-4 pb-24 sm:px-6 sm:py-6 md:min-h-[calc(100vh-7rem)] md:px-8 md:pb-8'>
      <div className='mx-auto flex h-[calc(100vh-8rem)] max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:h-[calc(100vh-10rem)]'>
        <aside className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-slate-200 md:w-80`}>
          <div className='border-b border-slate-100 px-5 py-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>FounderFit</p>
            <div className='mt-2 flex items-center justify-between'>
              <h1 className='font-heading text-2xl font-bold text-slate-900'>Messages</h1>
              <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500'>
                {conversations.length} chats
              </span>
            </div>
          </div>

          <div className='min-h-0 flex-1 overflow-y-auto px-3 py-5'>
            <section>
              <div className='mb-2 flex items-center justify-between px-2'>
                <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>Recent conversations</h2>
              </div>
              <div className='space-y-1'>
                {conversations.map((person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    active={person.id === selectedId}
                    preview={messages[person.id]?.at(-1)?.text}
                    onClick={() => selectPerson(person)}
                  />
                ))}
              </div>
            </section>

            <section className='mt-7'>
              <div className='mb-3 px-2'>
                <h2 className='text-xs font-semibold uppercase tracking-wider text-slate-400'>People you can message</h2>
              </div>
              <label className='relative mb-2 block'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Search people'
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-blue-100'
                />
              </label>
              <div className='space-y-1'>
                {availableUsers.map((person) => (
                  <PersonRow key={person.id} person={person} active={person.id === selectedId} onClick={() => selectPerson(person)} />
                ))}
                {availableUsers.length === 0 && <p className='px-3 py-5 text-center text-sm text-slate-500'>No people found.</p>}
              </div>
            </section>
          </div>
        </aside>

        <section className={`${selectedId ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col bg-slate-50`}>
          {!selectedPerson ? (
            <div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary'>
                <MessageCircle className='h-8 w-8' />
              </div>
              <h2 className='mt-5 font-heading text-2xl font-bold text-slate-900'>Select a conversation</h2>
              <p className='mt-2 max-w-sm text-sm leading-6 text-slate-500'>Choose someone from your conversations or people list to start chatting.</p>
            </div>
          ) : (
            <>
              <header className='flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6'>
                <button
                  type='button'
                  onClick={() => setSelectedId(null)}
                  aria-label='Back to conversations'
                  className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden'
                >
                  <ArrowLeft className='h-5 w-5' />
                </button>
                <Avatar person={selectedPerson} size='lg' />
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-heading text-base font-bold text-slate-900'>{selectedPerson.name}</h2>
                  <p className={`mt-0.5 text-xs ${selectedPerson.online ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {selectedPerson.lastSeen}
                  </p>
                </div>
                <button type='button' aria-label='More conversation options' className='rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700'>
                  <MoreHorizontal className='h-5 w-5' />
                </button>
              </header>

              <div className='min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8'>
                <div className='mx-auto flex max-w-2xl flex-col gap-4'>
                  <div className='flex items-center gap-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400'>
                    <span className='h-px flex-1 bg-slate-200' />
                    Today
                    <span className='h-px flex-1 bg-slate-200' />
                  </div>
                  {selectedMessages.map((message) => {
                    const isMine = message.author === 'me'
                    return (
                      <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[84%] sm:max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isMine ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                            {message.text}
                          </div>
                          <div className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-400 ${isMine ? 'flex-row-reverse' : ''}`}>
                            <span>{message.time}</span>
                            {isMine && <CheckCheck className='h-3.5 w-3.5 text-primary' />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  sendMessage()
                }}
                className='border-t border-slate-200 bg-white p-3 sm:p-4'
              >
                <div className='mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-blue-100'>
                  <button type='button' aria-label='Attach a file' className='mb-0.5 hidden rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 sm:block'>
                    <Paperclip className='h-5 w-5' />
                  </button>
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows='1'
                    placeholder='Write a message...'
                    aria-label='Message text'
                    className='max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400'
                  />
                  <button type='button' aria-label='Add emoji' className='mb-0.5 hidden rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 sm:block'>
                    <Smile className='h-5 w-5' />
                  </button>
                  <button
                    type='submit'
                    disabled={!draft.trim()}
                    aria-label='Send message'
                    className='mb-0.5 rounded-xl bg-primary p-2.5 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40'
                  >
                    <Send className='h-4 w-4' />
                  </button>
                </div>
                <p className='mx-auto mt-2 hidden max-w-2xl text-[11px] text-slate-400 sm:block'>Press Enter to send. Use Shift + Enter for a new line.</p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Message
