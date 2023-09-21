import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import fajr from "../../public/images/fajr-prayer.png";
import dhhr from "../../public/images/dhhr-prayer-mosque.png";
import asr from "../../public/images/asr-prayer-mosque.png";
import maghrib from "../../public/images/sunset-prayer-mosque.png";
import isha from "../../public/images/night-prayer-mosque.png";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

const MainContent = () => {
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);

  const [timings, setTimings] = useState({
    Fajr: "04:49",
    Dhuhr: "12:16",
    Asr: "15:40",
    Maghrib: "18:22",
    Isha: "19:36",
  });

  const availableCity = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  const [remainingTime, setRemainingTime] = useState("");

  const [selectCity, setSelectCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });
  const [today, setToday] = useState("");

  useEffect(() => {
    const getTimings = async () => {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectCity.apiName}`
      );
      setTimings(response.data.data.timings);
    };
    getTimings();
  }, [selectCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = null;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      console.log("the fajr", fajrToMidnightDiff);

      const totalDifference = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDifference;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration issss",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );
  };

  const handleCityChange = (event) => {
    const cityObject = availableCity.find((city) => {
      return city.apiName === event.target.value;
    });
    console.log(event.target.value);
    setSelectCity(cityObject);
  };

  return (
    <div>
      {/* TOP ROW */}
      <Grid container className="timer-prayer" p={{ xs: "0", sm: "0px 40px" }}>
        <Grid xs={6}>
          <div>
            <h2 className="day-prayer">{today}</h2>
            <h1 className="name-prayer">{selectCity.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2 className="remaining-prayer">
              متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h1 className="remaining-time-prayer">{remainingTime}</h1>
          </div>
        </Grid>
      </Grid>
      {/* == TOP ROW == */}
      <Divider
        style={{
          borderColor: "white",
          opacity: "0.1",
        }}
      />
      {/* PRAYERS CARD */}
      <Stack direction={"row"} justifyContent={"center"} flexWrap={"wrap"}>
        <Grid
          container
          mt="50px"
          className="container-prayer"
          rowSpacing={1}
          columnSpacing={2}
          // p={"0 20px"}
        >
          <Grid lg={3} md={4} sm={6} xs={10}>
            <Prayer name="الفجر" time={timings.Fajr} image={fajr} />
          </Grid>
          <Grid lg={3} md={4} sm={6} xs={10}>
            <Prayer name="الظهر" time={timings.Dhuhr} image={dhhr} />
          </Grid>
          <Grid lg={3} md={4} sm={6} xs={10}>
            <Prayer name="العصر" time={timings.Asr} image={asr} />
          </Grid>
          <Grid lg={3} md={4} sm={6} xs={10}>
            <Prayer name="المغرب" time={timings.Maghrib} image={maghrib} />
          </Grid>
          <Grid lg={3} md={4} sm={6} xs={10}>
            <Prayer name="العشاء" time={timings.Isha} image={isha} />
          </Grid>
        </Grid>
      </Stack>
      {/*== PRAYERS CARD ==*/}
      {/* SELECT CITY */}
      <Stack direction="row" justifyContent={"center"} mt="40px">
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label" style={{ color: "white" }}>
            المدينة
          </InputLabel>
          <Select
            sx={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {availableCity.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
};

export default MainContent;
