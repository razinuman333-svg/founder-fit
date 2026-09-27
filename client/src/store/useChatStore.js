import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

let messageRequestSequence = 0;

async function getAuthConfig() {
  const getToken = useAuthStore.getState().getToken;
  if (!getToken) throw new Error("Please sign in to use messages");
  const token = await getToken();
  return { headers: { Authorization: `Bearer ${token}` } };
}

function appendUnique(messages, message) {
  if (messages.some((item) => item._id === message._id)) return messages;
  return [...messages, message].sort((first, second) => (
    new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  ));
}

export const useChatStore = create(
  persist(
    (set, get) => ({
      users: [],
      conversations: [],
      messages: [],
      selectedUser: null,
      isConversationsLoading: false,
      isUsersLoading: false,
      isMessagesLoading: false,
      activeConversationId: null,
      searchQuery: "",
      composerText: "",
      isSoundEnabled: true,
      isSendingMedia: false,
      isSendingMessage: false,
      messageListener: null,

      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axios.get("/api/message/users", await getAuthConfig());
          set((state) => ({
            users: res.data.users,
            selectedUser: state.selectedUser
              ? res.data.users.find((user) => user._id === state.selectedUser._id) || state.selectedUser
              : null,
          }));
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || "Failed to load people");
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
          const res = await axios.get("/api/message/conversations", await getAuthConfig());
          set({ conversations: res.data });
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || "Failed to load conversations");
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      getMessages: async (userId) => {
        if (!userId) return;
        const requestSequence = ++messageRequestSequence;
        set({ isMessagesLoading: true });
        try {
          const res = await axios.get(`/api/message/${userId}`, await getAuthConfig());
          if (
            requestSequence === messageRequestSequence &&
            String(get().selectedUser?._id) === String(userId)
          ) {
            set((state) => ({
              messages: res.data.reduce(appendUnique, state.messages),
            }));
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
          if (requestSequence === messageRequestSequence) set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData, clearComposerText = null) => {
        const { selectedUser } = get();
        if (!selectedUser) return false;
        const receiverId = selectedUser._id;

        set({ isSendingMessage: true });
        try {
          const res = await axios.post(
            `/api/message/send/${receiverId}`,
            messageData,
            await getAuthConfig(),
          );
          if (String(get().selectedUser?._id) === String(receiverId)) {
            set((state) => ({
              messages: appendUnique(state.messages, res.data),
              composerText: clearComposerText !== null && state.composerText.trim() === clearComposerText
                ? ""
                : state.composerText,
            }));
          }
          get().getConversations();
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
          return false;
        } finally {
          set({ isSendingMessage: false });
        }
      },

      subscribeToMessages: (userId) => {
        if (!userId) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        const previousListener = get().messageListener;
        if (previousListener) socket.off("newMessage", previousListener);
        const listener = (newMessage) => {
          if (String(newMessage.receiverID) !== String(userId)) return;
          if (String(get().selectedUser?._id) === String(newMessage.senderID)) {
            set((state) => ({ messages: appendUnique(state.messages, newMessage) }));
          }
          get().getConversations();
        };
        socket.on("newMessage", listener);
        set({ messageListener: listener });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        const listener = get().messageListener;
        if (listener) socket?.off("newMessage", listener);
        set({ messageListener: null });
      },

      setSelectedUser: (selectedUser) => {
        ++messageRequestSequence;
        set({
          selectedUser,
          activeConversationId: selectedUser?._id || null,
          messages: [],
          composerText: "",
          isMessagesLoading: Boolean(selectedUser),
        });
        if (selectedUser) get().getMessages(selectedUser._id);
      },

      setActiveConversationId: (activeConversationId) => {
        const state = get();
        const selectedUser = state.users.find((user) => user._id === activeConversationId) ||
          state.conversations.find((user) => user._id === activeConversationId) || null;
        get().setSelectedUser(selectedUser);
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setComposerText: (composerText) => set({ composerText }),
      setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),
      clearChat: () => set({
        users: [],
        conversations: [],
        messages: [],
        selectedUser: null,
        activeConversationId: null,
        composerText: "",
      }),

      sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim();
        if (!conversationId || !messageText || String(get().selectedUser?._id) !== String(conversationId)) return false;

        return get().sendMessage({ text: messageText }, messageText);
      },

      sendMediaMessage: async ({ conversationId, file }) => {
        if (!conversationId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);

        set({ isSendingMedia: true });
        try {
          return await get().sendMessage(formData);
        } finally {
          set({ isSendingMedia: false });
        }
      },
    }),
    {
      name: "founderfit-storage",
      partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
    },
  ),
);