var fs = require('fs');
var jimp = require('jimp');

const picdir = './picdir/';
const tempdir = './temp/';
const outdir = './output/';
const downloaddir = './download/';

const error = (message) => {
    console.error(message);
    process.exit();
}

//  create temp & output dir

const mkdir = async (dirname) => {
    if (!fs.existsSync(dirname))
        await fs.mkdir(dirname, err => { if (err) error(`Can't create ${dirname}`) });
}
mkdir(tempdir);
mkdir(outdir);
mkdir(downloaddir);

//  get list of image files

const filelist = [];

fs.readdirSync(picdir).forEach(file => {
    const fn = file.match(/^(.*)\.(jpg|jpeg|png|gif)$/gi);
    if (!!fn) {
        filelist.push(fn[0]);
    }
});

//filelist.length = 3;
console.log(`Please wait... Processing ${filelist.length} files...`);

//  create resizer

new Promise(async (resolve, reject) => {

    await filelist.forEach(async (file, index) => {

        await jimp.read(picdir + file)
            .then(async image => {

                const filename = file.substr(0, file.lastIndexOf('.'));
                console.log(`Processing: ${index + 1} / ${filelist.length} ${filename}.jpg`);
                image.greyscale();

                await new jimp(image.bitmap.width + 500, image.bitmap.height + 500, 'white', (err, output) => {

                    //  add canvas border
                    //  save file
                    output
                        .blit(image, 250, 250)
                        .write(tempdir + filename + '.png');

                    console.log(`File written: ${filename}.png`)

                    if (index >= filelist.length - 1) resolve();

                });
            })
            .catch(err => {
                error(`Error in file: ${err} ${file} `);
                reject();
            })

    });

}).then(() => {
    console.log('Conversion done!');
});

