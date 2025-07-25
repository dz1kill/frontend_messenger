import { useEffect } from "react";

import { RootState } from "../../store/store";
import {
  clearCurrentConversation,
  isErrorReceived,
  latestMessageDialogReceived,
  latestMessageGroupReceived,
  listLastMessageReceived,
  removeGroupMessages,
  removeLastMessageByGroupId,
} from "../../store/chat/slice";
import {
  TYPE_ADD_MEMBER_TO_GROUP,
  TYPE_DROP_GROUP,
  TYPE_GROUP_MESSAGE,
  TYPE_LATEST_MESSAGE_DIALOG,
  TYPE_LATEST_MESSAGE_GROUP,
  TYPE_LEAVE_GROUP,
  TYPE_LIST_LAST_MESSAGE,
  TYPE_PRIVATE_MESSAGE,
} from "../../utils/constants";
import {
  formatDatalatestMessageDialog,
  formatDatalatestMessageGroup,
  formatDataListLastMessage,
  formatGroupMessageChat,
  formatGroupMessage,
  formatPrivateMessageChat,
  formatPrivateMessage,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { FormatLatestMessageDialog } from "../../types/chat";
import { checkFirstLoad } from "./helper";

export const MessageProcessor = () => {
  const { socket } = useAppSelector((state: RootState) => state.socket);
  const dispatch = useAppDispatch();
  const { latestMessageDialog, latestMessageGroup, currentConversation } =
    useAppSelector((state: RootState) => state.chats);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case TYPE_LIST_LAST_MESSAGE:
          if (data.success) {
            const resultFormat = formatDataListLastMessage(data);
            dispatch(listLastMessageReceived(resultFormat));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_LATEST_MESSAGE_DIALOG:
          if (data.success) {
            const resultFormat: FormatLatestMessageDialog[] =
              formatDatalatestMessageDialog(data.params.data);
            dispatch(latestMessageDialogReceived(resultFormat));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_LATEST_MESSAGE_GROUP:
          if (data.success) {
            const resultFormat = formatDatalatestMessageGroup(data.params.data);
            dispatch(latestMessageGroupReceived(resultFormat));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_PRIVATE_MESSAGE:
          if (data.success) {
            if (!data.params.isBroadcast) return;
            const isFirstLoaded = checkFirstLoad(
              data.params.item,
              latestMessageDialog,
              latestMessageGroup
            );
            const resultFormatMesssage = formatPrivateMessage(data.params.item);
            const resultFormatChat = formatPrivateMessageChat(data.params.item);
            dispatch(listLastMessageReceived(resultFormatChat));
            if (!isFirstLoaded) return;
            dispatch(latestMessageDialogReceived(resultFormatMesssage));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_GROUP_MESSAGE:
          if (data.success) {
            if (!data.params.isBroadcast) return;
            const isFirstLoaded = checkFirstLoad(
              data.params.item,
              latestMessageDialog,
              latestMessageGroup
            );
            const resultFormatMesssage = formatGroupMessage(data.params.item);
            const resultFormatChat = formatGroupMessageChat(data.params.item);

            dispatch(listLastMessageReceived(resultFormatChat));
            if (!isFirstLoaded) return;
            dispatch(latestMessageGroupReceived(resultFormatMesssage));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_LEAVE_GROUP:
          if (data.success) {
            if (!data.params.isBroadcast) return;
            const isFirstLoaded = checkFirstLoad(
              data.params.item,
              latestMessageDialog,
              latestMessageGroup
            );
            const resultFormatMesssage = formatGroupMessage(data.params.item);
            const resultFormatChat = formatGroupMessageChat(data.params.item);
            dispatch(listLastMessageReceived(resultFormatChat));
            if (!isFirstLoaded) return;
            dispatch(latestMessageGroupReceived(resultFormatMesssage));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_DROP_GROUP:
          if (data.success) {
            if (!data.params.isBroadcast || !data.params.item.groupId) return;
            dispatch(removeLastMessageByGroupId(data.params.item.groupId));
            dispatch(removeGroupMessages(data.params.item.groupId));
            dispatch(clearCurrentConversation());
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        case TYPE_ADD_MEMBER_TO_GROUP:
          if (data.success) {
            if (!data.params.isBroadcast) return;
            const isFirstLoaded = checkFirstLoad(
              data.params.item,
              latestMessageDialog,
              latestMessageGroup
            );
            const resultFormatMesssage = formatGroupMessage(data.params.item);
            const resultFormatChat = formatGroupMessageChat(data.params.item);
            dispatch(listLastMessageReceived(resultFormatChat));
            if (!isFirstLoaded) return;
            dispatch(latestMessageGroupReceived(resultFormatMesssage));
          } else {
            dispatch(isErrorReceived(data));
          }
          break;

        default:
          dispatch(isErrorReceived(data));
          break;
      }
    };

    socket.addEventListener("message", messageHandler);

    return () => {
      socket.removeEventListener("message", messageHandler);
    };
  }, [
    dispatch,
    socket,
    latestMessageDialog,
    latestMessageGroup,
    currentConversation,
  ]);

  return null;
};
