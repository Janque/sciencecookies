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


npx parcel build $(cat scripts/toCompile) --dist-dir public