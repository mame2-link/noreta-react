// import { BusStop } from "schema-dts";
import { JsonLd } from "react-schemaorg";

export function BusStopSchema(props) {
  const stop = props.stop;
  return (
    <JsonLd
      item={{
        "@context": "https://schema.org",
        "@type": "BusStop",
        name: stop.stop_name,
        latitude: stop.stop_lat,
        longitude: stop.stop_lon,
        url: stop.stop_url,
      }}
    />
  );
}
