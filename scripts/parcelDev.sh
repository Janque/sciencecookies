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
else
    rm -r public/*
fi

mkdir public/vendor/
cp -r src/vendor/* public/vendor

npx parcel $(cat scripts/toCompile) --dist-dir public