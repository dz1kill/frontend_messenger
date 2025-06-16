import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store/store";
import {
  isErrorReceived,
  listLastMessageReceived,
} from "../../store/chat/slice";
import { TYPE_LIST_LAST_MESSAGE } from "../../utils/constants";
import { formatDataListLastMessage, sortListLastMessage } from "./helper";

export const MessageProcessor = () => {
  const { socket } = useSelector((state: RootState) => state.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTimeout(() => {
          switch (data.type) {
            case TYPE_LIST_LAST_MESSAGE:
              if (data.success) {
                const resultFormat = formatDataListLastMessage(
                  data.params.data
                );
                const resultSort = sortListLastMessage(resultFormat);
                dispatch(listLastMessageReceived(resultSort));
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
