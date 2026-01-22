import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Auth from "./auth/Auth";
import Upload from "./components/Upload";

import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Doc Scanner App</h1>

        {user && (
          <div className="user-bar">
            <span>{user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      {/* Content */}
      {!user ? <Auth /> : <Upload user={user} />}
    </div>
  );
}

export default App;
