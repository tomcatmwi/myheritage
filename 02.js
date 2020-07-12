const { Builder, By, Key, until } = require('selenium-webdriver');

const fs = require('fs');

const username = 'XXX ENTER YOUR USERNAME (EMAIL) HERE XXX';
const password = 'XXX ENTER YOUR PASSWORD HERE XXX';

//  Change this to the full path of the /temp directory - Selenium will use it
const imagePath = 'D:\\Project\\myheritage\\temp\\';

const filelist = [];
console.log('Reading file list...');
fs.readdirSync(imagePath).forEach(file => {
    const fn = file.match(/^(.*)\.(jpg|jpeg|png|gif)$/gi);
    if (!!fn) {
        filelist.push(fn[0]);
    }
});

console.log(`${filelist.length} files found.`);

(async function example() {

    let driver = await new Builder().forBrowser('chrome').build();

    try {

        //  Navigate to URL
        await driver.get('https://www.myheritage.com/incolor');
        console.log('MyHeritage page loaded.');

        //  Log in user with Google
        await driver.wait(until.elementLocated(By.className('user_strip_item user_strip_item_1')), 10000);
        await driver.findElement(By.className('user_strip_item user_strip_item_1')).click();

        await driver.wait(until.elementLocated(By.id('email')), 10000);
        await driver.findElement(By.id('email')).click();
        await driver.findElement(By.id('email')).sendKeys(username);
        await driver.findElement(By.id('password')).click();
        await driver.findElement(By.id('password')).sendKeys(password);
        await driver.findElement(By.id('loginPopupButton')).click();

        //  Detect when login is completed
        console.log('Waiting for login.');
        await driver.wait(until.elementLocated(By.id('user_strip_account_drop_down_my_account_id')));
        console.log('Login seems to be completed!');

        //  Click upload button
        console.log('Clicking upload button...');

        doStuff = (filename) => {

            return new Promise((finalResolve, finalReject) => {
                (async () => {

                    console.log('3 seconds...');
                    await new Promise(resolve => { setTimeout(() => resolve(), 3000) });

                    //  Feed file into upload dialog and press Enter
                    await driver.wait(until.elementLocated(By.name('image')));
                    await driver.findElement(By.name('image')).sendKeys(imagePath + filename);

                    //  Wait until the image is processed
                    //  This doesn't seem to work btw
                    console.log('Waiting for processing...')
                    await driver.wait(until.elementLocated(By.xpath("//*[text() = 'Your colorized photo is ready!']")));
                    console.log('Processing completed!');

                    //  Download image
                    console.log('Waiting 3 seconds...')
                    await new Promise(resolve => { setTimeout(() => resolve(), 3000) });
                    await driver.wait(until.elementLocated(By.className('copy_link_to_clipboard_text')));
                    console.log('Waiting for dropdown to appear...');
                    await driver.wait(until.elementLocated(By.className('selector_wrapper download_photo_options_selector')));
                    console.log('Appeared!');

                    ok = false;
                    while (!ok) {
                        try {
                            console.log('Attempting to open dropdown...');
                            await driver.findElement(By.className('selector_wrapper download_photo_options_selector')).click();
                            ok = true;
                        } catch (e) {
                            ok = false;
                            await new Promise(resolve => { setTimeout(() => resolve(), 1000) });
                        }
                    }

                    ok = false;
                    while (!ok) {
                        try {
                            console.log('Attempting to download...');
                            await driver.findElement(By.className('inverse selector_item colorized_photo_item')).click();
                            ok = true;
                        } catch (e) {
                            ok = false;
                            await new Promise(resolve => { setTimeout(() => resolve(), 1000) });
                        }
                    }

                    await new Promise(resolve => { setTimeout(() => resolve(), 3000) });
                    console.log('Loop ended.');
                    await driver.navigate().refresh();
                    await new Promise(resolve => { setTimeout(() => resolve(), 3000) });
                    finalResolve();
                })();

            });
        }

        let counter = 0;

        const loop = async () => {
            console.log(`Counter = ${counter} / ${filelist.length}`);
            await doStuff(filelist[counter]).then(
                () => {
                    counter++;
                    loop();
                });
        }

        loop();

        console.log('Completed.');
        // driver.quit();

    }
    catch (err) {
        console.log('ERROR! ', err);
    }


})();