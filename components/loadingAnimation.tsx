import "./loadingAnimation.css";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100">
      <div className="bg-black w-16 aspect-square rounded-full toBeAnimated"></div>
    </div>
  );
}
