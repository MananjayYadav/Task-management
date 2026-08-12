def insertion_sort(items, key=lambda x: x):
    """
    Sort items in-place using insertion sort.

    Returns:
        int: Number of comparisons performed.
    """
    comparisons = 0

    for i in range(1, len(items)):
        current = items[i]
        j = i - 1

        while j >= 0:
            comparisons += 1

            if key(items[j]) <= key(current):
                break

            items[j + 1] = items[j]
            j -= 1

        items[j + 1] = current

    return comparisons


def binary_search(items, target, key=lambda x: x):
    """
    Binary search on an already sorted list.

    Returns:
        int: Index of target, or -1.
    """
    low = 0
    high = len(items) - 1

    while low <= high:
        mid = (low + high) // 2

        if key(items[mid]) == target:
            return mid

        if key(items[mid]) < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


def linear_search(items, target, key=lambda x: x):
    """
    Sequential search.

    Returns:
        int: Index of target, or -1.
    """
    for i in range(len(items)):
        if key(items[i]) == target:
            return i

    return -1

def insertion_sort_count(items, key=lambda x: x):
    """
    Sort in-place and return comparison count.
    """
    return insertion_sort(items, key=key)


def binary_search_count(items, target, key=lambda x: x):
    """
    Binary search with comparison counting.

    Returns:
        tuple[int, int]:
            (index, comparisons)
    """
    low = 0
    high = len(items) - 1
    comparisons = 0

    while low <= high:
        mid = (low + high) // 2

        comparisons += 1

        current = key(items[mid])

        if current == target:
            return mid, comparisons

        if current < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1, comparisons


def linear_search_count(items, target, key=lambda x: x):
    """
    Linear search with comparison counting.

    Returns:
        tuple[int, int]:
            (index, comparisons)
    """
    comparisons = 0

    for i in range(len(items)):
        comparisons += 1

        if key(items[i]) == target:
            return i, comparisons

    return -1, comparisons