// Javascript for page displaying recommendations
import { Box, List, ListItem, Paper, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Navbar from "../../components/navbar/navbar";
import { Link } from "react-router-dom";
import { AuthContext } from "../../utils/authentication/auth-context";
import { useState, useEffect, useContext } from 'react';
import "./exerciseTracker.scss";
import axios from "axios";
import { useRef } from "react";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import { BarChart } from '@mui/x-charts/BarChart';

const useStyles = makeStyles((theme) => ({
    root: {
        color: "black",
    },
    selected: {
        color: "white"
    }
}));

const ExerciseTracker = () => {

    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const userId = user._id;

    /* Exercise info corresponding to input boxes */
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [time, setTime] = useState(0);
    const [exerciseType, setExerciseType] = useState('');
    const [lifestyle, setLifestyle] = useState('');
    const [activityLevel, setActivityLevel] = useState('');

    const [weightLiftingExercises, setLiftingExercises] = useState([]);
    const [cardioExercises, setCardioExercises] = useState([]);
    const [otherExercises, setOtherExercises] = useState([]);
    const [allExercises, setAllExercises] = useState([]);
    const [sortType, setSortType] = useState('all');
    const [exerciseCounts, setExerciseCounts] = useState([]);
    const [missionName, setMissionName] = useState("General Training");
    const [weeklyWorkoutTarget, setWeeklyWorkoutTarget] = useState("5");
    const [dailyWaterTarget, setDailyWaterTarget] = useState("3000");
    const [errorMessage, setErrorMessage] = useState("");
    const TRAINING_PRESETS = [
        { label: "Iron Strength", exerciseName: "Deadlift", sets: 5, reps: 5, time: 0, exerciseType: "Weight Lifting" },
        { label: "Widow Agility", exerciseName: "Battle Ropes", sets: 4, reps: 20, time: 15, exerciseType: "Cardio" },
        { label: "Cap Endurance", exerciseName: "Sprint Intervals", sets: 8, reps: 1, time: 24, exerciseType: "Cardio" }
    ];

    /* Load exercises on page render */
    const isFirstRender = useRef(true);
    useEffect(() => {
        // Get all exercises on load
        const getExercises = async () => {
            try {
                const resLifting = await axios.get(`/users/allLifting/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                const resCardio = await axios.get(`/users/allCardio/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                const counts = await axios.get(`/users/exercisesPerMonth/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                const resActivity = await axios.get(`/users/activityInfo/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                const resOther = await axios.get(`/users/allOther/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });
                const resActivityLevel = resActivity.data.length == 0 ? "[none]" : resActivity.data[0].activityLevel;
                const resLifestyle = resActivity.data.length === 0 ? "[none]" : resActivity.data[0].lifestyle;
                const fitnessGoalsRes = await axios.get(`/users/fitnessGoals/${userId}`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });

                setActivityLevel(resActivityLevel);
                setLifestyle(resLifestyle);
                setMissionName(fitnessGoalsRes.data.missionName || "General Training");
                setWeeklyWorkoutTarget(`${fitnessGoalsRes.data.weeklyWorkoutTarget || 5}`);
                setDailyWaterTarget(`${fitnessGoalsRes.data.dailyWaterTarget || 3000}`);
                setExerciseCounts(counts.data);
                setLiftingExercises(resLifting.data);
                setCardioExercises(resCardio.data);
                setOtherExercises(resOther.data);
                setAllExercises(resLifting.data.concat(resCardio.data).concat(resOther.data));

            } catch (error) {
                console.log(error);
            }
        };

        /* only run on first render */
        if (isFirstRender.current) {
            getExercises();
        }
        isFirstRender.current = false;
        // eslint-disable-next-line
    }, []);

    const handleAddExercise = async () => {
        if (!exerciseName.trim() || !exerciseType.trim()) {
            setErrorMessage("Please provide exercise name and type.");
            return;
        }

        try {
            await axios.put(
                `users/addExercise/${userId}`,
                { exerciseName, sets, time, reps, exerciseType },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );


            const resLifting = await axios.get(`/users/allLifting/${userId}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });

            const resCardio = await axios.get(`/users/allCardio/${userId}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });

            const resOther = await axios.get(`/users/allOther/${userId}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });

            const counts = await axios.get(`/users/exercisesPerMonth/${userId}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });

            setExerciseCounts(counts.data);
            // Refresh the exercise items after editing
            setLiftingExercises(resLifting.data);
            setCardioExercises(resCardio.data);
            setOtherExercises(resOther.data);
            setAllExercises(resLifting.data.concat(resCardio.data).concat(resOther.data));

            // Clear the editedNutritionFacts state
            setExerciseName('');
            setSets(0);
            setReps(0);
            setTime(0);
            setExerciseType('');
            setErrorMessage("");
        } catch (error) {
            console.error(error);
            setErrorMessage("Unable to add exercise. Please try again.");
        }
    };

    const handleSaveActivityInfo = async () => {

        try {
            const res = await axios.put(
                `users/saveActivityInfo/${userId}`,
                { activityLevel, lifestyle },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
            console.log(res);
            console.log(activityLevel, lifestyle);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExerciseTypeChange = (event) => {
        setExerciseType(event.target.value);
    }

    const handleActivityLevelChange = (event) => {
        setActivityLevel(event.target.value);
    }

    const handleLifestyleChange = (event) => {
        setLifestyle(event.target.value);
    }

    const handleSortChange = (event) => {
        setSortType(event.target.value);
    }

    const applyPreset = (preset) => {
        setExerciseName(preset.exerciseName);
        setSets(preset.sets);
        setReps(preset.reps);
        setTime(preset.time);
        setExerciseType(preset.exerciseType);
        setErrorMessage("");
    };

    const handleSaveGoals = async () => {
        const weeklyTarget = Number(weeklyWorkoutTarget);
        const waterTarget = Number(dailyWaterTarget);

        if (!missionName.trim() || !Number.isFinite(weeklyTarget) || weeklyTarget <= 0 || !Number.isFinite(waterTarget) || waterTarget <= 0) {
            setErrorMessage("Please enter valid mission, workout target, and water target values.");
            return;
        }

        try {
            await axios.put(
                `users/fitnessGoals/${userId}`,
                { missionName, weeklyWorkoutTarget: weeklyTarget, dailyWaterTarget: waterTarget },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );
            setErrorMessage("");
        } catch (error) {
            setErrorMessage("Unable to save mission goals right now.");
        }
    };

    function listItem(item) { // display an exercise
        const name = item.exerciseName;
        const id = item.hash;

        return (
            <Link to={`/exerciseInfo/${id}`} className="link">
                <ListItem component="div" disablePadding button={true}>
                    {
                        item.exerciseType === "Weight Lifting" ? <span className="header">{`${name} (${item.sets} sets, ${item.reps} reps)`}</span> :
                            (<span className="header">{`${name} (${item.time} mins)`}</span>)
                    }

                </ListItem>
            </Link>
        );
    }

    return (
        <div className="exerciseTracker">
            <Navbar />
            <div>
                <h4 className="moreSpace">{"View Your Exercises Today:"}</h4>
                <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', borderRadius: 5 }} className="list">
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                        <List>
                            {
                                sortType === "all" ? allExercises.map((item) => listItem(item)) :
                                    (sortType === "cardio" ? cardioExercises.map((item) => listItem(item)) :
                                        (sortType === "other" ? otherExercises.map((item) => listItem(item)) :
                                            weightLiftingExercises.map((item) => listItem(item))))
                            }
                        </List>
                    </Paper>
                </Box>
                <Box sx={{ minWidth: 120 }} className="button">
                    <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                        <InputLabel>Sort Exercises By</InputLabel>
                        <Select id="demo-simple-select" value={sortType} label="Filter" onChange={handleSortChange} classes={{ root: classes.root, select: classes.selected }} >
                            <MenuItem value={"weightLifting"}>{`Weight Lifting`}</MenuItem>
                            <MenuItem value={"cardio"}>{`Cardio`}</MenuItem>
                            <MenuItem value={"other"}>{`Other`}</MenuItem>
                            <MenuItem value={"all"}>{`All`}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{"Add Exercise To Tracker:"}</h4>
                <div className="presetRow">
                    {TRAINING_PRESETS.map((preset) => (
                        <Button key={preset.label} variant="outlined" color="inherit" size="small" onClick={() => applyPreset(preset)}>
                            {preset.label}
                        </Button>
                    ))}
                </div>
                <div className="filter">
                    <Box sx={{ minWidth: 120 }}>
                        <div> {"Exercise Name: "}</div>
                        <input type="name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
                        <div> {"Sets: "}</div>
                        <input type="sets" value={sets} onChange={(e) => setSets(e.target.value)} />
                        <div> {"Reps: "}</div>
                        <input type="reps" value={reps} onChange={(e) => setReps(e.target.value)} />
                        <div> {"Time (mins): "}</div>
                        <input type="secs" value={time} onChange={(e) => setTime(e.target.value)} />
                    </Box>
                </div>
                <div className="filter2">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Exercise Type</InputLabel>
                            <Select id="demo-simple-select" value={exerciseType} onChange={handleExerciseTypeChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={"Weight Lifting"}>{`Weight Lifting`}</MenuItem>
                                <MenuItem value={"Cardio"}>{`Cardio`}</MenuItem>
                                <MenuItem value={"Other"}>{`Other`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="contained" color="success" size="large" className="button" onClick={handleAddExercise}> Add Exercise </Button>
                </div>
            </Stack>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{"View Exercise Counts:"}</h4>
                <div>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }]}
                        series={[{ data: [exerciseCounts[0], exerciseCounts[1], exerciseCounts[2], exerciseCounts[3], exerciseCounts[4], exerciseCounts[5], exerciseCounts[6], exerciseCounts[7], exerciseCounts[8], exerciseCounts[9], exerciseCounts[10], exerciseCounts[11]] }]}
                        width={300}
                        height={300}
                    />
                </div>

            </Stack>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{`Activity: ${activityLevel}`}</h4>
                <h4 className="moreSpace">{`Lifestyle: ${lifestyle}`}</h4>
                <div className="filter2">
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Physical Activity</InputLabel>
                            <Select id="demo-simple-select" value={activityLevel} onChange={handleActivityLevelChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={"Sedentary"}>{`Sedentary`}</MenuItem>
                                <MenuItem value={"Lightly Active"}>{`Lightly Active`}</MenuItem>
                                <MenuItem value={"Moderately Active"}>{`Moderately Active`}</MenuItem>
                                <MenuItem value={"Very Active"}>{`Very Active`}</MenuItem>
                                <MenuItem value={"Extremely Active"}>{`Extremely Active`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl error fullWidth sx={{ m: 1, minWidth: 120 }}  >
                            <InputLabel>Lifestyle</InputLabel>
                            <Select id="demo-simple-select" value={lifestyle} onChange={handleLifestyleChange} label="Filter" classes={{ root: classes.root, select: classes.selected }} >
                                <MenuItem value={"Busy"}>{`Busy Lifestyle`}</MenuItem>
                                <MenuItem value={"Regular"}>{`Regular Schedule`}</MenuItem>
                                <MenuItem value={"Flexible"}>{`Flexible Schedule`}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Button variant="contained" color="success" size="large" className="button" onClick={handleSaveActivityInfo}> Save Info </Button>
                </div>
            </Stack>
            <Stack className="stack" spacing={2} ml={"50px"}>
                <h4 className="moreSpace">{"Avenger Mission Goals"}</h4>
                <div className="filter">
                    <div>Mission Name:</div>
                    <input type="text" value={missionName} onChange={(e) => setMissionName(e.target.value)} />
                    <div>Weekly Workout Target:</div>
                    <input type="number" value={weeklyWorkoutTarget} onChange={(e) => setWeeklyWorkoutTarget(e.target.value)} />
                    <div>Daily Water Target (ml):</div>
                    <input type="number" value={dailyWaterTarget} onChange={(e) => setDailyWaterTarget(e.target.value)} />
                    <Button variant="contained" color="primary" size="large" className="button" onClick={handleSaveGoals}> Save Mission Goals </Button>
                </div>
                {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            </Stack>
        </div>
    );

};

export default ExerciseTracker;
