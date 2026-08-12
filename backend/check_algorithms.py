from app.algorithms import (
    insertion_sort,
    binary_search,
    linear_search,
)


def check(condition):
    if not condition:
        raise AssertionError("Algorithm check failed")

    print("PASS")


# insertion sort
data = [5, 2, 4, 1, 3]
original_id = id(data)

insertion_sort(data)

check(data == [1, 2, 3, 4, 5])
check(id(data) == original_id)


# empty list
data = []

insertion_sort(data)

check(data == [])


# already sorted
data = [1, 2, 3, 4, 5]

insertion_sort(data)

check(data == [1, 2, 3, 4, 5])


# reverse sorted
data = [5, 4, 3, 2, 1]

insertion_sort(data)

check(data == [1, 2, 3, 4, 5])


# binary search
data = [1, 2, 3, 4, 5]

check(binary_search(data, 1) == 0)
check(binary_search(data, 3) == 2)
check(binary_search(data, 5) == 4)
check(binary_search(data, 99) == -1)


# binary empty
check(binary_search([], 10) == -1)


# linear search
data = [10, 20, 30, 40, 50]

check(linear_search(data, 10) == 0)
check(linear_search(data, 30) == 2)
check(linear_search(data, 50) == 4)
check(linear_search(data, 99) == -1)


# linear empty
check(linear_search([], 10) == -1)