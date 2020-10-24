import React from 'react';
import { useEffect, useState } from 'react'
import './App.css';
import {Paper,Grid,Container,TextField,Button,List,ListItem,ListItemText} from '@material-ui/core';
import moment, { min } from 'moment';

function App(props) {
  const [ftUnedited, setftUnedited] = useState("");
  const [ftEdited, setftEdited] = useState("");
  const [diff, setDiff] = useState(0);
  const [pTime, setpTime] = useState("")
  const [practices, setPractices] = useState([]);
  // setPractices(props.practice);
  
  const stringTimeToDate = (str) => {
    const arr = str.split(":");

    if (arr.length == 3) {
        return new Date(0,0,0,arr[0],arr[1],arr[2],0);
    } else if (arr.length == 2) {
        return new Date(0,0,0,0,arr[0],arr[1],0);
    } else console.log('Invalid time input!');
    
}

const calcDiff = () => {
  if (!ftEdited || !ftUnedited) return;

  const unedited = stringTimeToDate(ftUnedited);
  const edited = stringTimeToDate(ftEdited);

  const msDiff = (edited - unedited) / 1000;
  let minDiff = Math.floor(msDiff / 60);
  if (unedited > edited) minDiff = Math.ceil(msDiff / 60);
  const secDiff = msDiff - (minDiff * 60);
  let hourDiff = 0;
  if (minDiff > 59) {
    hourDiff = Math.floor(minDiff / 60);
    minDiff -= 60;
  }
  if (minDiff < -59) {
    hourDiff = Math.ceil(minDiff / 60);
    minDiff += 60;
  } 

  console.log(`hourDiff = ${hourDiff}, minDiff = ${minDiff}, secDiff=${secDiff}`);

  setDiff({hours:hourDiff, minutes: minDiff, seconds: secDiff});

}

const addPractice = () => {
  
  
  console.log(`pTime = ${pTime}`);
  const pDate = stringTimeToDate(pTime);
  console.log(`pDate = ${pDate}`);
  
  const hours = pDate.getHours() + diff.hours;
  let minutes = pDate.getMinutes() + diff.minutes;
  let seconds = pDate.getSeconds() + diff.seconds;

  minutes = minutes + (hours*60);
  if (seconds > 59) {
    minutes++;
    seconds -= 60;
  }

  if (seconds < 0) {
    minutes--;
    seconds +=60;
  }

  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  setPractices([...practices, {unedited:pTime,edited:`${minutes}:${seconds}`}]);
}

const msToMMSS = (ms) => {
  console.log(`ms = ${ms}`);
  let hours = Math.floor(ms / 1000 / 60 / 60);
  ms -= hours * 1000 * 60 * 60;
  let minutes = Math.floor(ms / 1000 / 60);
  ms -= minutes * 1000 * 60;
  let seconds = Math.floor(ms / 1000);

  minutes += 60*hours;

  const mmss = `${minutes}:${hours}`;
  console.log(`mmss = ${mmss}`);

  return mmss;

};

const setUneditedPractice = (index, unedited) => {
  practices[index].unedited = unedited;
}

  return (
    <Container maxWidth="md">
      <Paper style={{ padding: '0.5em', marginTop: '2em' }} elevation={6}>
          <Grid container spacing={1} >
            <Grid item xs={6}>
              <div>Time Difference</div>
              <TextField label="first timestamp - unedited (h:mm:ss)" variant="outlined" value={ftUnedited} onChange={(e) => { setftUnedited(e.target.value) }} />
              <TextField label="first timestamp - edited (h:mm:ss)" variant="outlined" value={ftEdited} onChange={(e) => { setftEdited(e.target.value) }} />
              <Button onClick={calcDiff}>Calc Diff</Button>
            </Grid>
            <Grid item xs={6}>
              <div>Practices</div>
              <TextField label="timestamp to convert - (mm:ss)" variant="outlined" value={pTime} onChange={(e) => { setpTime(e.target.value) }} />
              <Button onClick={addPractice}>Add</Button>
                <List>
                {practices.map((practice, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={practice.unedited} secondary={practice.edited} />
                  </ListItem>
                ))}
                </List>
            </Grid>
          </Grid>
      </Paper>
    </Container>
  );
}

export default App;
