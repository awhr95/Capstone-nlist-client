import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import Signup from "./pages/SignupPage/SignupPage";
import HomePage from "./pages/HomePage/HomePage";
import OpportunityPage from "./pages/OpportunityPage/OpportunityPage";
import CreateOpportunity from "./pages/CreateOpportunity/CreateOpportunity";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/EditProfile/EditProfile";
import MyList from "./pages/MyList/MyList";
import SavedList from "./pages/SavedList/SavedList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const foundUser = sessionStorage.getItem("user_id");
    setUser(foundUser);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/edit-profile" element={<EditProfile user={user} />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/saved" element={<SavedList />} />
        <Route
          path="/opportunity/:opportunityId"
          element={<OpportunityPage />}
        />
        <Route path="/create-listing" element={<CreateOpportunity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
