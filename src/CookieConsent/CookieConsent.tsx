import { useState, useEffect } from "react";

import { Button, Dialog, DialogContent, Typography } from "@mui/material";

const COOKIE_CONSENT_KEY = "net.noreta.cookie-consent" as const;

export const ConsentState = {
    Granted: 'granted',
    Denied: 'denied'
} as const;
export type ConsentState = (typeof ConsentState)[keyof typeof ConsentState]

export default function CookieConsent({ onConsentChange }: { onConsentChange: (state: ConsentState) => void }) {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleContent = (state: ConsentState) => {
        onConsentChange(state);
        if (state === ConsentState.Granted) {
            const consentState = {
                analytics_storage: ConsentState.Granted,
                ad_storage: ConsentState.Denied,
                ad_user_data: ConsentState.Denied,
                ad_personalization: ConsentState.Denied
            };
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState));
        } else {
            const consentState = {
                analytics_storage: ConsentState.Denied,
                ad_storage: ConsentState.Denied,
                ad_user_data: ConsentState.Denied,
                ad_personalization: ConsentState.Denied
            };
            localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentState));
        }
        setOpen(false);
    }

    // console.log(window.dataLayer);

    useEffect(() => {
        async function fetchData() {
            const stateStr = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (stateStr === null) {
                setOpen(true);
            } else {
                const state = JSON.parse(stateStr) as ConsentState;
                onConsentChange(state);
            }
        }
        fetchData();
    }, []);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <Typography>当サイトではCookieを使用し、サイトの利用状況を分析します。</Typography>
                <Button onClick={() => handleContent(ConsentState.Granted)}>許可する</Button>
                <Button onClick={() => handleContent(ConsentState.Denied)}>拒否する</Button>
            </DialogContent>
        </Dialog>
    );

}