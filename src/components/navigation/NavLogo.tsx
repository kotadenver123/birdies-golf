import { Link } from "react-router-dom";

export function NavLogo() {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="https://assets.cdn.filesafe.space/rcmGQAVicau7s4CkgnuX/media/6e24e1a5-a049-495d-8f01-e4473378594f.png"
        alt="Logo"
        className="h-12 object-contain"
      />
    </Link>
  );
}