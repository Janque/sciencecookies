#Stop following command execution if command before failed
set -e

#Remove previous bucket if exists
delete_previous_version_if_exists() {
  #We either delete local folder and bucket object or just a bucket
  rm -r ./emulators/emulator-fsdb &&
  gsutil -m rm -r gs://science-cookies.appspot.com/emulator-fsdb||
  gsutil -m rm -r gs://science-cookies.appspot.com/emulator-fsdb
}

export_production_firebase_to_emulator() {
  #Export production firebase to emulator bucket
  gcloud firestore export gs://science-cookies.appspot.com/emulator-fsdb
  
  #Copy to local folder
  gsutil -m cp -r gs://science-cookies.appspot.com/emulator-fsdb emulators
}

#Run bash functions, either delete previous bucket and local folder if exists for update or just export clean way
delete_previous_version_if_exists && export_production_firebase_to_emulator ||
export_production_firebase_to_emulator