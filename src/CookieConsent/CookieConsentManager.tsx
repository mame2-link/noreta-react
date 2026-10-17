
const GA_MEASUREMENT_ID = "G-J7MPJ81QV6";

// import type ConsentState from "./CookieConsent";
import CookieConsent, { ConsentState } from "./CookieConsent";

export function CookieConsentManager() {

    const handleConsentStateChanged = (state: ConsentState) => {
        window.gtag?.('config', GA_MEASUREMENT_ID);
        window.gtag?.('consent', 'update', state as Gtag.ConsentParams);
    }
    return <CookieConsent onConsentChange={handleConsentStateChanged} />
}