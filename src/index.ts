import { request, gql } from "graphql-request";
import colors from "colors";

// exported to do unit test later
async function fetchData() {
  const query = gql`
    {
      launchesPast {
        ships {
          name
          active
        }
        mission_name
      }
    }
  `;

  const data = await request("https://api.spacex.land/graphql/", query);
  return data.launchesPast;
}

// exported to do unit test later
export function filterMissions(missions: Array<any>) {
  const filtered_missions = missions.filter((m: any) => {
    if (!m?.ships.length) {
      return false;
    }

    const activeShips = m?.ships.filter((ms: any) => {  
      if (!ms?.name.length && !ms?.active) {
        return false;
      }
  
      return ms;
    });

    return activeShips;
  });
  
  return filtered_missions;
}

// exported to do unit test later
function buildCSV(filtered_missions: Array<any>) {
  let csv = "mission_name, ship_name";

  for (const m of filtered_missions) {
    for (const ship of m.ships) {
      csv = `${csv}\n${m?.mission_name},${ship?.name}`
    }
  }
  return csv;
}

// main
async function main() {
  const missions = await fetchData();
  
  const filtered_missions = filterMissions(missions);

  const csv = buildCSV(filtered_missions);

  console.log(colors.rainbow(csv));
}

main();

