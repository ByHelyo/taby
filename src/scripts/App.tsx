import { useEffect } from "react";

export default function App() {
  useEffect(() => {}, []);

  return (
    <div className="taby-menu taby-display">
      <div className="taby-search">
        <input className="taby-searchInput" placeholder="Search" />
      </div>
      <ul className="taby-searchList"></ul>
    </div>
  );
}
