import { createContext, useContext } from "react";

interface CurrentPercentType {}
interface Props {
  children: React.ReactNode;
}
const pageContext = createContext<CurrentPercentType>({} as CurrentPercentType);
const sharedContext: React.FC<Props> = ({ children }) => {
  return <pageContext.Provider value={{}}>{children}</pageContext.Provider>;
};

export default sharedContext;
export const usePageLocation = () => useContext(pageContext);
