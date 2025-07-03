import { useEffect } from "react";

import { RootState } from "../../store/store";
import {
  isErrorReceived,
  latestMessageDialogReceived,
  latestMessageGroupReceived,
  listLastMessageReceived,
} from "../../store/chat/slice";
import {
  TYPE_LATEST_MESSAGE_DIALOG,
  TYPE_LATEST_MESSAGE_GROUP,
  TYPE_LIST_LAST_MESSAGE,
  TYPE_PRIVATE_MESSAGE,
} from "../../utils/constants";
import {
  formatDatalatestMessageDialog,
  formatDatalatestMessageGroup,
  formatDataListLastMessage,
  formatPrivateMessageChat,
  formatPrivateMessageConversation,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks";
import { FormatLatestMessageDialog } from "../../types/chat";

export const MessageProcessor = () => {
  const { socket } = useAppSelector((state: RootState) => state.socket);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTimeout(() => {
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
                const resultFormat = formatDatalatestMessageGroup(
                  data.params.data
                );
                dispatch(latestMessageGroupReceived(resultFormat));
              } else {
                dispatch(isErrorReceived(data));
              }
              break;

            case TYPE_PRIVATE_MESSAGE:
              if (data.success) {
                if (!data.params.isBroadcast) return;
                const resultFormatConversation =
                  formatPrivateMessageConversation(data.params.item);
                const resultFormatChat = formatPrivateMessageChat(
                  data.params.item
                );
                //@ts-ignore
                dispatch(listLastMessageReceived(resultFormatChat));
                //@ts-ignore
                dispatch(latestMessageDialogReceived(resultFormatConversation));
              } else {
                dispatch(isErrorReceived(data));
              }

              break;
            default:
              dispatch(isErrorReceived(data));
              break;
          }
        }, 1000);
      };
    }
  }, [dispatch, socket]);
  return null;
};
