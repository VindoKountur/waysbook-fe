import { Table } from "flowbite-react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { API } from "../../config/api";
import { BookType } from "../../utils/types";
import { publishDateFormat, formatRp } from "../../utils/func";

const ListBooks = () => {
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const res: { data: { data: BookType[] } } = await API.get("/books");
      return res.data.data;
    } catch (error) {}
  };

  let { data: books, refetch: refetchBooks } = useQuery("books", fetchBooks);

  const execDeleteBook = useMutation(async (id: number) => {
    await API.delete("/book/" + id);
    refetchBooks();
  });
  const handleDelete = async (id: number, bookTitle: string) => {
    try {
      const { value } = await Swal.fire({
        icon: "warning",
        title: "Delete Product?",
        text: `Name : ${bookTitle}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
        confirmButtonColor: "red",
      });
      if (value) {
        execDeleteBook.mutate(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="!bg-transparent lg:mx-28 mx-7">
      <h3 className="font-bold py-3">Book List</h3>

      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>No</Table.HeadCell>
          <Table.HeadCell>Thumbnail</Table.HeadCell>
          <Table.HeadCell>Title</Table.HeadCell>
          <Table.HeadCell>Author</Table.HeadCell>
          <Table.HeadCell>ISBN</Table.HeadCell>
          <Table.HeadCell>Publication Date</Table.HeadCell>
          <Table.HeadCell>Pages</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {books?.map((book, idx) => (
            <Table.Row
              key={idx}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {idx + 1}
              </Table.Cell>
              <Table.Cell>
                <img width={40} src={book.thumbnail} />
              </Table.Cell>
              <Table.Cell>{book.title}</Table.Cell>
              <Table.Cell>{book.author}</Table.Cell>
              <Table.Cell>{book.isbn}</Table.Cell>
              <Table.Cell>
                {publishDateFormat(book.publication_date)}
              </Table.Cell>
              <Table.Cell>{book.pages}</Table.Cell>
              <Table.Cell>{formatRp(book.price)}</Table.Cell>
              <Table.Cell className="h-full">
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/admin/book/update/" + book.id)}
                    className="font-medium h-full text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id, book.title)}
                    className="font-medium text-red-600 hover:underline dark:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ListBooks;
