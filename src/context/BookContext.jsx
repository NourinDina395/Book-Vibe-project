import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addReadListToLocalDB,
  getAllReadListFromLocalDB,
} from "../utils/localDB";

export const BookContext = createContext();

const BookProvider = ({ children }) => {
  const [readList, setReadList] = useState(() => getAllReadListFromLocalDB());
  const [wishList, setWishList] = useState([]);


  console.log(readList, "readList");

  const handleMarkAsRead = (currentBook) => {
    // step 1: store book id or store book object
    // step 2: where to store
    // step 2: array or collection
    //  step 3: If the book is already exist then show a alert or toast
    // step 4: if not then add the book in the array or collection

    addReadListToLocalDB(currentBook);

    const isExistBook = readList.find(
      (book) => book.bookId === currentBook.bookId,
    );

    if (isExistBook) {
      toast.error("The book is already exist");
    } else {
      setReadList([...readList, currentBook]);
      toast.success(`${currentBook.bookName} is added to read list`);
    }

    console.log(currentBook, readList, "book");
  };

  const handleWishList = (currentBook) => {
    // step 1: store book id or store book object
    // step 2: where to store
    // step 2: array or collection
    //  step 3: If the book is already exist then show a alert or toast
    // step 4: if not then add the book in the array or collection

    const isExistInReadList = readList.find(
      (book) => book.bookId === currentBook.bookId,
    );

    if (isExistInReadList) {
      toast.error("This book is already in read list");
      return;
    }

    const isExistBook = wishList.find(
      (book) => book.bookId === currentBook.bookId,
    );

    if (isExistBook) {
      toast.error("The book is already exist");
    } else {
      setWishList([...wishList, currentBook]);
      toast.success(`${currentBook.bookName} is added to wish list`);
    }

    console.log(currentBook, readList, "book");
  };

  const data = {
    readList,
    setReadList,
    handleMarkAsRead,
    wishList,
    setWishList,
    handleWishList,
  };
  return <BookContext.Provider value={data}>{children}</BookContext.Provider>;
};

export default BookProvider;
