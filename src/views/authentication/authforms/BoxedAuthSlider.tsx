
import { Carousel } from "flowbite-react";
import AuthSlide from "/src/assets/images/backgrounds/login-side.png";
import { Button } from "flowbite-react";
import { useLocation } from "react-router";


const SliderData = [
  {
    title: "Feature Rich 3D Charts",
    desc: "Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet massa. Aliquam dignissim nec felis quis imperdiet.",
  },
  {
    title: "Feature Rich 2D Charts",
    desc: "Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet massa. Aliquam dignissim nec felis quis imperdiet.",
  },
  {
    title: "Feature Rich 1D Charts",
    desc: "Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet massa. Aliquam dignissim nec felis quis imperdiet.",
  },
];

const BoxedAuthSlider = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const bgImage =
    "https://res.cloudinary.com/diecfwnp9/image/upload/v1761055638/hobiwithbg_eucjae.png";

  const containerBgClass = `${
    pathname == "/auth/auth2/forgot-password" || pathname == "/auth/auth2/two-steps"
      ? 'max-w-[200px]'
      : 'max-w-[300px]'
  }`;

  return (
    <>
      <div
        className={`max-w-xl mx-auto h-full flex flex-col justify-center items-center boxed-auth ${containerBgClass}`}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >

      </div>
    </>
  );
};

export default BoxedAuthSlider;
