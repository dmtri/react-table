import Table from "./table";
import data from "./mockData";
// import axios from "axios";

// const dataSourceAsync = () => {
//   return new Promise((resolve) => {
//     window.setTimeout(() => {
//       resolve(axios.get("https://jsonplaceholder.typicode.com/posts"));
//     }, 500);
//   });
// };

function App() {
  return (
    <div className="App">
      <Table
        dataSource={data}
        // dataSource={dataSourceAsync}
        columns={[
          { title: "User ID", path: "userId" },
          { title: "Post ID", path: "id" },
          { title: "Title", path: "title" },
          { title: "Body", path: "body" },
        ]}
        searchColumn="userId"
        displayDebugInfo
      />
    </div>
  );
}

export default App;
