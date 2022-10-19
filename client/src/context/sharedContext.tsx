import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
interface IContext {
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {};
  setUserData: React.Dispatch<React.SetStateAction<{}>>;
  userInfo: {};
  setUserInfo: React.Dispatch<React.SetStateAction<{}>>;
};
interface Props {
  children: React.ReactNode;
}
const pageContext = createContext<IContext>({} as IContext);

const SharedContext: React.FC<Props> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3005/users/login")
      .then((info) => {
        setLoggedIn(info.data.loggedIn);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  return <pageContext.Provider value={{
    loggedIn,
    setLoggedIn,
    userData,
    setUserData,
    userInfo,
    setUserInfo
  }}>{children}</pageContext.Provider>;
};

export default SharedContext;
export const usePageLocation = () => useContext(pageContext);
