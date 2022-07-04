#!/bin/bash
rm -rf output && \
    node merger.js && \
    lint-openapi -e resolved/* && \
    node generator.js --skipDeploy && \
    sh generate.sh && \
    echo "TypeScript" && \
    for filename in output/typescript/*; do sh "$filename/publish.sh"; [ $? != 0 ] && exit 1; done && \
    echo "Completed Successfully"
