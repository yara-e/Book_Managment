import { findCategoryService, deleteCategoryService, updateCategoryService } from "../category.service";
import { findCategoryRepo, deleteCategoryRepo, updateCategoryRepo } from "../category.repository";
import { AppError } from "../../../common/error/AppError";



jest.mock("../category.repository", () => ({
  findCategoryRepo: jest.fn(),
  deleteCategoryRepo: jest.fn(),
  updateCategoryRepo: jest.fn(),
}));

describe("Category Service", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //find category tests

  test("should return category when found", async () => {

    (findCategoryRepo as any).mockResolvedValue({
      id: 1,
      name: "Fiction",
      description: "Fiction books including novels and literature."
    });

    const result = await findCategoryService(1);

    expect(result.id).toBe(1);
  });


  test("should throw 404 when category not found", async () => {

    (findCategoryRepo as any).mockResolvedValue(null);

    await expect(findCategoryService(988))
      .rejects
      .toThrow("Category not found");
  });


  // delete category tests

  test("should delete category successfully", async () => {

    (findCategoryRepo as any).mockResolvedValue({ id: 2 });
    (deleteCategoryRepo as any).mockResolvedValue(undefined);

    await deleteCategoryService(2);

    expect(deleteCategoryRepo).toHaveBeenCalledWith(2);
  });


  test("should throw 404 when deleting non existing category", async () => {

    (findCategoryRepo as any).mockResolvedValue(null);

    await expect(deleteCategoryService(100))
      .rejects
      .toThrow("Category not found");
  });


  test("should throw 409 when category has books", async () => {

    (findCategoryRepo as any).mockResolvedValue({ id: 3 });

    (deleteCategoryRepo as any).mockRejectedValue(
      new AppError("Cannot delete category because it contains books", 409)
    );

    await expect(deleteCategoryService(3))
      .rejects
      .toThrow("Cannot delete category because it contains books");
  });


  // update category tests

  test("should update category successfully", async () => {

    const updateData = {
      name: "Updated",
      description: "Updated Desc"
    };

    (findCategoryRepo as any).mockResolvedValue({ id: 4 });

    (updateCategoryRepo as any).mockResolvedValue({
      id: 4,
      ...updateData
    });

    const result = await updateCategoryService(4, updateData);

    expect(result.name).toBe("Updated");
    expect(updateCategoryRepo).toHaveBeenCalledWith(4, updateData);
  });


  test("should throw 404 when updating non existing category", async () => {

    (findCategoryRepo as any).mockResolvedValue(null);

    await expect(
      updateCategoryService(500, {
        name: "Updated",
        description: "Updated Desc"
      })
    ).rejects.toThrow("Category not found");
  });

});
