import { createSlice } from "@reduxjs/toolkit";

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    open: false,
    messages: [
      {
        sender: "bot",
        text: "Hi! Ask me anything about money, investments, or budgeting.",
      },
    ],
  },

  reducers: {
    toggleChatbot: (state) => {
      state.open = !state.open;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { toggleChatbot, addMessage } = chatbotSlice.actions;
export default chatbotSlice.reducer;
