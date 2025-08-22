const moderationMessageMap = new Map();

function addModerationMessage(messageId: string, serverID: string, chatId: string, userId: string, chatMessageId: string, messageText: string){
    moderationMessageMap.set(messageId, {
        serverID,
        chatId,
        userId,
        chatMessageId,
        messageText
    })
}

function removeModerationMessage(messageId: string){
    moderationMessageMap.delete(messageId);
}

export { moderationMessageMap, addModerationMessage, removeModerationMessage };