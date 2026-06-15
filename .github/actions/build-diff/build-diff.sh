#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$1"
HEAD_DIR="$2"
OUTPUT_DIR="$3"
SECTION_TITLE="$4"

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
BINARY_EXTENSIONS="woff|woff2|ttf|eot|png|jpg|jpeg|gif|ico|webp"
MAX_CHANGES_BEFORE_COLLAPSE=50
MAX_DIFF_LINES_PER_FILE=50
MAX_TOTAL_DIFF_LINES=200

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

# Helper: check if file is binary
is_binary() {
  local file="$1"
  local ext="${file##*.}"
  [[ "$ext" =~ ^($BINARY_EXTENSIONS)$ ]]
}

# Helper: format summary line
format_summary() {
  local total=$1 modified=$2 added=$3 deleted=$4 unchanged=$5
  echo "**Summary**: $total files changed ($modified modified, $added added, $deleted deleted), $unchanged unchanged."
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

# Build markdown table
{
  echo "### $SECTION_TITLE"
  echo ""

  if (( total_changes == 0 )); then
    echo "> No differences found between builds."
    echo ""
  else
    # If more than MAX_CHANGES_BEFORE_COLLAPSE changes, collapse the table
    if (( total_changes > MAX_CHANGES_BEFORE_COLLAPSE )); then
      format_summary "$total_changes" "${#modified_files[@]}" "${#added_files[@]}" "${#deleted_files[@]}" "${#unchanged_files[@]}"
      echo ""
      echo "<details><summary>Show detailed file list</summary>"
      echo ""
    fi

    echo "| Status | File | Size (develop) | Size (PR) | Diff |"
    echo "|--------|------|---------------|-----------|------|"

    # Modified files
    for file in "${modified_files[@]}"; do
      base_size=$(stat -c%s "$BASE_DIR/$file" 2>/dev/null || echo "0")
      head_size=$(stat -c%s "$HEAD_DIR/$file" 2>/dev/null || echo "0")
      diff_bytes=$(( head_size - base_size ))
      diff_str=$(format_diff_string "$diff_bytes" "$base_size")

      echo "| \`modified\` | \`$file\` | $(format_size $base_size) | $(format_size $head_size) | $diff_str |"
    done

    # Added files
    for file in "${added_files[@]}"; do
      head_size=$(stat -c%s "$HEAD_DIR/$file" 2>/dev/null || echo "0")
      echo "| \`added\` | \`$file\` | - | $(format_size $head_size) | +$(format_size $head_size) |"
    done

    # Deleted files
    for file in "${deleted_files[@]}"; do
      base_size=$(stat -c%s "$BASE_DIR/$file" 2>/dev/null || echo "0")
      echo "| \`deleted\` | \`$file\` | $(format_size $base_size) | - | -$(format_size $base_size) |"
    done

    echo ""

    if (( total_changes <= MAX_CHANGES_BEFORE_COLLAPSE )); then
      format_summary "$total_changes" "${#modified_files[@]}" "${#added_files[@]}" "${#deleted_files[@]}" "${#unchanged_files[@]}"
      echo ""
    else
      echo "</details>"
      echo ""
    fi
  fi
} > "$OUTPUT_DIR/report.md"

# Generate text diff for non-binary modified files
{
  for file in "${modified_files[@]}"; do
    if ! is_binary "$file"; then
      echo "--- develop/$file"
      echo "+++ pr/$file"
      diff -u "$BASE_DIR/$file" "$HEAD_DIR/$file" 2>/dev/null | tail -n +3 | head -${MAX_DIFF_LINES_PER_FILE} || true
      echo ""
    fi
  done
} > "$OUTPUT_DIR/text-diff.patch"

# Append collapsible diff to report if non-empty
if [[ -s "$OUTPUT_DIR/text-diff.patch" ]]; then
  {
    echo "<details><summary>Text diff for non-binary changed files (click to expand)</summary>"
    echo ""
    echo '```diff'
    # Limit to first MAX_TOTAL_DIFF_LINES lines to keep comment manageable
    head -${MAX_TOTAL_DIFF_LINES} "$OUTPUT_DIR/text-diff.patch"
    if (( $(wc -l < "$OUTPUT_DIR/text-diff.patch") > MAX_TOTAL_DIFF_LINES )); then
      echo ""
      echo "... (truncated, see full diff in artifact)"
    fi
    echo '```'
    echo ""
    echo "</details>"
  } >> "$OUTPUT_DIR/report.md"
fi
