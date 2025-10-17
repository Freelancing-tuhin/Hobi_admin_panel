

import Logo from "/src/assets/images/logos/logo.svg";
import { Link } from "react-router";
const FullLogo = () => {
  return (
    <Link to={"/"}>
      {/* <img src={Logo} alt="logo" className="block" /> */}
      <div className="h-16 w-16 bg-[#b03052] rounded-full flex items-center justify-center">
        <span className="text-white text-2xl font-bold">T</span>
      </div>
    </Link>
  );
};

export default FullLogo;
