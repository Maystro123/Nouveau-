module.exports = {
  config: {
    name: "set",
    aliases: ['ap'],
    version: "1.0",
    author: "kazu.kinoshita",
    role: 0,
    shortDescription: {
      en: "Set coins and experience points for a user"
    },
    longDescription: {
      en: "Set coins and experience points for a user as desired"
    },
    category: "economy",
    guide: {
      en: "{pn}set [money|exp] [amount]"
    }
  },

  onStart: async function ({ args, event, api, usersData }) {
    const permission = ["61553392844761","100060044509697",""];
  if (!permission.includes(event.senderID)) {
    api.sendMessage("Is it poverty that bothers you? .", event.threadID, event.messageID);
    return;
  }
    const query = args[0];
    const amount = parseInt(args[1]);

    if (!query || !amount) {
      return api.sendMessage("𝖛𝖔𝖎𝖑𝖆̀ 𝖈𝖔𝖒𝖒𝖊𝖓𝖙 𝖔𝖓 𝖚𝖙𝖎𝖑𝖎𝖘𝖊 𝖑𝖆 𝖈𝖔𝖒𝖒𝖆𝖓𝖉𝖊.: set [𝖇𝖆𝖘𝖊] [𝖒𝖔𝖓𝖙𝖆𝖓𝖙]", event.threadID);
    }

    const { messageID, senderID, threadID } = event;

    if (senderID === api.getCurrentUserID()) return;

    let targetUser;
    if (event.type === "message_reply") {
      targetUser = event.messageReply.senderID;
    } else {
      const mention = Object.keys(event.mentions);
      targetUser = mention[0] || senderID;
    }

    const userData = await usersData.get(targetUser);
    if (!userData) {
      return api.sendMessage("User not found.", threadID);
    }

    const name = await usersData.getName(targetUser);

    if (query.toLowerCase() === 'exp') {
      await usersData.set(targetUser, {
        money: userData.money,
        exp: amount,
        data: userData.data
      });

      return api.sendMessage(`𝖆𝖚𝖌𝖒𝖊𝖓𝖙𝖆𝖙𝖎𝖔𝖓 𝖉𝖊 𝖑'𝖊𝖝𝖕𝖊́𝖗𝖎𝖊𝖓𝖈𝖊 ${amount} 𝖘𝖚𝖗 ${name}.`, threadID);
    } else if (query.toLowerCase() === 'money') {
      await usersData.set(targetUser, {
        money: amount,
        exp: userData.exp,
        data: userData.data
      });

      return api.sendMessage(`𝖆𝖚𝖌𝖒𝖊𝖓𝖙𝖆𝖙𝖎𝖔𝖓 𝖉𝖊𝖘 𝖕𝖎𝖊𝖈𝖊𝖘  ${amount} 𝖘𝖚𝖗 ${name}.`, threadID);
    } else {
      return api.sendMessage("Invalid query. Use 'exp' to set experience points or 'money' to set coins.", threadID);
    }
  }
};