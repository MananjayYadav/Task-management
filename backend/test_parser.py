from app.ai_parser import parse_task_description


tests = [
    "urgent + ASAP finish project",
    "   ",
    "Finish report next Friday urgent",
    "Call client tomorrow tomorrow",
]


for text in tests:
    result = parse_task_description(text)

    print("\nINPUT:", repr(text))
    print("OUTPUT:", result)