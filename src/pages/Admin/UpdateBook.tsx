import React from "react";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { BookFormType, BookType } from "../../utils/types";
import { API } from "../../config/api";
import Swal from "sweetalert2";

const UpdateBook = () => {
  const { id } = useParams();

  const getBook = async () => {
    const res: { data: { data: BookType } } = await API.get("/book/" + id);
    return res.data.data;
  };

  // const { data : book } = useQuery("getBook", getBook)

  const { register, handleSubmit } = useForm<BookFormType>({
    defaultValues: getBook,
  });

  const submitHandler: SubmitHandler<BookFormType> = (data) => {
    handleAddBook.mutate(data);
  };

  const handleAddBook = useMutation(async (data: BookFormType) => {
    try {
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("author", data.author);
      formData.set("publication_date", data.publication_date);
      formData.set("pages", data.pages + "");
      formData.set("isbn", data.isbn);
      formData.set("price", data.price + "");
      formData.set("about", data.about);
      formData.set("thumbnail", data.thumbnail[0]);
      formData.set("content", data.content[0]);

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      await API.patch("/book/" + id, formData, config);

      Swal.fire({
        text: "Book Updated",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      }).then(() => {
        // setProduct(resetValue);
        // setImagePreview(noProductImg);
        // setPhotoName("Choose a photo");
      });
    } catch (error: any) {
      console.log(error);
    }
  });

  return (
    <div className="bg-white">
      <div className="px-20 py-10">
        <h3 className="text-2xl font-bold">Add Book</h3>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-4 mt-10"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="title" value="Title" />
            </div>
            <TextInput
              {...register("title")}
              id="title"
              type="text"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="author" value="Author" />
            </div>
            <TextInput
              {...register("author")}
              id="author"
              type="text"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="date" value="Publication Date" />
            </div>
            <TextInput
              {...register("publication_date")}
              id="date"
              type="date"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="pages" value="Total Pages" />
            </div>
            <TextInput
              {...register("pages")}
              id="pages"
              type="number"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="isbn" value="ISBN" />
            </div>
            <TextInput
              {...register("isbn")}
              id="isbn"
              type="text"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price" />
            </div>
            <TextInput
              {...register("price")}
              id="price"
              type="number"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="about" value="About This Book" />
            </div>
            <Textarea
              {...register("about")}
              id="about"
              placeholder=""
              rows={4}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="thumbnail" value="Book Thumbnail" />
            </div>
            <TextInput
              {...register("thumbnail")}
              id="thumbnail"
              type="file"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="content" value="Book Attechment" />
            </div>
            <TextInput
              {...register("content")}
              id="content"
              type="file"
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
