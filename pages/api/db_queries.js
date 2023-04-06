const Pool = require("pg").Pool;
const pool = new Pool({
  user: "spacegold",
  host: "localhost",
  database: "work_play",
  port: 5432,
});

// experiment in SQL db called WorkPlay
// id | json_dump | is_work_related | prompt_vars | prompt | response
const getWorkPlay = async (request, response, completion) => {
  console.log("completion data ", completion.data.choices[0].message.content);
  return pool.query(
    "INSERT INTO",
    (error, results) => {
      if (error) {
        console.log("err ", error);
        throw error;
      }
      //   console.log("db_query results ", results);
      //   return results;
      // response.status(200).json(results.rows);
    }
  );
};
export { getWorkPlay };
