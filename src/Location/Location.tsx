
import { useState, useEffect } from "react";

import { Box } from "@mui/material";

import { LatLngSearch } from "./LatLngSearch";
import { CommonFooter } from "../Common/CommonFooter";

export default function Location() {

    const [position, setPosition] = useState<GeolocationCoordinates>();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition(pos.coords);
            });
        }
    }, []);

    return (
        <>
            <main>
                {(!position?.latitude || !position.longitude) && (
                    <Box sx={{ m: 2 }}>位置情報が無効です</Box>
                )}
                {position?.latitude && position.longitude && (
                    <LatLngSearch {...position} />
                )}
            </main>
            <Box sx={{ my: 2 }}>
                <CommonFooter></CommonFooter>
            </Box>
        </>
    );
}
