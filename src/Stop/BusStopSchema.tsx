import { BusStop } from "schema-dts";
import { JsonLd } from "react-schemaorg";
import { Schema } from "../../amplify/data/resource";

export function BusStopSchema({ stop }: { stop: Schema["Stop"]["type"] }) {
  return (
    <JsonLd<BusStop>
      item={{
        "@context": "https://schema.org",
        "@type": "BusStop",
        name: stop.stop_name!,
        latitude: stop.stop_lat!,
        longitude: stop.stop_lon!,
        url: stop.stop_url!,
      }}
    />
  );
}
