import { festivalConfig } from "../../../config/festival";

export default function Head() {
  return <title>{festivalConfig.festivalName} | 概要</title>;
}
