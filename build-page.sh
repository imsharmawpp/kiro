#!/bin/bash
# Concatenates page parts into index.html
cat parts/01-head.html parts/02-body-top.html parts/03-connectivity.html parts/04-body-mid.html parts/05-body-bottom.html parts/06-scripts.html > index.html
echo "Built index.html ($(wc -l < index.html) lines, $(du -h index.html | cut -f1))"
