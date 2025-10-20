import { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function SignUp({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const showPopup = (msg) => alert(msg);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
      });
      onLogin(role, user);
      showPopup(`🎉 Signed up successfully as ${role.toUpperCase()}`);
    } catch (error) {
      showPopup(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        let userRole = window.prompt("Choose your role: student or company", "student");
        if (userRole !== "student" && userRole !== "company") userRole = "student";
        await setDoc(docRef, { email: user.email, role: userRole });
        onLogin(userRole, user);
        showPopup(`🎉 Signed up successfully as ${userRole.toUpperCase()}`);
      } else {
        showPopup("Account already exists! Please login.");
      }
    } catch (error) {
      showPopup(error.message);
    }
  };

  return (
    <div className="auth-box">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <div className="role-select">
          <label>
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            /> Student
          </label>
          <label>
            <input
              type="radio"
              value="company"
              checked={role === "company"}
              onChange={() => setRole("company")}
            /> Company
          </label>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <hr />
      <button onClick={handleGoogleSignUp}>Sign Up with Google</button>
    </div>
  );
}
