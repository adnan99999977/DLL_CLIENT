import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="w-40 h-40">
      <DotLottieReact src="/public/loaderfile.json" loop autoplay />
    </div>
  </div>
);

export default Loader;
