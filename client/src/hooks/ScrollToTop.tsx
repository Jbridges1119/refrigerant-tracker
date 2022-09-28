import { useEffect } from "react";
// import { useLocation } from "react-router";
import { useLocation } from "react-router-dom";
interface Props {
  children: React.ReactNode;
}
const ScrollToTop: React.FC<Props> = ({ children }) => {
  // const location = useLocation();
  const { pathname } = useLocation();

  useEffect(() => {
    // @ts-ignore
    document.documentElement.scrollTo({top:0, left:0, behavior: "instant"});
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
