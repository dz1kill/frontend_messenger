import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { formatDataListLastMessage } from "./helper";
import { RootState } from "../../store/store";
import { TYPE_LIST_LAST_MESSAGE } from "./costants";
import {
  isErrorReceived,
  listLastMessageReceived,
} from "../../store/chat/slice";

export const MessageProcessor = () => {
  const { socket } = useSelector((state: RootState) => state.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("🚀 ~ useEffect ~ data:", data);
        switch (data.type) {
          case TYPE_LIST_LAST_MESSAGE:
            if (data.success) {
              const result = formatDataListLastMessage(data);
              result.forEach((chatData) => {
                dispatch(listLastMessageReceived(chatData));
              });
            } else {
              dispatch(isErrorReceived(data));
            }
            break;

          default:
            dispatch(isErrorReceived(data));
            break;
        }
      };
    }
  }, [dispatch, socket]);
  return null;
};
