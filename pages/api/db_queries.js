const Pool = require("pg").Pool;
const pool = new Pool({
  user: "spacegold",
  host: "localhost",
  database: "work_play",
  port: 5432,
});

const getWorkPlay = (request, response) => {
  pool.query("SELECT * FROM work_play ORDER BY id ASC", (error, results) => {
    if (error) {
      console.log("err ", error);
      throw error;
    }
    console.log("results ", resutls);
    response.status(200).json(results.rows);
  });
};
export { getWorkPlay };
