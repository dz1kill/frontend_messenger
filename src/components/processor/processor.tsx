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
} from "../../utils/constants";
import {
  formatDatalatestMessageDialog,
  formatDatalatestMessageGroup,
  formatDataListLastMessage,
  sortMessage,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../libs/redux/hooks";
import { FormaLatestMessageDialog } from "../../types/chat";

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
                const resultSort = sortMessage(resultFormat);
                dispatch(listLastMessageReceived(resultSort));
              } else {
                dispatch(isErrorReceived(data));
              }
              break;

            case TYPE_LATEST_MESSAGE_DIALOG:
              if (data.success) {
                const resultFormat: FormaLatestMessageDialog[] =
                  formatDatalatestMessageDialog(data.params.data);
                const resultSort = sortMessage(resultFormat);
                dispatch(latestMessageDialogReceived(resultSort));
              } else {
                dispatch(isErrorReceived(data));
              }
              break;

            case TYPE_LATEST_MESSAGE_GROUP:
              if (data.success) {
                const resultFormat = formatDatalatestMessageGroup(
                  data.params.data
                );
                const resultSort = sortMessage(resultFormat);
                dispatch(latestMessageGroupReceived(resultSort));
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
