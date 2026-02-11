import { findBookService, deleteBookService, updateBookService, createBookService } from "../book.service";
import { findBookRepo, deleteBookRepo, updateBookRepo, createBookRepo } from "../book.repository";
import { findCategoryService } from "../../categories/category.service";
import { AppError } from "../../../common/error/AppError";

jest.mock("../book.repository", () => ({
    findBookRepo: jest.fn(),
    deleteBookRepo: jest.fn(),
    updateBookRepo: jest.fn(),
    createBookRepo: jest.fn(),
}));

jest.mock("../../categories/category.service", () => ({
    findCategoryService: jest.fn(),
}));

describe("Book Service", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // find book tests 
    test("should return book when found", async () => {

        (findBookRepo as any).mockResolvedValue({ id: 1 });

        const result = await findBookService(1);

        expect(result.id).toBe(1);
    });


    test("should throw 404 when book not found", async () => {

        (findBookRepo as any).mockResolvedValue(null);

        await expect(findBookService(100))
            .rejects
            .toThrow("Book not found");
    });


    // delete book tests

    test("should delete book successfully", async () => {

        (findBookRepo as any).mockResolvedValue({ id: 2 });
        (deleteBookRepo as any).mockResolvedValue(undefined);

        await deleteBookService(2);

        expect(deleteBookRepo).toHaveBeenCalledWith(2);
    });


    test("should throw 404 when deleting non existing book", async () => {

        (findBookRepo as any).mockResolvedValue(null);

        await expect(deleteBookService(200))
            .rejects
            .toThrow("Book not found");
    });


    //update book tests
    test("should update book successfully", async () => {

        const updateData = { name: "Updated Book", categoryId: 1 };

        (findBookRepo as any).mockResolvedValue({ id: 3 });
        (findCategoryService as any).mockResolvedValue({ id: 1 });

        (updateBookRepo as any).mockResolvedValue({
            id: 3,
            ...updateData
        });

        const result = await updateBookService(3, updateData);

        expect(result.name).toBe("Updated Book");
    });


    test("should throw 404 when book id not found", async () => {

        (findBookRepo as any).mockResolvedValue(null);

        await expect(updateBookService(300, { name: "Updated Book" }))
            .rejects
            .toThrow("Book not found");
    });


    test("should throw 404 when category id not found during update", async () => {

        (findBookRepo as any).mockResolvedValue({ id: 4 });
        (findCategoryService as any).mockRejectedValue(
            new AppError("Category not found" , 404)
        );

        await expect(updateBookService(4, { categoryId: 99 }))
            .rejects
            .toThrow("Category not found");
    });


    // create book tests

    test("should create book successfully", async () => {

        const bookData = {
            name: "New Book",
            description: "Desc",
            price: 10,
            author: "Author",
            stock: 5,
            categoryId: 1
        };

        (findCategoryService as any).mockResolvedValue({ id: 1 });

        (createBookRepo as any).mockResolvedValue({
            id: 5,
            ...bookData
        });

        const result = await createBookService(bookData);

        expect(result.id).toBe(5);
    });


    test("should throw 404 when category id not found during create", async () => {

        (findCategoryService as any).mockRejectedValue(
            new Error("Category not found")
        );

        await expect(
            createBookService({
                name: "X",
                description: "Y",
                price: 10,
                author: "A",
                stock: 2,
                categoryId: 999
            })
        ).rejects.toThrow("Category not found");
    });


    ;

});
