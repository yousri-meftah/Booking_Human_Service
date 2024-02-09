import Image from "next/image";
import Login from "./pages/login";

import SignIn from "./pages/signIn";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignIn />
    </main>
  );
}
