import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// --- Pages (uncomment one at a time to preview) ---
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import PersonalExpensesPage from "./pages/PersonalExpensesPage";
import { groups } from "./data/dummyData";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-main">

        <HomePage />
        {/* <AuthPage page={"register"}/> */}
        {/* <GroupsPage /> */}
        {/* <GroupDetailPage group={groups[0]} /> */}
        {/* <PersonalExpensesPage /> */}

      </main>
      <Footer />
    </div>
  );
}
