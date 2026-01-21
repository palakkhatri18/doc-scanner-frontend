import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Upload from "./components/Upload";

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
    <div style={{ padding: 20 }}>
      <h1>Doc Scanner App</h1>

      {!user ? (
        <>
          <Signup />
          <hr />
          <Login />
        </>
      ) : (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>

          <Upload user={user} />
        </>
      )}
    </div>
  );
}

export default App;
