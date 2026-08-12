import random

from app.algorithms import (
    insertion_sort_count,
    binary_search_count,
    linear_search_count,
)


def generate_dataset(size):
    return [
        {
            "id": i,
            "title": f"Task {i}"
        }
        for i in range(size)
    ]


def run_benchmark(size):

    tasks = generate_dataset(size)

    random.shuffle(tasks)


    # -----------------------------
    # Insertion sort
    # -----------------------------

    sort_data = tasks.copy()

    sort_comparisons = insertion_sort_count(
        sort_data,
        key=lambda task: task["title"]
    )


    # -----------------------------
    # Linear search
    # -----------------------------

    target = f"Task {size - 1}"

    _, linear_comparisons = linear_search_count(
        tasks,
        target,
        key=lambda task: task["title"]
    )


    # -----------------------------
    # Binary search
    # -----------------------------

    binary_data = tasks.copy()

    insertion_sort_count(
        binary_data,
        key=lambda task: task["title"]
    )

    _, binary_comparisons = binary_search_count(
        binary_data,
        target,
        key=lambda task: task["title"]
    )


    return {
        "dataset_size": size,
        "insertion_sort_comparisons": sort_comparisons,
        "linear_search_comparisons": linear_comparisons,
        "binary_search_comparisons": binary_comparisons,
    }


def main():

    sizes = [
        10,
        500,
        3000
    ]


    with open(
        "benchmark_results.txt",
        "w",
        encoding="utf-8"
    ) as file:

        for size in sizes:

            result = run_benchmark(size)

            file.write(
                f"{result}\n"
            )


if __name__ == "__main__":
    main()