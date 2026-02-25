path = "cms/public/content/sql-intro.yaml"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "  - lesson:\n      button:\n        text: 'DISTINCT'"
end_marker = "  - lesson_category:\n      text: 'Functions'"

idx_start = content.find(start_marker)
idx_end = content.find(end_marker)
if idx_start == -1 or idx_end == -1:
    raise SystemExit(f"Markers not found: idx_start={idx_start}, idx_end={idx_end}")

block_to_move = content[idx_start:idx_end].rstrip()
after_removal = content[:idx_start].rstrip() + "\n" + end_marker + content[idx_end:]

insert_after = (
    "                        solution: 'SELECT * FROM t5'\n"
    "                        instructions: ''\n"
    "  - lesson_category:\n"
    "      text: 'Data types'"
)
insert_new = (
    "                        solution: 'SELECT * FROM t5'\n"
    "                        instructions: ''\n"
    + block_to_move
    + "\n"
    "  - lesson_category:\n"
    "      text: 'Data types'"
)

if insert_after not in after_removal:
    raise SystemExit("Insert marker not found in after_removal")
final = after_removal.replace(insert_after, insert_new, 1)
with open(path, "w", encoding="utf-8") as f:
    f.write(final)
print("Done")
