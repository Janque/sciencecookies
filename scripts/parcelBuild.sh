rm functions/views/includes/*
if [ ! -d "functions/views/includes" ] 
then
    mkdir functions/views/includes
fi
cp -r src/includes/* functions/views/includes


rm functions/views/layouts/*
if [ ! -d "functions/views/layouts" ] 
then
    mkdir functions/views/layouts
fi
cp -r src/layouts/* functions/views/layouts


if [ ! -d "public" ] 
then
    mkdir public
fi
rm -r public


npx parcel build src/*.pug src/localized/en_ALL/*.pug src/docs/*.pug src/styles/*.scss src/js/*.js src/img/scmed/* src/img/NLogoHalignT.svg src/img/logoT.svg src/img/wlogoT.svg src/publicidad/* src/vendor/bootstrap/bootstrap.scss src/vendor/bootstrap/bootstrap.bundle.min.js src/vendor/font-awesome/css/all.min.css src/vendor/font-awesome/webfonts/* --dist-dir public