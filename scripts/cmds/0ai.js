const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  const services = [
    { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
    { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
    { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = "𝐕𝐞𝐮𝐢𝐥𝐥𝐞𝐳 𝐩𝐨𝐬𝐞𝐫 𝐥𝐚 𝐪𝐮𝐞𝐬𝐭𝐢𝐨𝐧 𝐚 𝐯𝐨𝐭𝐫𝐞 𝐜𝐨𝐧𝐯𝐞𝐧𝐚𝐧𝐜𝐞 𝐞𝐭 𝐣𝐞 𝐦'𝐞𝐟𝐟𝐨𝐫𝐜𝐞𝐫𝐚𝐢 𝐝𝐞 𝐯𝐨𝐮𝐬 𝐟𝐨𝐮𝐫𝐧𝐢𝐫 𝐮𝐧𝐞 𝐫𝐞𝐩𝐨𝐧𝐬𝐞 𝐞𝐟𝐟𝐢𝐜𝐚𝐜𝐞 🙂🤓. 𝐕𝐨𝐭𝐫𝐞 𝐬𝐚𝐭𝐢𝐬𝐟𝐚𝐜𝐭𝐢𝐨𝐧 𝐞𝐬𝐭 𝐦𝐚  𝐩𝐫𝐢𝐨𝐫𝐢𝐭é 𝐚𝐛𝐬𝐨𝐥𝐮𝐞 🤖. (𝐄𝐃𝐈𝐓 𝐛𝐲 𝐃𝐞𝐥𝐟𝐚 𝐟𝐫𝐨𝐬𝐭 )";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'Arn',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage(`❤━━━━━━━━\nPlease provide a question or statement.\n━━━━━━━━━━━━━━━━`, event.threadID, event.messageID);
      return;
    }

    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
    api.sendMessage(`👩‍💻🙂❤━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      message.reply(`
                       

\n${response}\n`, messageID);
    }
  }
};