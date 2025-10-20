import { useState } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showPopup = (msg) => {
    alert(msg); // simple pop-up for now; can be replaced with toast later
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        onLogin(role, user);
        showPopup(`✅ Logged in as ${role.toUpperCase()}`);
      } else {
        showPopup("No role found. Please sign up first.");
      }
    } catch (error) {
      showPopup(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const role = docSnap.data().role;
        onLogin(role, user);
        showPopup(`✅ Logged in as ${role.toUpperCase()}`);
      } else {
        showPopup("No account found. Please sign up first.");
      }
    } catch (error) {
      showPopup(error.message);
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
      <hr />
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
