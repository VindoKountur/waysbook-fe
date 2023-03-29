import React from "react";
import { Button, Label, Textarea, TextInput, Spinner } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import { BookFormType } from "../../utils/types";
import { API } from "../../config/api";
import Swal from "sweetalert2";

const AddBook = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<BookFormType>();
  const [isLoading, setIsLoading] = React.useState(false);

  const submitHandler: SubmitHandler<BookFormType> = (data) => {
    handleAddBook.mutate(data);
  };

  const handleAddBook = useMutation(async (data: BookFormType) => {
    try {
      setIsLoading(true);
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

      await API.post("/book", formData, config);

      Swal.fire({
        text: "New Book Added",
        timer: 1000,
        icon: "success",
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin/books");
        // setProduct(resetValue);
        // setImagePreview(noProductImg);
        // setPhotoName("Choose a photo");
      });
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: "info",
        timer: 1500,
        text: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="bg-white">
      <div className="px-4 lg:px-20 py-10">
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
              required={true}
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
              required={true}
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="date" value="Publication Date" />
              </div>
              <TextInput
                {...register("publication_date")}
                id="date"
                type="date"
                required={true}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="pages" value="Total Pages" />
              </div>
              <TextInput
                {...register("pages")}
                id="pages"
                type="number"
                required={true}
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="isbn" value="ISBN" />
              </div>
              <TextInput
                {...register("isbn")}
                id="isbn"
                type="text"
                required={true}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="price" value="Price" />
              </div>
              <TextInput
                {...register("price")}
                id="price"
                type="number"
                required={true}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mb-2 block">
              <Label htmlFor="about" value="About This Book" />
            </div>
            <Textarea
              {...register("about")}
              id="about"
              placeholder=""
              required={true}
              rows={4}
            />
          </div>
          <div className="flex justify-between flex-col md:flex-row gap-4">
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="thumbnail" value="Book Thumbnail" />
              </div>
              <TextInput
                {...register("thumbnail")}
                id="thumbnail"
                type="file"
                required={true}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="content" value="Book Attechment" />
              </div>
              <TextInput
                {...register("content")}
                id="content"
                type="file"
                required={true}
              />
            </div>
          </div>

          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <Spinner aria-label="Medium sized spinner example" size="md" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
