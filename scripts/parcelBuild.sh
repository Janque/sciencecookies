rm functions/views/includes/*
cp -r src/includes/* functions/views/includes

rm functions/views/layouts/*
cp -r src/layouts/* functions/views/layouts

rm -r public

npx parcel build src/*.pug src/localized/en_ALL/*.pug src/docs/*.pug src/styles/*.scss src/js/*.js src/img/scmed/* src/img/NLogoHalignT.svg src/img/logoT.svg src/img/wlogoT.svg src/publicidad/* --dist-dir public