import { useState, useEffect } from "react";

import { algoliasearch, Hit } from "algoliasearch";
import { BaseHit } from "instantsearch.js";
import Box from "@mui/material/Box";

import { SearchHit } from "../Home/SearchHit";

export function LatLngSearch({ position }: { position: GeolocationCoordinates }) {
    const [hits, setHits] = useState<BaseHit>();
    const appID = "4QC6DKEQDN";
    const apiKey = "266e2d468394f84445aeba796968f816";
    const indexName = "stops-index";
    const latlng = position.latitude + "," + position.longitude;
    console.log("latlng = ", latlng);

    const client = algoliasearch(appID, apiKey);

    useEffect(() => {
        const fetchData = async () => {
            const response = await client.searchSingleIndex({
                indexName: indexName,
                searchParams: {
                    aroundLatLng: latlng,
                    aroundRadius: 1000,
                },
            });
            // console.log(response.hits);
            setHits(response.hits as BaseHit);
        }
        fetchData();
    }, []);

    return (
        <>
            {hits && hits.map((hit: Hit) => <SearchHit hit={hit} key={hit.objectID} />)}
            {hits && hits.length === 0 && (
                <Box sx={{ m: 2 }}>近くに登録されたバス停がありません</Box>
            )}
        </>
    );
}