import axios from "axios";
import { getAccessToken } from "@/common/utils/cookies";
import { getRuntimeConfigSync } from "@/core/configs/runtime-config";

interface ChatbotRequest {
    message: string;
}

interface ChatbotResponse {
    chatbotReply: string;
}

const CHATBOT_ENDPOINT = '/api/v1/authorized/chatbot';

// Get runtime config for base URL (allows modification after export)
const runtimeConfig = getRuntimeConfigSync();

// Create a custom Axios instance for the chatbot API
const chatbotHttp = axios.create({
    baseURL: runtimeConfig.BASE_URL || import.meta.env.VITE_BASE_URL, // Use runtime config with fallback
    timeout: 180000, // Set timeout to 180000ms (3 minutes)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to include the access token in the headers
chatbotHttp.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const chatbotService = {
    async sendMessage(request: ChatbotRequest): Promise<ChatbotResponse> {
        try {
            const response = await chatbotHttp.post<ChatbotResponse>(CHATBOT_ENDPOINT, request);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};