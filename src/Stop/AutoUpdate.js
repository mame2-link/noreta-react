import { useEffect, useState } from "react";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
// import Box from '@mui/material/Box';
// import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';

// const TIMER = 30;
const NEXT = 35;
function secondsUntilNext() {
    const now = new Date();
    const currentHours = now.getHours();
    // 夜中の2-4時台は更新しない 次回は5時
    if (currentHours >= 2 && currentHours <= 4) {
        const ts = now.getTime();
        now.setHours(5, 0, NEXT, 0);
        const ts5 = now.getTime();
        return (ts5 - ts) / 1000;
    }
    const currentSeconds = now.getSeconds();
    if (currentSeconds === NEXT) {
        return 60;
    } else if (currentSeconds < NEXT) {
        return NEXT - currentSeconds;
    } else {
        return 60 + NEXT - currentSeconds;
    }
}

export function AutoUpdate(props) {
    console.log("AutoUPdate!");
    const [checked, setChecked] = useState(false);
    // const [count, setCount] = useState(TIMER);
    const handleFetchData = props.handleFetchData;

    useEffect(() => {
        console.log("AutoUpdate useEffect");
        if (checked) {
            // setCount(TIMER);
            const r = Math.floor(Math.random() * 5000); // 5秒程度ランダムでずらす
            const delay = secondsUntilNext() * 1000 + r;
            
            console.log(`delay = ${delay}`)
            // let n = TIMER
            // setTimeout(() => {
            //     const intervalId = setInterval(() => {
            //         // // setCount(prevCount => prevCount - 1);
            //         // n = n - 1;
            //         // if (n < 1) {
            //         //     // setCount(TIMER);
            //         //     n = TIMER;
            //         //     handleFetchData();
            //         // }
            //         // console.log(n);
            //         handleFetchData();
            //     }, 60000);
            //     return () => { console.log("clearInterval"); clearInterval(intervalId) };
            // }, nextUpdate);
            // (function loop() {
            //     const delay = secondsUntilNext30() * 1000;
            //     if (!checked) return;
            //     setTimeout(() => {
            //         console.log(new Date());
            //         handleFetchData();
            //         loop();
            //     }, delay);
            // })();
            const intervalId = setInterval(() => {
                console.log(Date());
                handleFetchData();
            }, delay);
            return () => { console.log("clearInterval"); clearInterval(intervalId) };

        }
    }, [checked, handleFetchData]);

    const handleChange = (e) => {
        setChecked(e.target.checked);
    }

    return (
        <Stack direction="row" sx={{ mx: 4, my: 2 }}>
            <FormGroup row>
                <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} label="自動更新" />
            </FormGroup>
            {/* <Box>
                {checked && <Typography>{count}秒後に更新されます</Typography>}
            </Box> */}
        </Stack>
    );
}