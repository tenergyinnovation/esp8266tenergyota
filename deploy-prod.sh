
# PROJECT_ID=gcloud-ota-update
PROJECT_ID=esp8266tenergyota
gcloud config set project $PROJECT_ID
gcloud functions deploy insertFirmwaresOnBigquery --runtime nodejs8 --trigger-resource $PROJECT_ID-firmwares --trigger-event google.storage.object.finalize
gcloud functions deploy getDownloadUrl --runtime nodejs8 --trigger-http