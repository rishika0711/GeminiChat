export interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
  cca2: string;
}

export interface User {
  id: string;
  phone: string;
  country: string;
  isAuthenticated: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
  chatroomId: string;
}

export interface Chatroom {
  id: string;
  title: string;
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  countries: Country[];
  selectedCountry: Country | null;
  otpSent: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setCountries: (countries: Country[]) => void;
  setSelectedCountry: (country: Country | null) => void;
  setOtpSent: (sent: boolean) => void;
  logout: () => void;
}

export interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  messages: Message[];
  isTyping: boolean;
  searchQuery: string;
  setChatrooms: (chatrooms: Chatroom[]) => void;
  setCurrentChatroom: (chatroom: Chatroom | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (typing: boolean) => void;
  setSearchQuery: (query: string) => void;
  addChatroom: (chatroom: Chatroom) => void;
  deleteChatroom: (chatroomId: string) => void;
  loadMoreMessages: (chatroomId: string) => Promise<void>;
}

export interface UIState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}