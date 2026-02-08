"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import useAuthStore from "@/store/useAuthStore";
import { 
  GetConversationsApi, 
  GetMessagesApi, 
  SendMessageApi,
  SendMessageWithAttachmentApi,
  GetConversationsOrganizerApi,
  GetMessagesOrganizerApi,
  SendMessageOrganizerApi,
  SendMessageWithAttachmentOrganizerApi,
  GetGroupChatApi,
  GetGroupChatOrganizerApi
} from "@/app/api/messaging/apis";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/Header/Header";
import HostNavbar from "@/components/Header/HostNavbar";
import GuestNavbar from "@/components/Header/GuestNavbar";
import Footer from "@/components/Footer/Footer";
import { BASE_API_URL } from "@/until";

export default function MessagingPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { token, user, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const eventIdFromUrl = searchParams?.get('event_id');
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const isOrganizer = user?.role === 2;

  // Track if user is at bottom and initial load
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const previousMessagesLengthRef = useRef(0);

  // Auto-scroll to bottom only when:
  // 1. New messages arrive (not initial load)
  // 2. User is already at the bottom
  const scrollToBottom = (force = false) => {
    if (force || (isAtBottom && !isInitialLoad)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Track scroll position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 100; // 100px from bottom
      setIsAtBottom(scrollHeight - scrollTop - clientHeight < threshold);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversation]);

  // Handle message changes - only scroll if new messages added
  useEffect(() => {
    const currentLength = messages.length;
    const previousLength = previousMessagesLengthRef.current;
    const container = messagesContainerRef.current;
    
    // On initial load, scroll to bottom once but with delay to ensure DOM is ready
    if (isInitialLoad && currentLength > 0 && container) {
      const timer = setTimeout(() => {
        // Direct scroll to bottom without smooth behavior for initial load
        container.scrollTop = container.scrollHeight;
        setIsInitialLoad(false);
      }, 500); // Increased delay to ensure messages are rendered
      return () => clearTimeout(timer);
    } 
    // If new messages added (not removed), scroll if at bottom
    else if (currentLength > previousLength && !isInitialLoad && isAtBottom && container) {
      const timer = setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
      return () => clearTimeout(timer);
    }
    
    previousMessagesLengthRef.current = currentLength;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isInitialLoad]);

  // Reset initial load when conversation changes
  useEffect(() => {
    setIsInitialLoad(true);
    previousMessagesLengthRef.current = 0;
  }, [selectedConversation?._id]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      setLoading(true);
      const apiCall = isOrganizer ? GetConversationsOrganizerApi : GetConversationsApi;
      // Increased limit to fetch all conversations including all group chats
      const response = await apiCall({ page: 1, limit: 200 });
      
      // Handle different response formats
      if (response && (response.status === 1 || response.status === true)) {
        // Response format: { status: 1, data: { conversations: [...] } }
        const conversations = response.data?.conversations || response.conversations || [];
        const conversationsArray = Array.isArray(conversations) ? conversations : [];
        console.log(`[FRONTEND] Fetched ${conversationsArray.length} conversations (${conversationsArray.filter(c => c.is_group).length} group chats)`);
        setConversations(conversationsArray);
      } else if (Array.isArray(response)) {
        // Direct array response
        console.log(`[FRONTEND] Fetched ${response.length} conversations (direct array)`);
        setConversations(response);
      } else if (response?.data && Array.isArray(response.data)) {
        // Response format: { data: [...] }
        console.log(`[FRONTEND] Fetched ${response.data.length} conversations (data array)`);
        setConversations(response.data);
      } else {
        console.warn('[FRONTEND] Unexpected response format:', response);
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error(t("messaging.failedToLoad") || "Failed to load conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    
    try {
      setMessagesLoading(true);
      const apiCall = isOrganizer ? GetMessagesOrganizerApi : GetMessagesApi;
      const response = await apiCall({ 
        conversation_id: conversationId,
        page: 1,
        limit: 100
      });
      
      // Handle different response formats
      if (response && (response.status === 1 || response.status === true)) {
        // Response format: { status: 1, data: { messages: [...], conversation: {...} } }
        const messages = response.data?.messages || response.messages || [];
        const conversation = response.data?.conversation || response.conversation || selectedConversation;
        setMessages(Array.isArray(messages) ? messages : []);
        if (conversation) {
          setSelectedConversation(conversation);
        }
      } else if (Array.isArray(response)) {
        // Direct array response
        setMessages(response);
      } else if (response?.data) {
        // Response format: { data: { messages: [...] } }
        setMessages(Array.isArray(response.data.messages) ? response.data.messages : []);
        if (response.data.conversation) {
          setSelectedConversation(response.data.conversation);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(t("messaging.failedToLoadMessages") || "Failed to load messages");
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!messageInput.trim() && !selectedFile) || !selectedConversation) return;
    
    try {
      setSending(true);
      
      // Check if this is a group chat (handle various truthy values)
      // Also check if conversation has participants array (indicates group chat)
      const isGroupChat = selectedConversation.is_group === true || 
                         selectedConversation.is_group === 1 || 
                         selectedConversation.is_group === '1' || 
                         selectedConversation.is_group === 'true' ||
                         (selectedConversation.participants && Array.isArray(selectedConversation.participants) && selectedConversation.participants.length > 0);
      
      // Debug logging
      console.log('[MESSAGING] Group chat detection:', {
        is_group: selectedConversation.is_group,
        is_group_type: typeof selectedConversation.is_group,
        hasParticipants: !!(selectedConversation.participants && Array.isArray(selectedConversation.participants)),
        participantsCount: selectedConversation.participants?.length || 0,
        isGroupChat
      });
      
      // Safely extract IDs with fallbacks
      const eventId = selectedConversation.event_id?._id || selectedConversation.event_id;
      
      // For group chats, receiver_id is not needed
      let receiverId = null;
      if (!isGroupChat) {
        receiverId = isOrganizer 
          ? (selectedConversation.user_id?._id || selectedConversation.user_id)
          : (selectedConversation.organizer_id?._id || selectedConversation.organizer_id);
      }

      if (!eventId) {
        toast.error(t("messaging.failedToSend") || "Failed to send message: Missing event ID");
        setSending(false);
        return;
      }

      // For group chats, receiver_id is not required
      // For one-on-one chats, receiver_id is required
      if (!isGroupChat && !receiverId) {
        toast.error(t("messaging.receiverIdRequired") || "Receiver ID is required for one-on-one conversations");
        setSending(false);
        return;
      }

      const payload = {
        event_id: eventId,
        message: messageInput.trim() || "",
        is_group_chat: isGroupChat ? "true" : "false" // Send as string for FormData compatibility
      };
      
      // Debug: Log payload before sending
      console.log('[MESSAGING] Payload for file attachment:', {
        ...payload,
        isGroupChat,
        selectedConversationIsGroup: selectedConversation.is_group,
        hasReceiverId: !!receiverId
      });

      // Only add receiver_id for one-on-one chats
      if (!isGroupChat && receiverId) {
        payload.receiver_id = receiverId;
      }

      let response;
      
      // If file is selected, use attachment endpoint
      if (selectedFile) {
        // Debug logging
        console.log('[MESSAGING] Sending file attachment:', {
          isGroupChat,
          event_id: eventId,
          receiver_id: receiverId,
          payload,
          selectedFile: {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size
          }
        });
        
        const apiCall = isOrganizer ? SendMessageWithAttachmentOrganizerApi : SendMessageWithAttachmentApi;
        response = await apiCall(payload, selectedFile);
      } else {
        // Regular text message
        const apiCall = isOrganizer ? SendMessageOrganizerApi : SendMessageApi;
        response = await apiCall(payload);
      }
      
      if (response && (response.status === 1 || response.status === true)) {
        // Add message to local state immediately
        const newMessage = response.data?.message || response.message || {
          _id: Date.now().toString(),
          message: messageInput.trim() || (selectedFile?.type.startsWith('image/') ? '📷 Image' : '📎 File'),
          sender_id: user._id,
          sender_role: isOrganizer ? 2 : 1,
          message_type: selectedFile ? (selectedFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
          attachment_url: selectedFile ? filePreview : null,
          createdAt: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput("");
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Update conversation's last message
        const lastMessageText = messageInput.trim() || (selectedFile?.type.startsWith('image/') ? '📷 Image' : '📎 File');
        setConversations(prev => 
          prev.map(conv => 
            conv._id === selectedConversation._id
              ? { ...conv, last_message: lastMessageText, last_message_at: new Date() }
              : conv
          )
        );
        
        // Scroll to bottom after sending (force scroll)
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 200);
      } else {
        toast.error(response?.message || t("messaging.failedToSend") || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error.response?.data?.message || error.message || t("messaging.failedToSend") || "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, isOrganizer]);

  // Auto-select group chat if event_id is in URL
  useEffect(() => {
    if (eventIdFromUrl && conversations.length > 0 && !selectedConversation) {
      // Find group chat for this event
      const groupChat = conversations.find(conv => 
        conv.is_group === true && 
        (conv.event_id?._id === eventIdFromUrl || conv.event_id === eventIdFromUrl)
      );
      
      if (groupChat) {
        setSelectedConversation(groupChat);
        fetchMessages(groupChat._id);
      } else {
        // Try to fetch group chat directly
        const fetchGroupChat = async () => {
          try {
            const apiCall = isOrganizer ? GetGroupChatOrganizerApi : GetGroupChatApi;
            const response = await apiCall(eventIdFromUrl);
            if (response && (response.status === 1 || response.status === true)) {
              const groupChat = response.data?.conversation || response.conversation;
              if (groupChat) {
                setSelectedConversation(groupChat);
                fetchMessages(groupChat._id);
              }
            }
          } catch (error) {
            console.error("Error fetching group chat:", error);
          }
        };
        fetchGroupChat();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIdFromUrl, conversations, isOrganizer]);

  // Poll for new messages every 3 seconds (real-time refresh)
  useEffect(() => {
    if (!selectedConversation?._id || !isAuthenticated || messagesLoading) return;
    
    const interval = setInterval(async () => {
      try {
        const apiCall = isOrganizer ? GetMessagesOrganizerApi : GetMessagesApi;
        const response = await apiCall({ 
          conversation_id: selectedConversation._id,
          page: 1,
          limit: 100
        });
        
        if (response && (response.status === 1 || response.status === true)) {
          const newMessages = response.data?.messages || response.messages || [];
          
          // Only update if messages actually changed (check by IDs or length)
          if (Array.isArray(newMessages)) {
            const currentMessageIds = new Set(messages.map(m => m._id?.toString()));
            const newMessageIds = new Set(newMessages.map(m => m._id?.toString()));
            
            // Check if there are any new messages or if attachment URLs changed
            const hasNewMessages = newMessages.some(m => !currentMessageIds.has(m._id?.toString()));
            const hasDifferentLength = newMessages.length !== messages.length;
            
            // Check if any existing message's attachment_url was updated (for real-time file sharing)
            const hasUpdatedAttachments = messages.some(currentMsg => {
              const newMsg = newMessages.find(m => m._id?.toString() === currentMsg._id?.toString());
              return newMsg && newMsg.attachment_url !== currentMsg.attachment_url;
            });
            
            if (hasNewMessages || hasDifferentLength || hasUpdatedAttachments) {
              setMessages(newMessages);
            }
          }
        }
      } catch (error) {
        // Silently handle errors in polling to avoid spam
        console.error("Error polling messages:", error);
      }
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?._id, isOrganizer, isAuthenticated, messagesLoading]);

  // Poll for new conversations every 5 seconds (real-time refresh for new groups)
  // This ensures users see new group chats immediately after payment completion
  useEffect(() => {
    if (!isAuthenticated || !token || loading) return;
    
    const interval = setInterval(async () => {
      try {
        const apiCall = isOrganizer ? GetConversationsOrganizerApi : GetConversationsApi;
        // Increased limit to fetch all conversations including all group chats
        const response = await apiCall({ page: 1, limit: 200 });
        
        if (response && (response.status === 1 || response.status === true)) {
          const newConversations = response.data?.conversations || response.conversations || [];
          
          // Only update if conversations actually changed
          if (Array.isArray(newConversations)) {
            const currentConvIds = new Set(conversations.map(c => c._id?.toString()));
            const newConvIds = new Set(newConversations.map(c => c._id?.toString()));
            
            // Check if there are any new conversations (e.g., new group chat after payment)
            const hasNewConversations = newConversations.some(c => !currentConvIds.has(c._id?.toString()));
            const hasDifferentLength = newConversations.length !== conversations.length;
            
            // Also check if participant count changed in existing group chats
            const participantCountChanged = conversations.some(conv => {
              if (!conv.is_group) return false;
              const newConv = newConversations.find(c => c._id?.toString() === conv._id?.toString());
              if (!newConv) return false;
              return (newConv.participants?.length || 0) !== (conv.participants?.length || 0);
            });
            
            // Check if user was added to a group chat they weren't in before
            let userAddedToGroup = false;
            if (!isOrganizer) {
              const newGroupChats = newConversations.filter(c => 
                c.is_group === true && 
                !currentConvIds.has(c._id?.toString())
              );
              if (newGroupChats.length > 0) {
                userAddedToGroup = true;
                // Show toast notification for new group chat
                newGroupChats.forEach(groupChat => {
                  const eventName = groupChat.event_id?.event_name || "Event";
                  toast.success(
                    t("messaging.addedToGroupChat", `You've been added to the group chat for "${eventName}"!`),
                    { autoClose: 5000 }
                  );
                });
              }
            }
            
            if (hasNewConversations || hasDifferentLength || participantCountChanged || userAddedToGroup) {
              setConversations(newConversations);
              
              // If a new group chat was added and we have event_id in URL, auto-select it
              if (eventIdFromUrl && hasNewConversations) {
                const newGroupChat = newConversations.find(conv => 
                  conv.is_group === true && 
                  (conv.event_id?._id === eventIdFromUrl || conv.event_id === eventIdFromUrl) &&
                  !selectedConversation
                );
                if (newGroupChat) {
                  setSelectedConversation(newGroupChat);
                  fetchMessages(newGroupChat._id);
                }
              }
              
              // Update selected conversation if it exists in new list (to get updated participant count)
              if (selectedConversation) {
                const updatedConv = newConversations.find(c => c._id?.toString() === selectedConversation._id?.toString());
                if (updatedConv) {
                  setSelectedConversation(updatedConv);
                }
              }
            }
          }
        }
      } catch (error) {
        // Silently handle errors in polling to avoid spam
        console.error("Error polling conversations:", error);
      }
    }, 5000); // Poll every 5 seconds for conversations (less frequent than messages)
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, isOrganizer, loading, eventIdFromUrl, selectedConversation]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const eventName = conv.event_id?.event_name?.toLowerCase() || "";
    const otherUserName = isOrganizer
      ? `${conv.user_id?.first_name} ${conv.user_id?.last_name}`.toLowerCase()
      : `${conv.organizer_id?.first_name} ${conv.organizer_id?.last_name}`.toLowerCase();
    
    return eventName.includes(searchLower) || otherUserName.includes(searchLower);
  });

  // Format time
  const formatMessageTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "";
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-[#FFF0F1] py-16 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
          <Icon icon="lucide:lock" className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t("events.loginRequired")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t("Login To View Profile")}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-[#a797cc] text-white hover:bg-[#8ba179] transition-colors"
          >
            {t("header.tab5")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Header />
      {isOrganizer ? <HostNavbar /> : <GuestNavbar search={""} setSearch={() => {}} setPage={() => {}} />}
      <section className="min-h-screen bg-white py-6">
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("header.messaging")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("messaging.description")}
          </p>
        </div>

        {/* Messaging Container */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <div className="flex h-full">
            {/* Left Sidebar - Conversations List */}
            <div className={`w-full md:w-1/3 border-${isRTL ? "l" : "r"} border-gray-200 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Icon 
                    icon="lucide:search" 
                    className={`absolute top-3 ${isRTL ? "right-3" : "left-3"} h-5 w-5 text-gray-400`} 
                  />
                  <input
                    type="text"
                    placeholder={t("messaging.searchConversations")}
                    className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc]`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Icon icon="lucide:message-circle" className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      {t("messaging.noConversations")}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t("messaging.startChatting")}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const isGroupChat = conv.is_group === true;
                    const otherUser = isOrganizer ? conv.user_id : conv.organizer_id;
                    const unreadCount = isOrganizer ? conv.unread_count_organizer : conv.unread_count_user;
                    const isActive = selectedConversation?._id === conv._id;
                    const isClosed = conv.status === 'closed' || conv.closed_at;
                    
                    return (
                      <div
                        key={conv._id}
                        onClick={() => {
                          setSelectedConversation(conv);
                          fetchMessages(conv._id);
                        }}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          isActive ? "bg-[#fff4ec]" : "hover:bg-gray-50"
                        } ${isClosed ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Event Image or Group Icon */}
                          <div className="flex-shrink-0 relative">
                            {isGroupChat ? (
                              conv.event_id?.event_image ? (
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 relative">
                                  <Image
                                    src={conv.event_id.event_image}
                                    alt={conv.event_id?.event_name || "Event Group"}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-br from-[#a797cc]/80 to-orange-600/80 flex items-center justify-center" style={{ display: 'none' }}>
                                    <Icon icon="lucide:users" className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-orange-600 flex items-center justify-center shadow-md">
                                  <Icon icon="lucide:users" className="h-6 w-6 text-white" />
                                </div>
                              )
                            ) : (
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                                <Image
                                  src={conv.event_id?.event_image || "/assets/images/event-placeholder.jpg"}
                                  alt={conv.event_id?.event_name || "Event"}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* Conversation Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {isGroupChat 
                                  ? (conv.group_name || `${conv.event_id?.event_name} - Group Chat`)
                                  : `${otherUser?.first_name} ${otherUser?.last_name}`
                                }
                              </h3>
                              <div className="flex items-center gap-2">
                                {isClosed && (
                                  <Icon icon="lucide:lock" className="h-4 w-4 text-gray-400" />
                                )}
                                {isGroupChat && (
                                  <Icon icon="lucide:users" className="h-4 w-4 text-[#a797cc]" />
                                )}
                                {unreadCount > 0 && (
                                  <span className="bg-[#a797cc] text-white text-xs rounded-full px-2 py-0.5">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              {conv.event_id?.event_name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.last_message || t("messaging.noMessages")}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatMessageTime(conv.last_message_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Side - Chat Window */}
            <div className={`flex-1 flex flex-col ${selectedConversation ? "flex" : "hidden md:flex"}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button for mobile */}
                        <button
                          onClick={() => setSelectedConversation(null)}
                          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Icon icon={isRTL ? "lucide:chevron-right" : "lucide:chevron-left"} className="h-5 w-5" />
                        </button>

                        {/* Group chat or user info */}
                        {selectedConversation.is_group ? (
                          <>
                            {selectedConversation.event_id?.event_image ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 relative">
                                <Image
                                  src={selectedConversation.event_id.event_image}
                                  alt={selectedConversation.event_id?.event_name || "Event Group"}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-[#a797cc]/80 to-orange-600/80 flex items-center justify-center" style={{ display: 'none' }}>
                                  <Icon icon="lucide:users" className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a797cc] to-orange-600 flex items-center justify-center shadow-md">
                                <Icon icon="lucide:users" className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-gray-900">
                                  {selectedConversation.group_name || `${selectedConversation.event_id?.event_name} - Group Chat`}
                                </h2>
                                {selectedConversation.status === 'closed' && (
                                  <Icon icon="lucide:lock" className="h-4 w-4 text-gray-400" title={t("messaging.groupChatClosed") || "Group chat closed"} />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {selectedConversation.participants?.length || 0} {selectedConversation.participants?.length === 1 ? 'participant' : 'participants'}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              <Image
                                src={(() => {
                                  const getImageUrl = (imgPath) => {
                                    if (!imgPath) return "/assets/images/user-avatar.png";
                                    if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                    if (imgPath.includes("res.cloudinary.com")) return imgPath;
                                    const apiBase = BASE_API_URL.replace('/api/', '');
                                    if (imgPath.startsWith("/uploads/")) return `${apiBase}${imgPath}`;
                                    if (imgPath.startsWith("uploads/")) return `${apiBase}/${imgPath}`;
                                    if (imgPath.startsWith("/")) return `${apiBase}${imgPath}`;
                                    return "/assets/images/user-avatar.png";
                                  };
                                  const profileImg = isOrganizer
                                    ? selectedConversation.user_id?.profile_image
                                    : selectedConversation.organizer_id?.profile_image;
                                  return getImageUrl(profileImg);
                                })()}
                                alt="User"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/assets/images/user-avatar.png";
                                }}
                              />
                            </div>
                            <div>
                              <h2 className="font-semibold text-gray-900">
                                {isOrganizer
                                  ? `${selectedConversation.user_id?.first_name} ${selectedConversation.user_id?.last_name}`
                                  : `${selectedConversation.organizer_id?.first_name} ${selectedConversation.organizer_id?.last_name}`}
                              </h2>
                              <p className="text-xs text-gray-500">
                                {selectedConversation.event_id?.event_name}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Event link */}
                      <Link
                        href={`/events/${selectedConversation.event_id?._id}`}
                        className="text-sm text-[#a797cc] hover:underline"
                      >
                        {t("messaging.viewEvent")}
                      </Link>
                    </div>
                  </div>

                  {/* Messages Container */}
                  <div 
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                  >
                    {messagesLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a797cc]"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Icon icon="lucide:message-square" className="h-16 w-16 text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          {t("messaging.noMessagesYet")}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          {t("messaging.sendFirstMessage")}
                        </p>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg, index) => {
                          const isSender = (isOrganizer && msg.sender_role === 2) || (!isOrganizer && msg.sender_role === 1);
                          const showAvatar = index === 0 || 
                            (messages[index - 1].sender_id?.toString() !== msg.sender_id?.toString() || 
                             messages[index - 1].sender_role !== msg.sender_role);
                          const isImage = msg.message_type === 'image' && msg.attachment_url;
                          const isFile = msg.message_type === 'file' && msg.attachment_url;
                          
                          // Get sender profile image - prioritize from message sender, fallback to conversation
                          const getSenderProfileImage = () => {
                            // First try to get from populated sender object (from backend API) - this is the most reliable source
                            if (msg.sender) {
                              // Check multiple possible paths for profile_image
                              const senderProfile = 
                                msg.sender.profile_image || 
                                msg.sender?.profile_image ||
                                (msg.sender && typeof msg.sender === 'object' && msg.sender.profile_image);
                              
                              // Only return if profile_image exists and is not empty/null
                              if (senderProfile && senderProfile !== null && senderProfile !== '' && senderProfile !== 'null' && senderProfile !== 'undefined') {
                                console.log("[MESSAGING] Using sender profile image from msg.sender:", senderProfile);
                                return senderProfile;
                              } else {
                                console.log("[MESSAGING] msg.sender exists but profile_image is empty/null:", {
                                  sender: msg.sender,
                                  profile_image: senderProfile
                                });
                              }
                            } else {
                              console.log("[MESSAGING] msg.sender not found for message:", {
                                msg_id: msg._id,
                                sender_id: msg.sender_id,
                                sender_role: msg.sender_role
                              });
                            }
                            
                            // For group chats, try to get from participants list
                            if (selectedConversation.is_group && Array.isArray(selectedConversation.participants)) {
                              const participant = selectedConversation.participants.find(
                                p => {
                                  const participantId = p.user_id?._id || p.user_id;
                                  const senderId = msg.sender_id?._id || msg.sender_id;
                                  return participantId?.toString() === senderId?.toString() && p.role === msg.sender_role;
                                }
                              );
                              
                              if (participant) {
                                console.log("[MESSAGING] Found participant:", participant);
                                
                                // Handle different participant.user_id structures
                                let participantProfile = null;
                                
                                if (participant.user_id) {
                                  // If user_id is populated (object)
                                  if (typeof participant.user_id === 'object' && participant.user_id !== null) {
                                    participantProfile = participant.user_id.profile_image || participant.user_id?.profile_image;
                                  } 
                                  // If user_id is just an ID string, we can't get profile from it
                                  // But this shouldn't happen if backend is populating correctly
                                }
                                
                                // Only return if profile_image exists and is not empty/null
                                if (participantProfile && participantProfile !== null && participantProfile !== '' && participantProfile !== 'null' && participantProfile !== 'undefined') {
                                  console.log("[MESSAGING] Using participant profile image:", participantProfile);
                                  return participantProfile;
                                } else {
                                  console.log("[MESSAGING] Participant found but profile_image is empty/null:", {
                                    participant,
                                    user_id: participant.user_id,
                                    user_id_type: typeof participant.user_id,
                                    profile_image: participantProfile
                                  });
                                }
                              } else {
                                console.log("[MESSAGING] Participant not found for sender:", {
                                  sender_id: msg.sender_id,
                                  sender_role: msg.sender_role,
                                  participants: selectedConversation.participants.map(p => ({
                                    id: p.user_id?._id || p.user_id,
                                    role: p.role
                                  }))
                                });
                              }
                            }
                            
                            // Fallback to conversation user/organizer profile (for one-on-one chats)
                            if (!selectedConversation.is_group) {
                              if (msg.sender_role === 1) {
                                const userProfile = selectedConversation.user_id?.profile_image;
                                if (userProfile && userProfile !== null && userProfile !== '' && userProfile !== 'null' && userProfile !== 'undefined') {
                                  console.log("[MESSAGING] Using conversation user profile image:", userProfile);
                                  return userProfile;
                                }
                              } else if (msg.sender_role === 2) {
                                const organizerProfile = selectedConversation.organizer_id?.profile_image;
                                if (organizerProfile && organizerProfile !== null && organizerProfile !== '' && organizerProfile !== 'null' && organizerProfile !== 'undefined') {
                                  console.log("[MESSAGING] Using conversation organizer profile image:", organizerProfile);
                                  return organizerProfile;
                                }
                              }
                            }
                            
                            console.log("[MESSAGING] No valid profile image found for sender - will use default avatar");
                            return null; // Will fallback to default avatar in getImageUrl
                          };

                          const getImageUrl = (imgPath) => {
                            // Only use dummy image if absolutely no path is provided
                            if (!imgPath || imgPath === null || imgPath === '' || imgPath === 'null' || imgPath === 'undefined') {
                              console.log("[MESSAGING] No valid image path provided, using default avatar");
                              return "/assets/images/user-avatar.png";
                            }
                            
                            // Clean the path (remove any whitespace)
                            const cleanPath = String(imgPath).trim();
                            
                            if (!cleanPath || cleanPath === 'null' || cleanPath === 'undefined') {
                              console.log("[MESSAGING] Cleaned path is empty, using default avatar");
                              return "/assets/images/user-avatar.png";
                            }
                            
                            // If already absolute URL (http/https) - includes Cloudinary URLs
                            if (cleanPath.includes("http://") || cleanPath.includes("https://")) {
                              console.log("[MESSAGING] Using absolute URL:", cleanPath);
                              return cleanPath;
                            }
                            
                            // If Cloudinary URL format (res.cloudinary.com)
                            if (cleanPath.includes("res.cloudinary.com")) {
                              console.log("[MESSAGING] Using Cloudinary URL:", cleanPath);
                              return cleanPath;
                            }
                            
                            // Get API base URL (remove /api/ from BASE_API_URL to get base server URL)
                            const apiBase = BASE_API_URL.replace('/api/', '');
                            
                            // Handle relative paths - add API base URL
                            if (cleanPath.startsWith("/uploads/")) {
                              const fullUrl = `${apiBase}${cleanPath}`;
                              console.log("[MESSAGING] Constructed URL from /uploads/ path:", fullUrl);
                              return fullUrl;
                            }
                            
                            if (cleanPath.startsWith("uploads/")) {
                              const fullUrl = `${apiBase}/${cleanPath}`;
                              console.log("[MESSAGING] Constructed URL from uploads/ path:", fullUrl);
                              return fullUrl;
                            }
                            
                            // If path starts with /, try to construct full URL
                            if (cleanPath.startsWith("/")) {
                              const fullUrl = `${apiBase}${cleanPath}`;
                              console.log("[MESSAGING] Constructed URL from / path:", fullUrl);
                              return fullUrl;
                            }
                            
                            // If path doesn't start with /, try adding it
                            const fullUrl = `${apiBase}/${cleanPath}`;
                            console.log("[MESSAGING] Constructed URL from relative path:", fullUrl);
                            return fullUrl;
                          };
                          
                          return (
                            <div
                              key={msg._id || index}
                              className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
                            >
                              {!isSender && (
                                <>
                                  {showAvatar ? (
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                                      <img
                                        src={getImageUrl(getSenderProfileImage())}
                                        alt={msg.sender?.first_name || msg.sender?.last_name || "User"}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                          const currentSrc = e.target.src;
                                          console.log("[MESSAGING] Image load error for:", currentSrc);
                                          // Only use fallback if it's not already the fallback image
                                          if (!currentSrc.includes("user-avatar.png")) {
                                            console.log("[MESSAGING] Setting fallback avatar");
                                            e.target.src = "/assets/images/user-avatar.png";
                                          }
                                        }}
                                        onLoad={(e) => {
                                          console.log("[MESSAGING] Image loaded successfully:", e?.target?.src);
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 flex-shrink-0"></div>
                                  )}
                                </>
                              )}
                              
                              <div className={`max-w-[70%] ${isSender ? "order-first" : ""}`}>
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isSender
                                      ? "bg-[#a797cc] text-white"
                                      : "bg-white text-gray-900 border border-gray-200"
                                  } ${isImage ? "p-0 overflow-hidden" : ""}`}
                                >
                                  {isImage && msg.attachment_url ? (
                                    <div className="relative">
                                      <Image
                                        src={msg.attachment_url}
                                        alt={msg.message || "Shared image"}
                                        width={300}
                                        height={300}
                                        className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => window.open(msg.attachment_url, '_blank')}
                                        unoptimized={msg.attachment_url?.includes('cloudinary') || msg.attachment_url?.includes('http')}
                                        onError={(e) => {
                                          console.error("Failed to load image:", msg.attachment_url);
                                          e.target.src = "/assets/images/image-error.png";
                                        }}
                                      />
                                      {msg.message && (
                                        <p className={`text-sm mt-2 px-2 pb-2 ${isSender ? "text-white" : "text-gray-700"}`}>{msg.message}</p>
                                      )}
                                    </div>
                                  ) : isFile && msg.attachment_url ? (
                                    <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                                      <Icon icon="lucide:file" className="h-6 w-6 flex-shrink-0" />
                                      <a
                                        href={msg.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`text-sm underline hover:opacity-80 flex-1 truncate ${isSender ? "text-white" : "text-gray-700"}`}
                                        download
                                      >
                                        {msg.message || "Download file"}
                                      </a>
                                      <Icon icon="lucide:download" className="h-4 w-4 flex-shrink-0 opacity-70" />
                                    </div>
                                  ) : (
                                    <p className="text-sm">{msg.message}</p>
                                  )}
                                </div>
                                <p className={`text-xs text-gray-400 mt-1 ${isSender ? "text-right" : "text-left"}`}>
                                  {formatMessageTime(msg.createdAt)}
                                  {isSender && msg.isRead && " • " + t("messaging.read")}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {selectedConversation.status === 'closed' || selectedConversation.closed_at ? (
                      <div className="bg-gray-100 rounded-lg p-3 text-center">
                        <Icon icon="lucide:lock" className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          This group chat has been closed. Messages can no longer be sent.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="space-y-2">
                        {/* File Preview */}
                        {filePreview && (
                          <div className="relative inline-block">
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#a797cc]">
                              <Image
                                src={filePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <Icon icon="lucide:x" className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {selectedFile && !filePreview && (
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                            <Icon icon="lucide:file" className="h-5 w-5 text-gray-600" />
                            <span className="text-sm text-gray-700 flex-1 truncate">{selectedFile.name}</span>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Icon icon="lucide:x" className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-end gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                            className="hidden"
                            id="file-input"
                          />
                          <label
                            htmlFor="file-input"
                            className="p-2 text-gray-600 hover:text-[#a797cc] cursor-pointer transition-colors"
                            title={t("messaging.attachFile") || "Attach file"}
                          >
                            <Icon icon="lucide:paperclip" className="h-5 w-5" />
                          </label>
                          
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                              }
                            }}
                            placeholder={t("messaging.typeMessage")}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a797cc] resize-none"
                            rows={1}
                            style={{ minHeight: "40px", maxHeight: "120px" }}
                          />
                          <button
                            type="submit"
                            disabled={(!messageInput.trim() && !selectedFile) || sending}
                            className="px-4 py-2 bg-[#a797cc] text-white rounded-lg hover:bg-[#8ba179] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sending ? (
                              <Icon icon="lucide:loader" className="h-5 w-5 animate-spin" />
                            ) : (
                              <Icon icon="lucide:send" className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Icon icon="lucide:messages-square" className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {t("messaging.selectConversation")}
                  </h3>
                  <p className="text-gray-500">
                    {t("messaging.selectConversationDesc")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}
