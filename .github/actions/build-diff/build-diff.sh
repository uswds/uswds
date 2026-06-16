#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$1"
HEAD_DIR="$2"
OUTPUT_DIR="$3"
SECTION_TITLE="$4"
IGNORE_PATTERNS="${5:-}"

if [[ ! -d "$BASE_DIR" ]]; then
  echo "Error: base directory does not exist: $BASE_DIR" >&2
  exit 1
fi

if [[ ! -d "$HEAD_DIR" ]]; then
  echo "Error: head directory does not exist: $HEAD_DIR" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

# Configuration constants

# Helper: format file size
format_size() {
  local bytes=$1
  if (( bytes >= 1048576 )); then
    echo "$(awk "BEGIN {printf \"%.1f\", $bytes/1048576}") MB"
  elif (( bytes >= 1024 )); then
    echo "$(awk "BEGIN {printf \"%.1f\", $bytes/1024}") KB"
  else
    echo "${bytes} B"
  fi
}

# Helper: format diff string with optional percentage
format_diff_string() {
  local diff_bytes=$1
  local base_size=${2:-0}
  local formatted_size=$(format_size ${diff_bytes#-})

  if (( base_size > 0 )); then
    local pct=$(awk "BEGIN {printf \"%.1f\", ($diff_bytes/$base_size)*100}")
    if (( diff_bytes >= 0 )); then
      echo "+${formatted_size} (+${pct}%)"
    else
      echo "-${formatted_size} (${pct}%)"
    fi
  else
    if (( diff_bytes >= 0 )); then
      echo "+${formatted_size}"
    else
      echo "-${formatted_size}"
    fi
  fi
}

# Collect all unique file paths from both directories
{
  (cd "$BASE_DIR" && find . -type f | sed 's|^\./||' | sort)
  (cd "$HEAD_DIR" && find . -type f | sed 's|^\./||' | sort)
} | sort -u > "$OUTPUT_DIR/all-files.txt"

# Categorize files
declare -a added_files=()
declare -a deleted_files=()
declare -a modified_files=()
declare -a unchanged_files=()

while IFS= read -r file; do
  if [[ "$file" == *..* ]] || [[ "$file" == /* ]]; then
    echo "Warning: skipping file with unsafe path: $file" >&2
    continue
  fi

  for pattern in $IGNORE_PATTERNS; do
    if [[ "$file" == $pattern ]]; then
      continue 2
    fi
  done

  base_path="$BASE_DIR/$file"
  head_path="$HEAD_DIR/$file"

  if [[ ! -f "$base_path" ]]; then
    added_files+=("$file")
  elif [[ ! -f "$head_path" ]]; then
    deleted_files+=("$file")
  elif ! diff -q "$base_path" "$head_path" > /dev/null 2>&1; then
    modified_files+=("$file")
  else
    unchanged_files+=("$file")
  fi
done < "$OUTPUT_DIR/all-files.txt"

total_changes=$(( ${#added_files[@]} + ${#deleted_files[@]} + ${#modified_files[@]} ))

# Calculate total size delta
total_base_size=0
total_head_size=0

for file in "${modified_files[@]}"; do
  base_size=$(stat -c%s "$BASE_DIR/$file" 2>/dev/null || echo "0")
  head_size=$(stat -c%s "$HEAD_DIR/$file" 2>/dev/null || echo "0")
  total_base_size=$(( total_base_size + base_size ))
  total_head_size=$(( total_head_size + head_size ))
done

for file in "${added_files[@]}"; do
  head_size=$(stat -c%s "$HEAD_DIR/$file" 2>/dev/null || echo "0")
  total_head_size=$(( total_head_size + head_size ))
done

for file in "${deleted_files[@]}"; do
  base_size=$(stat -c%s "$BASE_DIR/$file" 2>/dev/null || echo "0")
  total_base_size=$(( total_base_size + base_size ))
done

total_delta=$(( total_head_size - total_base_size ))

# Build compact summary report
{
  echo "### $SECTION_TITLE"
  echo ""

  if (( total_changes == 0 )); then
    echo "✓ No changes"
  else
    echo "**Files changed:** $total_changes (${#modified_files[@]} modified, ${#added_files[@]} added, ${#deleted_files[@]} deleted)"
    echo ""
    echo "**Size change:** $(format_diff_string $total_delta $total_base_size)"
  fi
  echo ""
} > "$OUTPUT_DIR/report.md"

