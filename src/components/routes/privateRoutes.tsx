import { Navigate } from "react-router-dom";
import { PrivateRouteProps } from "../../types/home";
import { initUseChat } from "../../store/chat/chatSlice";

import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // const socket = initUseChat();

  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};
export default PrivateRoute;
//@ts-ignore

// socket.onopen = () =>
//   //@ts-ignore
//   socket.send(
//     JSON.stringify({
//       type: "listLastMessageв",
//       params: {
//         limit: 5,
//         page: 1,
//       },
//     })
//   );

// //@ts-ignore
// socket.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   console.log("🚀 ~ PrivateRoute ~ data:", data);
//   dispatch(addMessage(data));
// };

//@ts-ignore
