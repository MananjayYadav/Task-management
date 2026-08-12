import re
from datetime import date, timedelta


def build_messages(description: str):
    return [
        {
            "role": "system",
            "content": (
                "Parse the task description and identify priority "
                "and due date."
            ),
        },
        {
            "role": "user",
            "content": description,
        },
    ]


def parse_task_description(description: str):
    text = description.strip()

    if not text:
        return {
            "title": "Untitled task",
            "priority": "medium",
            "due_date": None,
        }

    lower_text = text.lower()

    # -------------------------
    # Priority
    # -------------------------

    if re.search(r"\b(urgent|asap)\b", lower_text):
        priority = "high"

    elif re.search(r"\b(low priority|whenever)\b", lower_text):
        priority = "low"

    else:
        priority = "medium"

    # -------------------------
    # Due date
    # -------------------------

    today = date.today()
    due_date = None

    if re.search(r"\btoday\b", lower_text):
        due_date = today

    elif re.search(r"\btomorrow\b", lower_text):
        due_date = today + timedelta(days=1)

    elif re.search(r"\bnext week\b", lower_text):
        due_date = today + timedelta(days=7)

    else:
        weekdays = {
            "monday": 0,
            "tuesday": 1,
            "wednesday": 2,
            "thursday": 3,
            "friday": 4,
            "saturday": 5,
            "sunday": 6,
        }

        for name, weekday in weekdays.items():

            # next Friday
            if re.search(rf"\bnext {name}\b", lower_text):
                days_ahead = (weekday - today.weekday()) % 7

                if days_ahead == 0:
                    days_ahead = 7

                due_date = today + timedelta(days=days_ahead)
                break

            # Friday
            if re.search(rf"\b{name}\b", lower_text):
                days_ahead = (weekday - today.weekday()) % 7

                if days_ahead == 0:
                    days_ahead = 7

                due_date = today + timedelta(days=days_ahead)
                break

    # -------------------------
    # Remove priority keywords
    # -------------------------

    title = text

    title = re.sub(
        r"\b(urgent|asap|whenever|low priority)\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    # -------------------------
    # Remove dates
    # -------------------------

    title = re.sub(
        r"\bnext week\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\btoday\b|\btomorrow\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\bnext\s+"
        r"(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = " ".join(title.split()).strip()

    if not title:
        title = "Untitled task"

    return {
        "title": title,
        "priority": priority,
        "due_date": due_date,
    }