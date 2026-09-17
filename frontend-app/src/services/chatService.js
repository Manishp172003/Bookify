const API_BASE_URL = "http://localhost:5000/api/chat";

/**
 * Chat Service to interact with the backend persistent chat endpoints
 */
export const chatService = {
  /**
   * Fetch all historical messages for a conversation from MongoDB
   */
  async getHistory(conversationId) {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn("[chatService] getHistory error:", err.message);
      return [];
    }
  },

  /**
   * Fetch all conversation summaries
   */
  async getConversations(userId, email) {
    try {
      const query = new URLSearchParams();
      if (userId) query.append("userId", userId);
      if (email) query.append("email", email);

      const res = await fetch(`${API_BASE_URL}/conversations?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn("[chatService] getConversations error:", err.message);
      return [];
    }
  },

  /**
   * Post a new message to MongoDB
   */
  async sendMessage(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send message via API");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[chatService] sendMessage error:", err.message);
      return null;
    }
  },

  /**
   * Mark all messages in a conversation as read in MongoDB
   */
  async markRead(conversationId, userId) {
    try {
      await fetch(`${API_BASE_URL}/read/${conversationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.warn("[chatService] markRead error:", err.message);
    }
  },
};
