import { Bird } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Bird className="w-24 h-24 text-golf-primary mb-6" />
      <h1 className="text-4xl font-bold text-golf-primary mb-2">Lost Ball</h1>
      <p className="text-lg text-golf-text">The page you are looking for couldn't be found</p>
    </div>
  );
}