
#!/bin/bash
set -e
IFS='|'

AUTHCONFIG="{\
\"userPoolId\": \"ap-southeast-1_ClqyVYv6m\",\
\"webClientId\": \"4rt2l9rmqe24vb79pupblc30o0\",\
\"nativeClientId\": \"4rt2l9rmqe24vb79pupblc30o0\",\
\"identityPoolId\": \"ap-southeast-1:507b214d-b57c-455b-b627-fe2bddee56f3\"\
}"

AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":true,\
\"profileName\":\"default\"\
}"

AMPLIFY="{\
\"envName\":\"fcjdms\"\
}"

PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

STORAGECONFIG="{\
  \"region\": \"ap-southeast-1\",\
  \"bucketName\": \"fcjdmsstore\"\
}"

CATEGORIES="{\
\"auth\":$AUTHCONFIG,\
\"storage\":$STORAGECONFIG\
}"

amplify init \
--amplify $AMPLIFY \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes