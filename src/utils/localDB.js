const getAllReadListFromLocalDB = () => {
  const allReadList = localStorage.getItem("readList");

  if (allReadList) return JSON.parse(allReadList);

  return [];
};

const addReadListToLocalDB = (book) => {
  const allBooks = getAllReadListFromLocalDB();
  const isAlreadyExist = allBooks.find((bk) => bk.bookId === book.bookId);
  if (!isAlreadyExist){
    // Ei data ta local db te add krte chai
    allBooks.push(book);
    localStorage.setItem("readList", JSON.stringify(allBooks))
  }
};

export { getAllReadListFromLocalDB, addReadListToLocalDB };
