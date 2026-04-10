import React from "react";
import Banner from "../../components/homepage/Banner";
import AllBooks from "../../components/homepage/AllBooks";
import { BookContext } from "../../context/BookContext";

const Homepage = () => {
  return (
    <div>
      <Banner />
      <AllBooks />
    </div>
  );
};

export default Homepage;
