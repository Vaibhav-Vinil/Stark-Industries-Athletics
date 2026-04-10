/* Code that renders homepage on the frontend */
import Navbar from "../../components/navbar/navbar";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../utils/authentication/auth-context";
import "./home.scss";

/**
 * Returns a react component consisting of the Home page. Includes all logic relevant to the home page.
 * 
 * @returns a react component consisting of the Home page.
 */
const Home = () => {
    const { user } = useContext(AuthContext);
    const [dashboard, setDashboard] = useState({
        missionName: "General Training",
        weeklyWorkoutTarget: 5,
        dailyWaterTarget: 3000,
        workoutsToday: 0,
        caloriesToday: 0,
        waterToday: 0
    });
    const [jarvisPrompt, setJarvisPrompt] = useState("");
    const [jarvisReply, setJarvisReply] = useState("JARVIS online. Ask for hydration, workout, or nutrition guidance.");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await axios.get(`/users/dashboard/${user._id}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });
                setDashboard(response.data);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Unable to load dashboard stats right now.");
            }
        };

        loadDashboard();
    }, [user._id, user.accessToken]);

    const handleAskJarvis = async () => {
        if (!jarvisPrompt.trim()) {
            setErrorMessage("Please enter a question for JARVIS.");
            return;
        }

        try {
            const response = await axios.post(
                `/users/jarvis/${user._id}`,
                { message: jarvisPrompt },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
            setJarvisReply(response.data.reply);
            setErrorMessage("");
            setJarvisPrompt("");
        } catch (error) {
            setErrorMessage("JARVIS is currently unavailable. Please try again.");
        }
    };

    return (
        <div className="home">
            <Navbar />
            <div className="dashboardPanel">
                <h2>Avenger Training Protocol</h2>
                <p className="subtitle">{`Mission: ${dashboard.missionName}`}</p>
                <div className="statGrid">
                    <div className="statCard">
                        <h4>Workouts Today</h4>
                        <span>{dashboard.workoutsToday}</span>
                    </div>
                    <div className="statCard">
                        <h4>Calories Logged</h4>
                        <span>{dashboard.caloriesToday}</span>
                    </div>
                    <div className="statCard">
                        <h4>Water Intake (ml)</h4>
                        <span>{dashboard.waterToday}</span>
                    </div>
                    <div className="statCard">
                        <h4>Daily Water Target</h4>
                        <span>{dashboard.dailyWaterTarget}</span>
                    </div>
                </div>
                <div className="jarvisSection">
                    <h3>JARVIS AI Assistant</h3>
                    <p className="jarvisReply">{jarvisReply}</p>
                    <input
                        type="text"
                        value={jarvisPrompt}
                        onChange={(e) => setJarvisPrompt(e.target.value)}
                        placeholder="Ask: How am I doing on hydration?"
                    />
                    <button onClick={handleAskJarvis}>Ask JARVIS</button>
                </div>
                {errorMessage && <p className="errorText">{errorMessage}</p>}
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default Home;
