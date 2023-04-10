
#!/bin/bash
set -e
IFS='|'

AUTHCONFIG="{\
\"userPoolId\": \"ap-southeast-1_ClqyVYv6m\",\
\"webClientId\": \"4rt2l9rmqe24vb79pupblc30o0\",\
\"identityPoolId\": \"ap-southeast-1:507b214d-b57c-455b-b627-fe2bddee56f3\"\
}"

STORAGECONFIG="{\
  \"region\": \"ap-southeast-1\",\
  \"bucketName\": \"fcjdmsstore\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG,\
\"storage\":$STORAGECONFIG\
}"