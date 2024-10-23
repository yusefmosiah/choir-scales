#!/bin/bash

# Get current date and time in EDT
TODAY=$(TZ="America/New_York" date "+%Y-%m-%d %H:%M EDT")

# Function to add separator and header
add_separator() {
    echo -e "\n"
    echo "=="
    echo "$1"
    echo "$TODAY"
    echo "=="
    echo -e "\n"
}

# Create concatenated docs by prefix
{
    echo "# Level Documentation - Understanding Progression"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Level*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Levels.md

{
    echo "# Core Documentation - Fundamental Concepts"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Core_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Core.md

{
    echo "# Meta Documentation - Documentation About Documentation"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Meta_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Meta.md

{
    echo "# Theory Documentation - Mathematical Foundations"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Theory_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Theory.md

{
    echo "# Model Documentation - System Patterns"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Model_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Model.md

{
    echo "# Implementation Documentation - Technical Details"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Impl_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Impl.md

{
    echo "# Entry Documentation - Getting Started"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Entry_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Entry.md

{
    echo "# Development Documentation - Building Choir"
    echo "Generated: $TODAY"
    echo -e "\n"
    for file in docs/Dev_*; do
        add_separator "$(basename "$file" .md)"
        cat "$file"
    done
} > docs/combined/Combined_Dev.md

echo "Created 8 combined documentation files with formatted separators"
