#!/bin/bash

# Function to add separator and header
add_separator() {
    echo -e "\n"
    echo "=="
    echo "$1"
    echo "=="
    echo -e "\n"
}

# Get unique prefixes (everything before _), excluding 'tree'
prefixes=$(ls docs/*_*.md | sed 's/docs\///g' | grep -v 'tree' | cut -d'_' -f1 | sort -u)

# For each prefix, create a combined file
for prefix in $prefixes; do
    # Create title from prefix
    title="${prefix} Documentation"
    case $prefix in
        "Core") subtitle="- Fundamental Concepts" ;;
        "Dev") subtitle="- Building Choir" ;;
        "Entry") subtitle="- Getting Started" ;;
        "Impl") subtitle="- Technical Details" ;;
        "Level") subtitle="- Understanding Progression" ;;
        "Meta") subtitle="- Documentation About Documentation" ;;
        "Model") subtitle="- System Patterns" ;;
        "Theory") subtitle="- Mathematical Foundations" ;;
        *) subtitle="" ;;
    esac

    # Create combined file
    {
        echo "# ${title} ${subtitle}"
        echo -e "\n"

        # Concatenate all files with this prefix, excluding tree
        for file in docs/${prefix}_*.md; do
            if [ -f "$file" ] && ! grep -q "tree" <<< "$file"; then
                add_separator "$(basename "$file" .md)"
                cat "$file"
            fi
        done
    } > "docs/combined/Combined_${prefix}.md"

    echo "Created Combined_${prefix}.md"
done

echo "Documentation combination complete"
