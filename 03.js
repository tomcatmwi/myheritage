var fs = require('fs');
var jimp = require('jimp');

const picdir = './picdir/';
const tempdir = './temp/';
const outdir = './output/';

const error = (message) => {
    console.error(message);
    process.exit();
}

//  get list of image files
const filelist = [];

fs.readdirSync(tempdir).forEach(file => {
    const fn = file.match(/^(.*)\.(jpg|jpeg|png|gif)$/gi);
    if (!!fn) {
        filelist.push(fn[0]);
    }
});

console.log(`Please wait... Processing ${filelist.length} files...`);

new Promise(async (resolve, reject) => {

    await filelist.forEach(async (file, index) => {

        await jimp.read(tempdir + file)
            .then(async image => {

                const filename = file.substr(0, file.lastIndexOf('.'));
                image
                    .crop(250, 250, image.bitmap.width - 500, image.bitmap.height - 500)
                    .quality(90)
                    .write(outdir + filename + '.jpg');
                console.log(`File written: ${filename}.jpg`)
                if (index >= filelist.length - 1) resolve();
            })
            .catch(err => {
                error(`Error in file: ${err} ${file} `);
                reject();
            })

    });

}).then(() => {
    console.log('Conversion done!');
});

