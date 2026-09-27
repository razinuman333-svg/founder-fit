import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { formatMessageTime } from '../lib/utils'
import useKeyboardSound from '../hooks/useKeyboardSound'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

function Avatar({ person, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      {person.avatar ? (
        <img className={`${sizeClass} rounded-full object-cover`} src={person.avatar} alt={person.name} />
      ) : (
        <span className={`${sizeClass} flex items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800`}>
          {person.name?.charAt(0) || '?'}
        </span>
      )}
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
        active ? 'bg-teal-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
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
  const [search, setSearch] = useState('')
  const messagesEndRef = useRef(null)
  const mediaInputRef = useRef(null)
  const { playRandomKeyStrokeSound } = useKeyboardSound()
  const authUser = useAuthStore((state) => state.authUser)
  const onlineUsers = useAuthStore((state) => state.onlineUsers)
  const socket = useAuthStore((state) => state.socket)
  const socketStatus = useAuthStore((state) => state.socketStatus)
  const users = useChatStore((state) => state.users)
  const conversations = useChatStore((state) => state.conversations)
  const messages = useChatStore((state) => state.messages)
  const selectedUser = useChatStore((state) => state.selectedUser)
  const composerText = useChatStore((state) => state.composerText)
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled)
  const isUsersLoading = useChatStore((state) => state.isUsersLoading)
  const isMessagesLoading = useChatStore((state) => state.isMessagesLoading)
  const isSendingMessage = useChatStore((state) => state.isSendingMessage)
  const isSendingMedia = useChatStore((state) => state.isSendingMedia)
  const getUsers = useChatStore((state) => state.getUsers)
  const getConversations = useChatStore((state) => state.getConversations)
  const setSelectedUser = useChatStore((state) => state.setSelectedUser)
  const setComposerText = useChatStore((state) => state.setComposerText)
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled)
  const sendTextMessage = useChatStore((state) => state.sendTextMessage)
  const sendMediaMessage = useChatStore((state) => state.sendMediaMessage)
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages)
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages)

  const people = useMemo(() => {
    const knownPeople = new Map()
    conversations.forEach((person) => knownPeople.set(person._id, person))
    users.forEach((person) => knownPeople.set(person._id, { ...knownPeople.get(person._id), ...person }))
    return [...knownPeople.values()].map((person) => ({
      ...person,
      online: onlineUsers.some((userId) => String(userId) === String(person._id)),
    }))
  }, [conversations, users, onlineUsers])

  const selectedPerson = people.find((person) => person._id === selectedUser?._id) || selectedUser
  const selectedId = selectedPerson?._id
  const recentConversations = conversations
    .map((conversation) => people.find((person) => person._id === conversation._id))
    .filter(Boolean)
  const availableUsers = useMemo(
    () => users
      .map((user) => people.find((person) => person._id === user._id))
      .filter((person) => person?.name?.toLowerCase().includes(search.toLowerCase())),
    [people, search, users],
  )

  useEffect(() => {
    if (!authUser) return
    getUsers()
    getConversations()
  }, [authUser, getConversations, getUsers])

  useEffect(() => {
    if (!authUser || !socket) return undefined
    subscribeToMessages(authUser._id)
    return unsubscribeFromMessages
  }, [authUser, socket, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, messages.length])

  const selectPerson = (person) => {
    setSelectedUser(person)
  }

  const sendMessage = () => selectedId && sendTextMessage(selectedId)

  const handleComposerKeyDown = (event) => {
    if (isSoundEnabled && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      playRandomKeyStrokeSound()
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const handleMediaSelection = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !selectedId) return
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Choose an image or video file')
      return
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error('Media must be 25 MB or smaller')
      return
    }
    await sendMediaMessage({ conversationId: selectedId, file })
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
                {recentConversations.map((person) => (
                  <PersonRow
                    key={person._id}
                    person={person}
                    active={person._id === selectedId}
                    preview={person.headline || 'Open conversation'}
                    onClick={() => selectPerson(person)}
                  />
                ))}
                {!conversations.length && !isUsersLoading && (
                  <p className='px-3 py-3 text-sm text-slate-500'>Your conversations will appear here.</p>
                )}
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
                  className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:bg-white focus:ring-2 focus:ring-teal-100'
                />
              </label>
              <div className='space-y-1'>
                {availableUsers.map((person) => (
                  <PersonRow key={person._id} person={person} active={person._id === selectedId} onClick={() => selectPerson(person)} />
                ))}
                {isUsersLoading && <p className='px-3 py-5 text-center text-sm text-slate-500'>Loading people...</p>}
                {!isUsersLoading && availableUsers.length === 0 && <p className='px-3 py-5 text-center text-sm text-slate-500'>No connected people found.</p>}
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
                  onClick={() => setSelectedUser(null)}
                  aria-label='Back to conversations'
                  className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:hidden'
                >
                  <ArrowLeft className='h-5 w-5' />
                </button>
                <Avatar person={selectedPerson} size='lg' />
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate font-heading text-base font-bold text-slate-900'>{selectedPerson.name}</h2>
                  <p className={`mt-0.5 text-xs ${selectedPerson.online ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {selectedPerson.online ? 'Online' : selectedPerson.headline || 'Connected'}
                  </p>
                </div>
                {socketStatus !== 'connected' && (
                  <span role='status' className='max-w-32 text-right text-xs text-amber-700'>
                    {socketStatus === 'error' ? 'Realtime connection failed' : 'Connecting to chat...'}
                  </span>
                )}
              </header>

              <div className='min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8'>
                <div className='mx-auto flex max-w-2xl flex-col gap-4'>
                  {isMessagesLoading && <p className='py-6 text-center text-sm text-slate-500'>Loading messages...</p>}
                  {!isMessagesLoading && messages.length === 0 && (
                    <p className='py-8 text-center text-sm text-slate-500'>No messages yet. Start the conversation.</p>
                  )}
                  {messages.map((message) => {
                    const isMine = String(message.senderID) === String(authUser?._id)
                    return (
                      <div key={message._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[84%] sm:max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                          {message.image && <img className='mb-2 max-h-80 rounded-lg object-contain' src={message.image} alt='Shared image' />}
                          {message.video && <video className='mb-2 max-h-80 rounded-lg' src={message.video} controls />}
                          {message.text && (
                            <div className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${isMine ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                              {message.text}
                            </div>
                          )}
                          <div className={`mt-1 flex items-center gap-1 px-1 text-[11px] text-slate-400 ${isMine ? 'flex-row-reverse' : ''}`}>
                            <span>{formatMessageTime(message.createdAt)}</span>
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
                <div className='mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-100'>
                  <input ref={mediaInputRef} type='file' accept='image/*,video/*' className='hidden' onChange={handleMediaSelection} />
                  <button type='button' aria-label='Attach an image or video' title='Attach an image or video' onClick={() => mediaInputRef.current?.click()} disabled={isSendingMedia} className='mb-0.5 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50'>
                    <Paperclip className='h-5 w-5' />
                  </button>
                  <textarea
                    value={composerText}
                    onChange={(event) => setComposerText(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows='1'
                    placeholder='Write a message...'
                    aria-label='Message text'
                    className='max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400'
                  />
                  <button
                    type='button'
                    onClick={() => setSoundEnabled(!isSoundEnabled)}
                    aria-label={isSoundEnabled ? 'Mute typing sounds' : 'Enable typing sounds'}
                    aria-pressed={isSoundEnabled}
                    title={isSoundEnabled ? 'Mute typing sounds' : 'Enable typing sounds'}
                    className='mb-0.5 rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-700'
                  >
                    {isSoundEnabled ? <Volume2 className='h-5 w-5' /> : <VolumeX className='h-5 w-5' />}
                  </button>
                  <button
                    type='submit'
                    disabled={!composerText.trim() || isSendingMessage}
                    aria-label='Send message'
                    className='mb-0.5 rounded-xl bg-primary p-2.5 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40'
                  >
                    <Send className='h-4 w-4' />
                  </button>
                </div>
                <p className='mx-auto mt-2 hidden max-w-2xl text-[11px] text-slate-400 sm:block'>
                  {isSendingMedia ? 'Uploading media...' : 'Press Enter to send. Use Shift + Enter for a new line.'}
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Message
