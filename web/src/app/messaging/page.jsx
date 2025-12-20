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
import Footer from "@/components/Footer/Footer";

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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!isAuthenticated || !token) return;
    
    try {
      setLoading(true);
      const apiCall = isOrganizer ? GetConversationsOrganizerApi : GetConversationsApi;
      const response = await apiCall({ page: 1, limit: 50 });
      
      // Handle different response formats
      if (response && (response.status === 1 || response.status === true)) {
        // Response format: { status: 1, data: { conversations: [...] } }
        const conversations = response.data?.conversations || response.conversations || [];
        setConversations(Array.isArray(conversations) ? conversations : []);
      } else if (Array.isArray(response)) {
        // Direct array response
        setConversations(response);
      } else if (response?.data && Array.isArray(response.data)) {
        // Response format: { data: [...] }
        setConversations(response.data);
      } else {
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
      
      // Check if this is a group chat
      const isGroupChat = selectedConversation.is_group === true;
      
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
        return;
      }

      if (!isGroupChat && !receiverId) {
        toast.error(t("messaging.failedToSend") || "Failed to send message: Missing conversation data");
        return;
      }

      const payload = {
        event_id: eventId,
        message: messageInput.trim() || "",
        is_group_chat: isGroupChat
      };

      // Only add receiver_id for one-on-one chats
      if (!isGroupChat && receiverId) {
        payload.receiver_id = receiverId;
      }

      let response;
      
      // If file is selected, use attachment endpoint
      if (selectedFile) {
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
        
        // Scroll to bottom after sending
        setTimeout(() => scrollToBottom(), 100);
      } else {
        toast.error(response?.message || t("messaging.failedToSend") || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
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

  // Poll for new messages every 5 seconds
  useEffect(() => {
    if (!selectedConversation?._id) return;
    
    const interval = setInterval(() => {
      fetchMessages(selectedConversation._id);
    }, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?._id, isOrganizer]);

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
            {t("events.loginToViewProfile")}
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
      {isOrganizer && <HostNavbar />}
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
                          <div className="flex-shrink-0">
                            {isGroupChat ? (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#a797cc] to-orange-600 flex items-center justify-center">
                                <Icon icon="lucide:users" className="h-6 w-6 text-white" />
                              </div>
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
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#a797cc] to-orange-600 flex items-center justify-center">
                              <Icon icon="lucide:users" className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-gray-900">
                                  {selectedConversation.group_name || `${selectedConversation.event_id?.event_name} - Group Chat`}
                                </h2>
                                {selectedConversation.status === 'closed' && (
                                  <Icon icon="lucide:lock" className="h-4 w-4 text-gray-400" title="Group chat closed" />
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
                                src={
                                  isOrganizer
                                    ? selectedConversation.user_id?.profile_image || "/assets/images/user-avatar.png"
                                    : selectedConversation.organizer_id?.profile_image || "/assets/images/user-avatar.png"
                                }
                                alt="User"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
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
                          const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                          const isImage = msg.message_type === 'image' && msg.attachment_url;
                          const isFile = msg.message_type === 'file' && msg.attachment_url;
                          
                          return (
                            <div
                              key={msg._id}
                              className={`flex items-end gap-2 ${isSender ? "justify-end" : "justify-start"}`}
                            >
                                  {!isSender && (
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300">
                                  {showAvatar && (
                                    <Image
                                      src={(() => {
                                        const getImageUrl = (imgPath) => {
                                          if (!imgPath) return "/assets/images/user-avatar.png";
                                          if (imgPath.includes("http://") || imgPath.includes("https://")) return imgPath;
                                          if (imgPath.startsWith("/uploads/")) {
                                            const apiBase = "http://localhost:3434";
                                            return `${apiBase}${imgPath}`;
                                          }
                                          return "/assets/images/user-avatar.png";
                                        };
                                        const profileImg = isOrganizer
                                          ? selectedConversation.user_id?.profile_image
                                          : selectedConversation.organizer_id?.profile_image;
                                        return getImageUrl(profileImg);
                                      })()}
                                      alt="User"
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = "/assets/images/user-avatar.png";
                                      }}
                                    />
                                  )}
                                </div>
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
                                        alt="Shared image"
                                        width={300}
                                        height={300}
                                        className="max-w-full h-auto rounded-lg cursor-pointer"
                                        onClick={() => window.open(msg.attachment_url, '_blank')}
                                      />
                                      {msg.message && (
                                        <p className="text-sm mt-2 px-2 pb-2">{msg.message}</p>
                                      )}
                                    </div>
                                  ) : isFile && msg.attachment_url ? (
                                    <div className="flex items-center gap-2">
                                      <Icon icon="lucide:file" className="h-5 w-5" />
                                      <a
                                        href={msg.attachment_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm underline hover:opacity-80"
                                      >
                                        {msg.message || "Download file"}
                                      </a>
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
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            className="hidden"
                            id="file-input"
                          />
                          <label
                            htmlFor="file-input"
                            className="p-2 text-gray-600 hover:text-[#a797cc] cursor-pointer transition-colors"
                            title="Attach file"
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
